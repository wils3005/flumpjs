import ClientBase from "./client-base";
import LogLevel from "../log-level";

class PeerConnectionManager extends ClientBase {
  static all = new Set<PeerConnectionManager>();

  static readonly RTC_CONFIGURATION = {
    iceServers: [{ urls: "stun:stun.1.google.com:19302" }],
    sdpSemantics: "unified-plan",
  };

  static readonly CONSTRAINTS = {
    video: true,
    audio: true,
  };

  connection: RTCPeerConnection;
  webSocket: WebSocket;

  constructor(
    connection = new RTCPeerConnection(PeerConnectionManager.RTC_CONFIGURATION),
    webSocket: WebSocket
  ) {
    super();
    this.connection = connection;
    this.handleConnection(this.connection);
    this.webSocket = webSocket;

    globalThis.navigator.mediaDevices
      .getUserMedia(PeerConnectionManager.CONSTRAINTS)
      .then((x) => this.handleStream(x))
      .catch((x) => this.log(x, LogLevel.ERROR));

    this.connection
      .createOffer()
      .then((x) => this.handleOffer(x))
      .catch((x) => this.log(x, LogLevel.ERROR));

    this.webSocket.send(
      JSON.stringify({ sdp: this.connection.localDescription })
    );
    PeerConnectionManager.all.add(this);
  }

  //when another user answers to our offer
  // function onAnswer(answer) {
  //   myConnection.setRemoteDescription(new RTCSessionDescription(answer));
  // }

  //when we got ice candidate from another user
  // function onCandidate(candidate) {
  //   myConnection.addIceCandidate(new RTCIceCandidate(candidate));
  // }

  answer(offer: RTCSessionDescriptionInit): void {
    const rtcSessionDescription = new RTCSessionDescription(offer);
    this.connection
      .setRemoteDescription(rtcSessionDescription)
      .catch((x) => this.log(x, LogLevel.ERROR));

    this.connection
      .createAnswer()
      .then((x) => this.asdf(x))
      .catch((x) => this.log(x, LogLevel.ERROR));
  }

  asdf(answer: RTCSessionDescriptionInit) {
    this.connection
      .setLocalDescription(answer)
      .catch((x) => this.log(x, LogLevel.ERROR));

    // this.webSocket.send({
    //   type: "answer",
    //   answer: answer,
    // });
  }

  handleConnection(connection: RTCPeerConnection): void {
    connection.onconnectionstatechange = (x) => this.log(x);
    connection.ondatachannel = (x) => this.log(x);
    connection.onicecandidate = (x) => this.handleIceCandidate(x);
    connection.onicecandidateerror = (x) => this.log(x, LogLevel.ERROR);
    connection.oniceconnectionstatechange = (x) => this.log(x);
    connection.onicegatheringstatechange = (x) => this.log(x);
    connection.onnegotiationneeded = (x) => this.log(x);
    connection.onsignalingstatechange = (x) => this.log(x);
    connection.onstatsended = (x) => this.log(x);
    connection.ontrack = (x) => this.log(x);
  }

  handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
    this.log("handleIceCandidate");
    if (!event.candidate) return;

    // this.webSocket.send(
    //   JSON.stringify({
    //     name: "TODO",
    //     type: "candidate",
    //     candidate: event.candidate,
    //   })
    // );
  }

  handleOffer(init: RTCSessionDescriptionInit): void {
    this.connection
      .setLocalDescription(init)
      .catch((x) => this.log(x, LogLevel.ERROR));
  }

  handleStream(stream: MediaStream): void {
    stream.getTracks().forEach((x) => this.connection.addTrack(x));
  }
}

export default PeerConnectionManager;
