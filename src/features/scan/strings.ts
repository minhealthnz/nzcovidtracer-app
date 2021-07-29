export const strings = {
  en: {
    screenTitles: {
      tutorial: "How it works",
      recordVisit: "Record visit",
      recordAVisit: "Record a visit",
      scanNotRecorded: "Visit not recorded",
    },
    screens: {
      scanTutorial: {
        next: "Next",
        okay: "Okay",
        step1: {
          title: "Trace your steps by recording visits",
          description:
            "Scan the QR codes on official NZ COVID Tracer posters when you arrive at a place.\n \nYou can also add a manual diary entry if you go somewhere without a poster or if you forgot to scan.",
          tipBold: "Your digital diary is stored privately on your phone. ",
          tip:
            "You can share it with contact tracers and will only be asked to do so if you test positive for COVID-19. \n \nWhenever you open the app, diary entries older than 60 days will be deleted.",
          imageAccessibilityLabel:
            "A person successfully scanning a QR code poster.",
        },
        step2: {
          title: "Trace your encounters with Bluetooth tracing",
          description:
            "Your phone will use low-energy Bluetooth to exchange anonymous keys with other phones that are using the app and have Bluetooth tracing enabled.",
          tipBold:
            "Your Bluetooth tracing codes are stored privately on your phone. ",
          tip:
            "You can choose to share them with contact tracers if you test positive for COVID-19.",
          imageAccessibilityLabel:
            "Two phones anonymously exchanging Bluetooth Tracing keys at a cafe.",
        },
        step3: {
          title: "Receive contact alerts",
          description:
            "If you scanned into a place at the same time as someone with COVID-19, we’ll send you an alert. \n \nYou will also get an alert if Bluetooth tracing identifies that you may have been in close contact with another app user who has COVID-19.",
          tipBold: "Alerts are sent anonymously. ",
          tip:
            "Only you know if you’ve received a contact alert. You can choose to get in touch with contact tracers.",
          imageAccessibilityLabel:
            "Multiple phones receiving an exposure notification when their owner came into contact with COVID-19.",
        },
        step4: {
          title: "Retrace your steps",
          description:
            "Keeping your digital diary complete will help you quickly remember where you’ve been if a contact tracer gives you a call.",
          imageAccessibilityLabel:
            "A person sick with COVID-19 looking through their digital diary.",
        },
        footerText:
          "Your digital diary is kept securely on your phone. Whenever you open the app, entries older than 60 days will be automatically deleted.",
      },
      scan: {
        guide: "Guide",
        diary: "Diary",
        addManualEntry: "Add diary entry",
        manualEntryButtonTitle: "Add a diary entry manually",
        manualEntryButtonDescription: "If you can't scan right now",
        smallScreenManualEntryButtonTitle: "Add diary entry manually",
        instructions: "Scan NZ COVID Tracer QR code or:",
        noCameraPermission:
          "To scan QR codes, you'll need to allow camera access to the NZ COVID Tracer app.",
        openSettings: "Open settings",
        keepScanning: "Keep scanning QR posters",
        allowCamera: "Allow camera access",
        errors: {
          couldntScanCode: "We couldn't scan this QR code",
          notOfficialMessage:
            "This is not an official NZ COVID Tracer QR code.",
          troubleReading:
            "We're having trouble reading this barcode, please try again.",
        },
        accessibility: {
          torchOnLabel: "Turn torch light off",
          torchOffLabel: "Turn torch light on",
          hint: "Turn torchlight on to help scan posters in low light",
          diaryHistory: "diary history",
          startTutorial: "start tutorial",
          topBannerHint:
            "Tap to learn more and change Bluetooth tracing status",
        },
        blueToothTracingStatus: {
          inactive: "Bluetooth tracing is not active",
          enabled: "Bluetooth tracing is running",
          disabled: "Turn on Bluetooth tracing",
          activating: "Activating Bluetooth tracing...",
          unavailable: "Bluetooth tracing unavailable",
        },
        and: "AND",
        then: "THEN",
      },
      visitRecorded: {
        heading: "This entry won't be added to your diary",
        description:
          "You’ve already added this location into your diary by scanning a poster or tapping an NFC sticker.",
        addDetails: "Add details",
        doneButton: "Okay",
        doneHint: "Closes the page and navigates back",
        detailsDescription:
          "Describing who you were with and what you were doing can help Contact Tracers.",
        tip:
          "Tip: You can add a manual entry for any missed day even if you were just staying home.",
        notProvided: "Not provided.",
      },
      scanNotRecorded: {
        heading: "Something went wrong",
        description:
          "There was a problem saving a new diary entry and your visit was not recorded." +
          "\n" +
          "\n" +
          "Try again, and if this issue persists, contact the support team.",
        links: {
          phone: "Call 0800 800 606",
          email: "Email help@covidtracer.min.health.nz",
        },
        goBack: "Go back",
      },
    },
  },
};
