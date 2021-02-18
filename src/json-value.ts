import * as Zod from "zod";

type JSONValue =
  | { [index: string]: JSONValue }
  | JSONValue[]
  | boolean
  | null
  | number
  | string;

const JSONValue: Zod.ZodSchema<JSONValue> = Zod.lazy(() => {
  return Zod.union([
    Zod.record(JSONValue),
    Zod.array(JSONValue),
    Zod.boolean(),
    Zod.null(),
    Zod.number(),
    Zod.string(),
  ]);
});

export default JSONValue;
