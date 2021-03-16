// import Message from "./message";
// import WebSocketManager from "./web-socket-manager";
// import BrowserApplication from "..";

// class PeerConnectionManager {
//   static all = new Map<string, PeerConnectionManager>();

//   static readonly CONFIG = {
//     iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
//     sdpSemantics: "unified-plan",
//   };

//   static readonly CONSTRAINTS = {
//     video: true,
//     audio: true,
//   };

//   id: string;

//   app: BrowserApplication;

//   wsm: WebSocketManager;

//   connection: RTCPeerConnection;

//   constructor(id: string, app: BrowserApplication, wsm: WebSocketManager) {
//     this.id = id;
//     this.app = app;
//     this.wsm = wsm;
//     this.connection = this.create();
//     PeerConnectionManager.all.set(this.id, this);
//   }

//   create(): RTCPeerConnection {
//     const connection = new RTCPeerConnection(PeerConnectionManager.CONFIG);

//     connection.onicecandidate = (x) => this.iceCandidate(x); // TODO
//     connection.oniceconnectionstatechange = (x) =>
//       this.iceConnectionStateChange(x); // TODO
//     // ondatachannel
//     connection.onnegotiationneeded = (x) => this.negotiationNeeded(x); // TODO
//     connection.ontrack = (x) => this.track(x); // TODO

//     connection.onconnectionstatechange = (x) =>
//       this.app.logger(connection.connectionState);
//     // connection.ondatachannel = (x) => this.logger(x);
//     connection.onicecandidateerror = (x) => this.app.logger(x, "error");
//     // connection.onicegatheringstatechange = (x) => this.logger(x);
//     // connection.onsignalingstatechange = (x) => this.logger(x);
//     // connection.onstatsended = (x) => this.logger(x);

//     return connection;
//   }

//   // 2)
//   async makeCall(): Promise<void> {
//     const offer = await this.connection.createOffer();
//     await this.connection.setLocalDescription(offer);

//     this.wsm.send(
//       new Message({
//         sender: this.app.id,
//         recipient: this.id,
//         offer,
//       })
//     );
//   }

//   // 4)
//   async answer(offer: RTCSessionDescriptionInit): Promise<void> {
//     await this.connection.setRemoteDescription(
//       new RTCSessionDescription(offer)
//     );

//     const answer = await this.connection.createAnswer();
//     await this.connection.setLocalDescription(answer);

//     this.wsm.send(
//       new Message({ sender: this.app.id, recipient: this.id, answer })
//     );
//   }

//   connectionStateChange(event: Event): void {
//     this.app.logger(
//       `connectionStateChange: ${this.connection.connectionState}`
//     );
//   }

//   iceCandidate(event: RTCPeerConnectionIceEvent): void {
//     this.app.logger("iceCandidate");
//     if (!event.candidate) return;

//     this.wsm.send(
//       new Message({
//         sender: this.app.id,
//         recipient: this.id,
//         candidate: event.candidate,
//       })
//     );
//   }

//   iceConnectionStateChange(event: Event): void {
//     this.app.logger("iceConnectionStateChange");
//   }

//   negotiationNeeded(event: Event): void {
//     this.app.logger("negotiationNeeded");
//   }

//   track(event: RTCTrackEvent): void {
//     this.app.logger("track");
//   }

//   handleStream(stream: MediaStream): void {
//     stream.getTracks().forEach((x) => this.connection.addTrack(x));
//   }
// }

// Object.assign(globalThis, { PeerConnectionManager });
// export default PeerConnectionManager;
