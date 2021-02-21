import * as Zod from "zod";

// index/show, create, update, delete
// SESSIONS + array of ids
// SESSION + one id

// const MessageTypes = Zod.enum(["ANSWER", "OFFER", "SESSION", "SESSIONS"]);

// type MessageTypes = Zod.infer<typeof MessageTypes>;

// data: Zod.union([Zod.record(Zod.unknown()), Zod.array(Zod.unknown())]),
const MessageOptions = Zod.object({
  id: Zod.string().optional(),
  ids: Zod.array(Zod.string()).optional(),
  offer: Zod.object({
    sdp: Zod.string().optional(),
    type: Zod.enum(["offer", "answer", "pranswer", "rollback"]).optional(),
  }).optional(),
  answer: Zod.object({
    sdp: Zod.string().optional(),
    type: Zod.enum(["offer", "answer", "pranswer", "rollback"]).optional(),
  }).optional(),
});

type MessageOptions = Zod.infer<typeof MessageOptions>;

// offer, answer, candidate, success
class Message {
  static parse(data: unknown): Message {
    return new Message(MessageOptions.parse(JSON.parse(String(data))));
  }

  messageOptions: MessageOptions;
  id?: string;
  ids?: string[];

  offer?: {
    sdp?: string;
    type?: RTCSdpType;
  };

  answer?: {
    sdp?: string;
    type?: RTCSdpType;
  };

  constructor(messageOptions: MessageOptions) {
    this.messageOptions = messageOptions;
    // this.type = messageOptions.type;
    this.id = messageOptions.id;
    this.ids = messageOptions.ids;
    // this.data = messageOptions.data;
    this.offer = messageOptions.offer;
    this.answer = messageOptions.answer;
  }

  toString(): string {
    return JSON.stringify(this.messageOptions);
  }
}

export default Message;

// try {
//   Connection.all.forEach((session) => {
//     if (session.webSocket == target) return;

//     session.webSocket.send(
//       JSON.stringify(
//         Zod.record(Zod.unknown()).parse(JSON.parse(String(data)))
//       )
//     );
//   });
// } catch (e) {
//   this.log(e, "error");
// }
