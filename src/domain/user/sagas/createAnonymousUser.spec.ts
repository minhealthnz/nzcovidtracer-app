import { nanoid } from "@reduxjs/toolkit";
import { expectSaga } from "redux-saga-test-plan";

import { setAnonymousUser } from "../reducer";
import { User } from "../types";
import { createAnonymousUser } from "./createAnonymousUser";

it("#createAnonymousUser", async () => {
  const anonymousUser: User = {
    id: nanoid(),
  };
  const create = async () => {
    return anonymousUser;
  };
  await expectSaga(createAnonymousUser, create)
    .put(setAnonymousUser(anonymousUser))
    .call(create)
    .run();
});
