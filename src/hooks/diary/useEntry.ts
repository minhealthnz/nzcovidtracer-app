import { selectById } from "@features/diary/selectors";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function useEntry(id: string) {
  const byId = useSelector(selectById);
  const entry = useMemo(() => byId[id], [byId, id]);
  const [lastEntry, setLastEntry] = useState(entry);

  useEffect(() => {
    if (entry == null) {
      return;
    }

    setLastEntry(entry);
  }, [entry]);

  return lastEntry;
}
