import covidTracer from "@db/covidTracerMigration";
import { toByteArray } from "base64-js";

export async function randomBytes() {
  if (covidTracer.randomBytes == null) {
    throw new Error("not implemented");
  }
  const bytes = await covidTracer.randomBytes();
  return toByteArray(bytes);
}
