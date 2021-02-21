import Logger from "../shared/logger";
import Message from "../shared/message";
import WindowApplication from "./window-application";

class PeerConnectionManager {
  static readonly RTC_CONFIGURATION = {
    iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
    sdpSemantics: "unified-plan",
  };

  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  app: WindowApplication;
  connection = this.create();
  log = Logger.log.bind(this);

  constructor(app: WindowApplication) {
    this.app = app;

    // globalThis.navigator.mediaDevices
    //   .getUserMedia(PeerConnectionManager.CONSTRAINTS)
    //   .then((x) => this.handleStream(x))
    //   .catch((x) => this.log(x, "error"));

    // this.webSocketManager.send(
    //   new Message({
    //     type: "OFFER",
    //     data: { sdp: this.connection.localDescription },
    //   })
    // );
  }

  //when another user answers to our offer
  // function onAnswer(answer) {
  //   myConnection.setRemoteDescription(new RTCConnectionDescription(answer));
  // }

  //when we got ice candidate from another user
  // function onCandidate(candidate) {
  //   myConnection.addIceCandidate(new RTCIceCandidate(candidate));
  // }

  async makeCall(id: string): Promise<void> {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.app.webSocketManager.send(
      new Message({
        id,
        offer,
      })
    );
  }

  async answer(offer: RTCSessionDescriptionInit): Promise<void> {
    const rtcSessionDescription = new RTCSessionDescription(offer);
    await this.connection.setRemoteDescription(rtcSessionDescription);
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    this.app.webSocketManager.send(new Message({ answer }));
  }

  create(): RTCPeerConnection {
    const connection = new RTCPeerConnection(
      PeerConnectionManager.RTC_CONFIGURATION
    );

    connection.onconnectionstatechange = (x) => this.log(x);
    connection.ondatachannel = (x) => this.log(x);
    connection.onicecandidate = (x) => this.iceCandidate(x);
    connection.onicecandidateerror = (x) => this.log(x, "error");
    connection.oniceconnectionstatechange = (x) => this.log(x);
    connection.onicegatheringstatechange = (x) => this.log(x);
    connection.onnegotiationneeded = (x) => this.log(x);
    connection.onsignalingstatechange = (x) => this.log(x);
    connection.onstatsended = (x) => this.log(x);
    connection.ontrack = (x) => this.log(x);
    return connection;
  }

  connectionStateChange(event: Event): void {
    this.log(`connectionStateChange: ${this.connection.connectionState}`);
  }

  iceCandidate(event: RTCPeerConnectionIceEvent): void {
    this.log("iceCandidate");
    if (!event.candidate) return;

    this.connection
      .addIceCandidate(event.candidate)
      .catch((x) => this.log(x, "error"));
    // this.webSocketManager.send(
    //   JSON.stringify({
    //     name: "TODO",
    //     type: "candidate",
    //     candidate: event.candidate,
    //   })
    // );
  }

  handleStream(stream: MediaStream): void {
    stream.getTracks().forEach((x) => this.connection.addTrack(x));
  }
}

export default PeerConnectionManager;
