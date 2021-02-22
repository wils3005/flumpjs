import * as Zod from "zod";

const RTCSessionDescriptionInit = Zod.object({
  sdp: Zod.string().optional(),
  type: Zod.enum(["answer", "offer", "pranswer", "rollback"]).optional(),
});

type RTCSessionDescriptionInit = Zod.infer<typeof RTCSessionDescriptionInit>;

const MessageOptions = Zod.object({
  sender: Zod.string(),
  recipient: Zod.string(),
  ids: Zod.array(Zod.string()).optional(),
  offer: RTCSessionDescriptionInit.optional(),
  answer: RTCSessionDescriptionInit.optional(),
  candidate: Zod.unknown().optional(),
});

type MessageOptions = Zod.infer<typeof MessageOptions>;

class Message {
  static parse(data: unknown): Message {
    return new Message(MessageOptions.parse(JSON.parse(String(data))));
  }

  messageOptions: MessageOptions;
  sender: string;
  recipient: string;
  ids?: string[];
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: unknown;

  constructor(messageOptions: MessageOptions) {
    this.messageOptions = messageOptions;
    // this.type = messageOptions.type;
    this.sender = messageOptions.sender;
    this.recipient = messageOptions.recipient;
    this.ids = messageOptions.ids;
    this.offer = messageOptions.offer;
    this.answer = messageOptions.answer;
    this.candidate = messageOptions.candidate;
  }

  toString(): string {
    return JSON.stringify(this.messageOptions);
  }
}

export default Message;
