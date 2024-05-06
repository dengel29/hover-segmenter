import { controller, target } from "@github/catalyst";
import { throttle } from "@github/mini-throttle/decorators";

type CaretPositionFromPoint = Range & {
  offsetNode: CharacterData;
  offset: Number;
};

type Segment = {
  index: number;
  input: string;
  isWordLike: boolean;
  segment: string;
};

//@ts-ignore
const segmenter = new Intl.Segmenter("zh-TW", { granularity: "word" });

@controller
class HoverControllerElement extends HTMLElement {
  range: Range | CaretPositionFromPoint | null = null;
  textNode: CharacterData | undefined = undefined;
  offset: Number | undefined = undefined;

  @throttle(30)
  getHoveredWords(e: MouseEvent) {
    if (!e) return;
    if (document.caretPositionFromPoint) {
      //@ts-ignore
      this.range = document.caretPositionFromPoint(
        e.clientX,
        e.clientY
      ) as CaretPositionFromPoint;
      if (!this.range) return;
      this.textNode = this.range.offsetNode;
      this.offset = this.range.offset;
    } else if (document.caretRangeFromPoint) {
      // Use WebKit-proprietary fallback method
      this.range = document.caretRangeFromPoint(e.clientX, e.clientY);
      this.textNode = this.range?.startContainer;
      this.offset = this.range?.startOffset;
    } else {
      // Neither method is supported, do nothing
      return;
    }

    if (this.textNode?.nodeType !== 3) {
      return;
    }

    const segments: Segment[] = Array.from(
      segmenter.segment(this.textNode?.data)
    );
    console.log(segments);
    let segment = segments.find(
      (el: Segment, i: number) => el.index == this.offset
    );
    let segmentString;
    if (segment !== undefined) {
      segmentString = segment?.segment;
    }

    if (segmentString) {
      const selection = document.getSelection();
      selection?.removeAllRanges();
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
      const selectRange = document.createRange();
      selectRange.setStart(this.textNode, this.offset);
      selectRange.setEnd(
        this.textNode,
        this.offset + segmentString.trim().length
      );

      selection?.addRange(selectRange);

      this.dispatchEvent(
        new CustomEvent("newstring", {
          detail: {
            word: segmentString,
          },
        })
      );
    }
  }

  bingo(e: CustomEvent) {
    console.log("hey, ", e.detail.word);
  }
}
