import * as Zod from "zod";
import Logger from "../../shared/logger";
import WindowApplication from ".";

class VideoElementManager {
  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  app: WindowApplication;
  log = Logger.log.bind(this);

  private _element?: HTMLVideoElement;
  private _stream?: MediaStream;

  constructor(app: WindowApplication) {
    this.app = app;

    globalThis.navigator.mediaDevices
      .getUserMedia(VideoElementManager.CONSTRAINTS)
      .then((x) => (this.stream = x))
      .catch((x) => this.log(x, "error"));
  }

  get element(): HTMLVideoElement {
    return Zod.instanceof(HTMLVideoElement).parse(this._element);
  }

  set element(element: HTMLVideoElement) {
    element.onerror = (ev) => this.log(ev, "error");
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
