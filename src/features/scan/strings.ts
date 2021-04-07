export const strings = {
  en: {
    screenTitles: {
      tutorial: "How it works",
      recordAVisit: "Record a visit",
      recordVisit: "Record visit",
      scanNotRecorded: "Visit not recorded",
    },
    screens: {
      scanTutorial: {
        step1: {
          title: "Scan to check in",
          description:
            "Scan the QR codes on official NZ COVID Tracer posters when you arrive at participating places.",
        },
        step2: {
          title: "Record a visit manually",
          description:
            "Manually record your visits to places that don't have a QR code on display.",
        },
        step3: {
          title: "Contact alerts",
          description:
            "If you scanned in to a place at the same time as someone with COVID-19, we'll send you an alert.",
        },
        step4: {
          title: "Retrace your steps",
          description:
            "Use your digital diary to help remember where you've been when a contact tracer gives you a call.",
        },
        footerText:
          "Your digital diary is kept securely on your phone. Whenever you open the app, entries older than 60 days will be automatically deleted.",
      },
      scan: {
        addManualEntry: "Add manual entry",
        instructions: "Scan NZ COVID Tracer QR code or:",
        noCameraPermission:
          "To scan QR codes, you'll need to allow camera access to the NZ COVID Tracer app.",
        openSettings: "Open settings",
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
        },
      },
      visitRecorded: {
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
