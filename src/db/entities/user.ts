import { nanoid } from "@reduxjs/toolkit";
import { UpdateMode } from "realm";

import { createPrivate } from "../create";
import { UserEntity } from "./entities";

export interface User {
  id: string;
  nhi?: string;
  isAnonymous?: boolean;
  alias?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phone?: string;
}

export interface UpsertUser {
  id: string;
  nhi?: string;
  isAnonymous?: boolean;
}

export interface UpdateUser {
  nhi?: string;
  alias?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const update = async (
  id: string,
  modify: (user: UpdateUser) => void,
) => {
  const privateDb = await createPrivate();
  const user: User | undefined = privateDb.objectForPrimaryKey(UserEntity, id);
  if (user == null) {
    throw new Error(`User with id '${id}' not found!`);
  }
  privateDb.write(() => {
    modify(user);
  });
  privateDb.close();
};

export const upsertMany = async (items: UpsertUser[]) => {
  const privateDb = await createPrivate();
  privateDb.write(() => {
    for (const item of items) {
      privateDb.create<User>(
        UserEntity,
        { ...item, isAnonymous: item.isAnonymous ?? false },
        UpdateMode.Modified,
      );
    }
  });
  privateDb.close();
};

export const find = async (id: string): Promise<User | undefined> => {
  const privateDb = await createPrivate();
  const result = privateDb.objectForPrimaryKey<User>(UserEntity, id)?.toJSON();
  privateDb.close();
  return result;
};

export const count = async () => {
  const privateDb = await createPrivate();
  const result = privateDb.objects(UserEntity).length;
  privateDb.close();
  return result;
};

export async function createAnonymousUser(): Promise<User> {
  const privateDb = await createPrivate();
  const results = privateDb
    .objects(UserEntity)
    .filtered("isAnonymous = $0", true)
    .toJSON();
  if (results.length > 1) {
    privateDb.close();
    throw new Error("More than one anonymous user found!");
  }
  if (results.length === 1) {
    const user = results[0];
    privateDb.close();
    return user;
  }
  const created = {
    id: nanoid(),
    isAnonymous: true,
  };
  privateDb.write(() => {
    privateDb.create<User>(UserEntity, created, UpdateMode.Never);
  });
  privateDb.close();
  return created;
}

export async function getAll(): Promise<User[]> {
  const privateDb = await createPrivate();
  const results = privateDb.objects(UserEntity).toJSON();
  privateDb.close();
  return results;
}
