export const strings = {
  en: {
    screenTitles: {
      // TODO specify default screen title here and override alternate titles for old diary flow instead
      viewDiary: "Choose an old diary",
      copiedDiary: "Choose an old diary",
      chooseOldDiary: "Choose an old diary",
      diaryShared: "Share my digital diary",
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
      shareDiary: {
        title: "Share my digital diary",
        description:
          "If you have been asked by a Contact Tracer, you can share your digital diary with Contact Tracers.\n\nThis will securely upload the locations, times and notes in your diary to the National Contact Tracing Solution.",
        tip:
          "You can only share your diary if you are a confirmed or probable case of COVID-19.",
        subText:
          "It is not compulsory for you to share your diary but it helps make contact tracing easier. To help you protect your privacy, you can select which entries you want to share and which you want to exclude.\n\nThis data will be treated as part of your medical record.",
        continue: "Continue",
      },
      shareDiaryList: {
        title: "Select diary entries to share",
        description:
          "We encourage you to share all days to give Contact Tracers as much context as possible.",
        allDays: "All days",
        lastFourteen: "Last 14 days",
        allDaysAccessibilityLabel: "Select all diary entries",
        allDaysAccessibilityHint:
          "You can modify your selection in the list below.",
        lastFourteenAccessibilityLabel:
          "Select diary entries from the last 14 days",
        lastFourteenAccessibilityHint:
          "You can modify your selection in the list below.",
        allDaysSelectedAccessibilityLabel: "All diary entries selected.",
        allDaysSelectedAccessibilityHint:
          "You can modify your selection in the list below. Double tap to unselect.",
        lastFourteenSelectedAccessibilityLabel:
          "Diary entries from the last 14 days selected.",
        lastFourteenSelectedAccessibilityHint:
          "You can modify your selection in the list below. Double tap to unselect.",
        selectDay: "Select day",
        unselectDay: "Unselect day",
        selectDayAccessibilityLabel: "Select all entries from this day",
        unselectDayAccessibilityLabel: "Unselect all entries from this day",
        noEntries: "No entries",
        continue: "Continue",
        error: "Select at least one entry to continue",
        sectionItem: "Section item {0} of {1}.",
      },
      shareDiaryConfirm: {
        title: "Confirm diary share",
        dataRequestCode: "Diary upload code",
        dataRequestCodeInfo: "Enter the code given to you by a Contact Tracer",
        summaryTitle: "Diary upload summary",
        changeEntries: "Change entries",
        changeEntriesAccessibility: "Change diary entries that I want to share",
        share: "Confirm and share",
        shareAccessibility: "Confirm my selection and share my diary",
        youWillBeUploading: "You will be uploading",
        aDiaryEntry: "diary entry",
        createdOn: "{0} that {1} created on",
        diaryEntries: "diary entries",
        across: "across",
        days: "days",
        day: "day",
        period: "over a period from",
        to: "to",
        from: "from",
        changeEntriesHint: "Double tap to change.",
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
      savingLocations: {
        subtitle: "Save scanned posters",
        description:
          "If you forget to scan, add a saved poster into your diary manually. This will allow you",
        boldDescription: "to get alerted if you contact COVID-19 there.",
        secondSubtitle: "Save manual diary entries",
        secondDescription:
          "Make it easier to enter them again, for example if you stayed home.",
        tip:
          "Do not save buses or taxis, as it is unlikely that you will visit the same vehicle again.",
        saveLocation: "Would you like to save this location?",
        save: "save",
        cancel: "cancel",
      },
    },
  },
};
