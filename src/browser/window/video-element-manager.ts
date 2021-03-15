import * as Zod from "zod";
import BrowserApplication from "..";

class VideoElementManager {
  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  app: BrowserApplication;

  private _element?: HTMLVideoElement;
  private _stream?: MediaStream;

  constructor(app: BrowserApplication) {
    this.app = app;

    globalThis.navigator.mediaDevices
      .getUserMedia(VideoElementManager.CONSTRAINTS)
      .then((x) => (this.stream = x))
      .catch((x) => this.app.logger(x, "error"));
  }

  get element(): HTMLVideoElement {
    return Zod.instanceof(HTMLVideoElement).parse(this._element);
  }

  set element(element: HTMLVideoElement) {
    element.onerror = (ev) => this.app.logger(ev, "error");
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
    stream.onaddtrack = (ev) => this.app.logger(ev);
    stream.onremovetrack = (ev) => this.app.logger(ev);
    this.element = globalThis.document.createElement("video");
    this.element.srcObject = stream;
    this._stream = stream;
  }
}

export default VideoElementManager;
