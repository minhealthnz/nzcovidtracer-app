import { createPrivate, createPublic } from "@db/create";
import { _persistorRef } from "@lib/storeRefs";

export interface ClearStateOptions {
  clearDb?: boolean;
  clearPersistor?: boolean;
}

export async function clearState(options?: ClearStateOptions) {
  const clearDb = options?.clearDb ?? true;
  const clearPersistor = options?.clearPersistor ?? true;
  if (clearDb) {
    const privateDb = await createPrivate();
    privateDb.write(() => {
      privateDb.deleteAll();
    });
    privateDb.close();
    const publicDb = await createPublic();
    publicDb.write(() => {
      publicDb.deleteAll();
    });
    publicDb.close();
  }
  if (clearPersistor) {
    _persistorRef.current?.purge();
  }
}
