import {
  loadNextPage,
  refresh,
  startPaginationSession,
  stopPagniationSession,
} from "@features/diary/reducer";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectById, selectSessions } from "../selectors";

export function usePaginationSession(userIds?: string[]) {
  const [sessionId] = useState(nanoid());

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      startPaginationSession({
        sessionId,
        userIds,
      }),
    );

    return () => {
      dispatch(stopPagniationSession(sessionId));
    };
  }, [dispatch, sessionId, userIds]);

  const _refresh = () => {
    dispatch(refresh(sessionId));
  };

  const _loadNextPage = () => {
    dispatch(loadNextPage(sessionId));
  };

  const sessions = useSelector(selectSessions);
  const byId = useSelector(selectById);

  const querying = useMemo(
    () => sessions[sessionId]?.querying ?? false,
    [sessions, sessionId],
  );

  const diaryEntries = useMemo(() => {
    if (sessions[sessionId] == null) {
      return [];
    }
    return sessions[sessionId].allIds.map((id) => byId[id]);
  }, [sessions, sessionId, byId]);

  return {
    refresh: _refresh,
    loadNextPage: _loadNextPage,
    querying,
    diaryEntries,
  };
}
