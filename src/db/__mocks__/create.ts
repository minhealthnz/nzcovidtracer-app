import {
  CheckInItemMatchSchema,
  CheckInItemPublicSchema,
  CheckInItemSchema,
  UserSchema,
} from "@db/schemas";
import Realm from "realm";

export const createPrivate = async () => {
  return await Realm.open({
    schema: [CheckInItemSchema, UserSchema],
  });
};

export const createPublic = async () => {
  return await Realm.open({
    schema: [CheckInItemPublicSchema, CheckInItemMatchSchema],
  });
};
