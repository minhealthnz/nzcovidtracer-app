import useCurrentDate from "@features/enfExposure/hooks/useCurrentDate";
import { TFunction } from "i18next";
import { isNull } from "lodash";
import moment from "moment-timezone";
import { useMemo } from "react";

import { DiaryEntry } from "../types";

export type DiaryItem = DiaryEntry | "noEntry" | "button";

export interface DiarySectionData {
  title: string;
  data: DiaryItem[];
  ctaTitle?: string;
  ctaCallback?: () => void;
  showOldDiaryTitle: boolean;
  startOfDay: number;
  isLastSection: boolean;
}

export function useDiarySections(
  diaryEntries: DiaryEntry[],
  handleAddEntry: ((startOfDay: number) => void) | null,
  t: TFunction,
) {
  const currentStartOfDay = new Date(
    moment(useCurrentDate()).startOf("day").valueOf(),
  );

  return useMemo(
    () => _useDiarySections(diaryEntries, handleAddEntry, t, currentStartOfDay),
    [diaryEntries, handleAddEntry, t, currentStartOfDay],
  );
}

function _useDiarySections(
  diaryEntries: DiaryEntry[],
  handleAddEntry: ((startOfDay: number) => void) | null,
  t: TFunction,
  currentStartOfDay: Date,
) {
  const sectionList = groupByStartDate(diaryEntries);
  const fullSectionList = addEmptySections(sectionList, currentStartOfDay);
  const mappedSectionList = mapSectionData(fullSectionList, currentStartOfDay);

  const sections: DiarySectionData[] = mappedSectionList.map(
    (section, index) => {
      const startOfDay = section.startOfDay;

      const sectionDate = moment(startOfDay);

      const title =
        sectionDate.year() === moment().year()
          ? sectionDate.format("dddd, D MMMM")
          : sectionDate.format("dddd, D MMMM YYYY");
      const isEmptySection = section.entries.length === 0;
      const isOldDiary = section.isOldDiary;
      const showOldDiaryTitle = section.showOldDiaryTitle;

      const obj: DiarySectionData = {
        title: title,
        data: section.entries,
        showOldDiaryTitle,
        startOfDay,
        isLastSection: index === mappedSectionList.length - 1,
      };

      if (isNull(handleAddEntry)) {
        return obj;
      }

      obj.data =
        isEmptySection && !isOldDiary
          ? ["button"]
          : isEmptySection && isOldDiary
          ? ["noEntry"]
          : section.entries;

      obj.ctaTitle =
        isEmptySection && isOldDiary
          ? t("screens:diary:addEntry")
          : !isEmptySection
          ? t("screens:diary:addAnother")
          : "";

      obj.ctaCallback = () => handleAddEntry(startOfDay);

      return obj;
    },
  );

  return {
    sections,
  };
}

export function getStartOfDay(entry: DiaryEntry) {
  return moment(entry.startDate).startOf("day");
}

export function mapSectionData(sections: DiaryEntry[][], currentDate: Date) {
  return sections.map((section, index) => {
    const dayDiff = moment(currentDate).diff(
      moment(currentDate).subtract(index, "days").valueOf(),
      "days",
    );
    return {
      startOfDay: moment(currentDate).subtract(index, "days").valueOf(),
      entries: section,
      isOldDiary: dayDiff > 13,
      showOldDiaryTitle: dayDiff === 14,
    };
  });
}

export function groupByStartDate(section: DiaryEntry[]) {
  return section
    .sort((a, b) => b.startDate - a.startDate)
    .reduce((sections: DiaryEntry[][], entry: DiaryEntry) => {
      if (sections.length === 0) {
        sections.push([entry]);
      } else {
        const lastSection = sections[sections.length - 1];
        if (
          getStartOfDay(lastSection[0]).valueOf() ===
          getStartOfDay(entry).valueOf()
        ) {
          lastSection.push(entry);
        } else {
          sections.push([entry]);
        }
      }
      return sections;
    }, []);
}

export function addEmptySections(
  sections: DiaryEntry[][],
  currentDate: Date,
): any {
  const results = [];
  //TODO optimize performance of lookup logic
  const lookUp = new Map();
  for (const section of sections) {
    lookUp.set(getStartOfDay(section[0]).valueOf(), section);
  }

  const currentDay = moment(currentDate).startOf("day");

  // If first section of sections was created within the past 14 days, set lastDay to currentDate -14
  const lastDay =
    sections.length !== 0 &&
    moment(currentDay).diff(
      getStartOfDay(sections[sections.length - 1][0]),
      "days",
    ) > 13
      ? getStartOfDay(sections[sections.length - 1][0])
      : moment(currentDate).subtract(13, "days");

  for (
    let day = currentDay;
    day >= lastDay;
    day = moment(day).subtract(1, "day")
  ) {
    if (lookUp.has(day.valueOf())) {
      results.push(lookUp.get(day.valueOf()));
    } else {
      results.push([]);
    }
  }

  return results;
}
