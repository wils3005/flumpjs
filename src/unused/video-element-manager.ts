// import * as Zod from "zod";
// import Config from "../../config";

// class VideoElementManager {
//   static readonly CONSTRAINTS = {
//     video: true,
//     audio: true,
//   };

//   config: Config;

//   logger: typeof Config.prototype.logger;

//   private _element?: HTMLVideoElement;

//   private _stream?: MediaStream;

//   constructor(config: Config) {
//     this.config = config;
//     this.logger = config.logger.bind(this);

//     globalThis.navigator.mediaDevices
//       .getUserMedia(VideoElementManager.CONSTRAINTS)
//       .then((x) => (this.stream = x))
//       .catch((x) => this.logger(x, "error"));

//     this.logger("constructor");
//   }

//   get element(): HTMLVideoElement {
//     return Zod.instanceof(HTMLVideoElement).parse(this._element);
//   }

//   set element(element: HTMLVideoElement) {
//     element.onerror = (ev) => this.logger(ev, "error");
//     element.autoplay = true;

//     // local or remote stream?
//     element.muted = true;
//     Zod.instanceof(HTMLElement)
//       .parse(document.querySelector("section#video"))
//       .appendChild(element);

//     this._element = element;
//   }

//   get stream(): MediaStream {
//     return Zod.instanceof(MediaStream).parse(this._stream);
//   }

//   set stream(stream: MediaStream) {
//     stream.onaddtrack = (ev) => this.logger(ev);
//     stream.onremovetrack = (ev) => this.logger(ev);
//     this.element = globalThis.document.createElement("video");
//     this.element.srcObject = stream;
//     this._stream = stream;
//   }
// }

// export default VideoElementManager;
