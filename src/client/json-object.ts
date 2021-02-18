import * as Zod from "zod";

type JSONValueType =
  | { [index: string]: JSONValueType }
  | JSONValueType[]
  | boolean
  | null
  | number
  | string;

type JSONObjectType = { [index: string]: JSONValueType } | JSONValueType[];

class JSONObject {
  static valueSchema: Zod.ZodSchema<JSONValueType> = Zod.lazy(() => {
    return Zod.union([
      Zod.record(JSONObject.valueSchema),
      Zod.array(JSONObject.valueSchema),
      Zod.boolean(),
      Zod.null(),
      Zod.number(),
      Zod.string(),
    ]);
  });

  static objectSchema: Zod.ZodSchema<JSONObjectType> = Zod.lazy(() => {
    return Zod.union([
      Zod.record(JSONObject.valueSchema),
      Zod.array(JSONObject.valueSchema),
    ]);
  });

  value: unknown;
  parsed: { [index: string]: JSONValueType } | JSONValueType[];

  constructor(value: unknown) {
    this.value = value;
    this.parsed = JSONObject.objectSchema.parse(JSON.parse(String(value)));
  }
}

export default JSONObject;
