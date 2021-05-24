export const strings = {
  en: {
    screenTitles: {
      // TODO specify default screen title here and override alternate titles for old diary flow instead
      viewDiary: "Choose an old diary",
      copiedDiary: "Choose an old diary",
      chooseOldDiary: "Choose an old diary",
      diaryShared: "Share my diary",
    },
    screens: {
      diary: {
        addEntry: "Add diary entry",
        addEntryAccessibilityLabel: "Add diary entry",
        addEntryAccessibilityHint:
          "Leaves the diary and navigates to Add diary entry form",
      },
      viewDiary: {
        descriptionP1: "These entries were recorded for",
        submit: "Add to current diary",
        userNotFound: {
          title: "We couldn't find this diary",
          message: "There are no diary entries linked to this email address",
          ok: "OK",
        },
      },
      copiedDiary: {
        title: "You've successfully copied this diary!",
        descriptionP1:
          "Your diary has been updated with the diary entries from ",
        descriptionP2:
          "These entries will be kept in your diary and any entries older than 60 days will be deleted when you open the app.",
        submit: "Finish",
        copyAnother: "Copy another diary",
      },
      diaryShared: {
        title: "Thanks for helping stop the spread",
        description:
          "Your digital diary has been sent to the Contact Tracing team.",
        done: "Finish",
      },
    },
  },
};
