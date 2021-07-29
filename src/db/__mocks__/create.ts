import {
  CheckInItemMatchSchema,
  CheckInItemPublicSchema,
  CheckInItemSchema,
  LocationSchema,
  UserSchema,
} from "@db/entities/schemas";
import Realm from "realm";

export const createPrivate = async () => {
  return await Realm.open({
    schema: [CheckInItemSchema, UserSchema, LocationSchema],
  });
};

export const createPublic = async () => {
  return await Realm.open({
    schema: [CheckInItemPublicSchema, CheckInItemMatchSchema],
  });
};
