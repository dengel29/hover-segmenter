//@ts-nocheck
import { controller, target } from "@github/catalyst";
import * as Comlink from "comlink";
import translate from "@iamtraction/google-translate";
import Cedict from "@tykok/cedict-dictionary";

// const worker = "../worker";

@controller
class HoverContainerElement extends HTMLElement {
  @target declare english: HTMLElement;
  @target declare char: HTMLElement;
  // dictWorker = Comlink.wrap(new Worker(worker, { type: "classic" }));

  connectedCallback() {}

  async bingo(e: CustomEvent) {
    console.log("bingo");
    const word = e.detail.word;
    // send to worker, which finds in dictionary
    // WebWorkers use `postMessage` and therefore work with Comlink.
    // const termEntry = await this.dictWorker.findTerm(word);
    // console.log("hey", termEntry);
    // receives english + pinyin
    try {
      const entries = Cedict.getByTraditional(e.detail.word.trim());
      console.log(entries);

      if (entries.length === 0) throw new Error("no entries");
      const rt = `<rt>${entries[0].pinyin}</rt>`;
      this.char.innerHTML = `
      ${e.detail.word}
      `;
      const eng = entries[0].english.join(";");
      this.english.textContent = eng;
    } catch (e) {
      return;
    }
  }
}
