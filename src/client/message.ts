import * as Zod from "zod";

// offer, answer, candidate, success
class Message {
  // static schema = Zod.object({
  //   id: Zod.string(),
  //   type: Zod.string(),
  // });

  static schema = Zod.record(Zod.unknown());

  data: unknown;
  parsedData: Zod.infer<typeof Message.schema>;

  constructor(data: unknown) {
    this.data = data;
    this.parsedData = Message.schema.parse(JSON.parse(String(this.data)));
  }
}

export default Message;
