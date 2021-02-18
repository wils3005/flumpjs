import * as Zod from "zod";
import JSONValue from "./json-value";

type JSONObject = { [index: string]: JSONValue } | JSONValue[];

const JSONObject: Zod.ZodSchema<JSONObject> = Zod.lazy(() => {
  return Zod.union([Zod.record(JSONObject), Zod.array(JSONObject)]);
});

export default JSONObject;
