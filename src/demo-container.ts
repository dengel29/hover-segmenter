import { controller, target } from "@github/catalyst";

class DemoContainerElement extends HTMLElement {
  @target switch: HTMLElement;
}
