import { query } from "@db/entities/checkInItem";
import { selectMatches } from "@features/exposure/selectors";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { mapDiaryEntry } from "../mappers";
import { selectUserIds } from "../selectors";
import { DiaryEntry } from "../types";
import {
  addEmptySections,
  DiarySectionData,
  groupByStartDate,
  mapSectionData,
} from "./useDiarySections";

export const useEntireDiary = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sections, setSections] = useState<DiarySectionData[]>([]);
  const [allEntries, setAllEntries] = useState<DiaryEntry[]>([]);

  const userIds = useSelector(selectUserIds);
  const matches = useSelector(selectMatches);

  const queryAllData = async () => {
    const rows = await query(userIds, new Date(), "ALL");
    const diaryEntries: DiaryEntry[] = rows.map((i) =>
      mapDiaryEntry(i, matches),
    );
    const currentStartOfDay = new Date(
      moment(new Date()).startOf("day").valueOf(),
    );
    const sectionList = groupByStartDate(diaryEntries);
    const fullSectionList = addEmptySections(sectionList, currentStartOfDay);
    const mappedSectionList = mapSectionData(
      fullSectionList,
      currentStartOfDay,
    );

    const data: DiarySectionData[] = mappedSectionList.map((section, index) => {
      const startOfDay = section.startOfDay;

      const sectionDate = moment(startOfDay);

      const title =
        sectionDate.year() === moment().year()
          ? sectionDate.format("dddd, D MMMM")
          : sectionDate.format("dddd, D MMMM YYYY");
      const showOldDiaryTitle = section.showOldDiaryTitle;

      return {
        title: title,
        data: section.entries,
        showOldDiaryTitle,
        startOfDay,
        isLastSection: index === mappedSectionList.length - 1,
      };
    });

    setSections(data);
    setAllEntries(diaryEntries);
    setLoading(false);
  };

  useEffect(() => {
    queryAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sections, allEntries, loading };
};
