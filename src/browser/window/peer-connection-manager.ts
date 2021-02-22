import Logger from "../../shared/logger";
import Message from "./message";
import WebSocketManager from "./web-socket-manager";
import WindowApplication from ".";

class PeerConnectionManager {
  static all = new Map<string, PeerConnectionManager>();

  static readonly CONFIG = {
    iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
    sdpSemantics: "unified-plan",
  };

  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  id: string;
  app: WindowApplication;
  wsm: WebSocketManager;
  log = Logger.log.bind(this);
  connection: RTCPeerConnection;

  constructor(id: string, app: WindowApplication, wsm: WebSocketManager) {
    this.id = id;
    this.app = app;
    this.wsm = wsm;
    this.connection = this.create();
    PeerConnectionManager.all.set(this.id, this);
  }

  create(): RTCPeerConnection {
    const connection = new RTCPeerConnection(PeerConnectionManager.CONFIG);

    connection.onicecandidate = (x) => this.iceCandidate(x); // TODO
    connection.oniceconnectionstatechange = (x) =>
      this.iceConnectionStateChange(x); // TODO
    connection.onnegotiationneeded = (x) => this.negotiationNeeded(x); // TODO
    connection.ontrack = (x) => this.track(x); // TODO

    connection.onconnectionstatechange = (x) =>
      this.log(connection.connectionState);
    // connection.ondatachannel = (x) => this.log(x);
    connection.onicecandidateerror = (x) => this.log(x, "error");
    // connection.onicegatheringstatechange = (x) => this.log(x);
    // connection.onsignalingstatechange = (x) => this.log(x);
    // connection.onstatsended = (x) => this.log(x);

    return connection;
  }

  // 2)
  async makeCall(): Promise<void> {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.wsm.send(
      new Message({
        sender: this.app.id,
        recipient: this.id,
        offer,
      })
    );
  }

  // 4)
  async answer(offer: RTCSessionDescriptionInit): Promise<void> {
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    this.wsm.send(
      new Message({ sender: this.app.id, recipient: this.id, answer })
    );
  }

  connectionStateChange(event: Event): void {
    this.log(`connectionStateChange: ${this.connection.connectionState}`);
  }

  iceCandidate(event: RTCPeerConnectionIceEvent): void {
    this.log("iceCandidate");
    if (!event.candidate) return;

    this.wsm.send(
      new Message({
        sender: this.app.id,
        recipient: this.id,
        candidate: event.candidate,
      })
    );
  }

  iceConnectionStateChange(event: Event): void {
    this.log("iceConnectionStateChange");
  }

  negotiationNeeded(event: Event): void {
    this.log("negotiationNeeded");
  }

  track(event: RTCTrackEvent): void {
    this.log("track");
  }

  handleStream(stream: MediaStream): void {
    stream.getTracks().forEach((x) => this.connection.addTrack(x));
  }
}

Object.assign(globalThis, { PeerConnectionManager });
export default PeerConnectionManager;
