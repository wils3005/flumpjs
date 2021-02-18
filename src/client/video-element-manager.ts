import * as Zod from "zod";
import ClientBase from "./client-base";
import LogLevel from "../log-level";

class VideoElementManager extends ClientBase {
  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  private _element?: HTMLVideoElement;
  private _stream?: MediaStream;

  constructor() {
    super();
    globalThis.navigator.mediaDevices
      .getUserMedia(VideoElementManager.CONSTRAINTS)
      .then((x) => (this.stream = x))
      .catch((x) => this.log(x, LogLevel.ERROR));
  }

  get element(): HTMLVideoElement {
    return Zod.instanceof(HTMLVideoElement).parse(this._element);
  }

  set element(element: HTMLVideoElement) {
    element.onerror = (ev) => this.log(ev, LogLevel.ERROR);
    element.autoplay = true;

    // local or remote stream?
    element.muted = true;
    Zod.instanceof(HTMLElement)
      .parse(document.querySelector("section#video"))
      .appendChild(element);

    this._element = element;
  }

  get stream(): MediaStream {
    return Zod.instanceof(MediaStream).parse(this._stream);
  }

  set stream(stream: MediaStream) {
    stream.onaddtrack = (ev) => this.log(ev);
    stream.onremovetrack = (ev) => this.log(ev);
    this.element = globalThis.document.createElement("video");
    this.element.srcObject = stream;
    this._stream = stream;
  }
}

export default VideoElementManager;
