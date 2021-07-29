export const strings = {
  en: {
    headerButtons: {
      skip: "Skip",
    },
    screenTitles: {
      existingUser: "NZ COVID Tracer Update",
      stepTemplate: "Step {0} of {1}",
      multipleDiaries: "NZ COVID Tracer Update",
      contactDetails: "Tell us your contact details",
      thanks: "Thank you",
      enableAlerts: "Enable contact alerts",
      enableENF: "NZ COVID Tracer Update",
      enableENFModal: "Bluetooth tracing",
      privacyStatement: "Privacy statement",
      lockCode: "Protect your privacy",
      enableBluetoothModal: "Bluetooth tracing inactive",
    },
    screens: {
      existingUser: {
        title: "We’ve made a few changes for you",
        infoEnf:
          "Use Bluetooth to anonymously log when you are near other app users",
        infoPassword:
          "You don't need to set a password or log in to use the app",
        infoLook:
          "We've simplified the dashboard to make it easier to get around",
        okay: "Continue",
      },
      valueStatements: {
        title: "NZ COVID Tracer",
        subtitle: "Protect yourself, your whānau, and your community",
        info1:
          "Track your steps by scanning QR codes and checking into locations",
        info2:
          "Use Bluetooth to anonymously log when you are near other app users",
        info3: "Receive alerts if you might have been exposed to the virus",
        buttonPrimary: "Get started",
      },
      privacyStatement: {
        buttonPrimary: "Continue",
        title: "Privacy statement",
        section1: {
          title:
            "Any personal information you share through NZ COVID Tracer will be used only for public health purposes related to contact tracing during the COVID-19 pandemic response.",
          copy:
            "You can choose which of the NZ COVID Tracer App features you wish to use:",
        },
        section2: {
          title: "Digital Diary:",
          copy:
            "You can choose what locations to scan, and what activities you record in your Digital Diary. This will help you remember where you have been. This stays on your device and each entry is deleted after 60 days. You can choose to send your digital diary to us if a contact tracer asks you to (they will give you a code).",
        },
        section3: {
          title: "Contact Details:",
          copy:
            "You can choose what contact details you share with us. This is to help contact tracers if they need to get in touch with you.",
        },
        section4: {
          title: "Notifications:",
          copy:
            "You can choose if you want to receive an alert if you have scanned a location at the same time as a person who later tests positive for COVID-19. We will not know you have received an alert unless you choose to contact us about it.",
        },
        section5: {
          title: "Bluetooth Tracing:",
          copy:
            "You can choose if you want to turn on this new functionality. This will enable your device to anonymously record when you are near other app users who have Bluetooth enabled. It will record only how close to them you were, and how long you were nearby. It does not record who either of you are or where you were. When an app user tests positive for COVID-19, they can choose to anonymously notify the other app users who have been nearby. No identifying information is exchanged. We will not know you have received a notification unless you choose to contact us about it.",
        },
        section6: {
          title: "My NHI Details:",
          copy:
            "You can choose if you want to add your NHI number to the app to speed up access to testing if you visit a COVID-19 testing site.",
        },
        section7: {
          copy1:
            "If you choose to share your name and contact details with the Ministry, they will be stored securely. All other information stays on your device unless you choose to share it. We do collect a small amount of statistical information that does not identify you in any way.",
          copy2:
            "To help keep the information on your phone safe, we recommend you keep your phone locked when you are not using it.",
        },
        section8: {
          title: "More information",
          copy:
            "For more information about how your information is used, or to get in contact with us (the Ministry of Health), please review the ",
          link: "full Privacy and Security Statement.",
          linkAccessibilityHint: "Leaves the app and navigates to a webpage",
        },
      },
      enableENF: {
        heading: "Enable Bluetooth tracing",
        headerImageAccessibilityLabel:
          "Two phones anonymously exchanging Bluetooth Tracing keys at a cafe.",
        description1:
          "Anonymously log when other app users are nearby by enabling your phone’s Exposure Notification System.",
        description2:
          "Your phone will use Bluetooth to exchange anonymous IDs with other phones that are using the app and have Bluetooth enabled.",
        description3:
          "It cannot share your location, your name, or anything else about you.",
        description4:
          "It will allow you to receive an exposure notification if you may have been in close contact with another app user who has COVID-19.",
        enableTracing: "Enable Bluetooth tracing",
        enableTracingAccessibility: "Enable Bluetooth tracing",
        done: "Done",
        doneAccessibility: "Done",
        more: "Find out more",
        moreAccessibility: "Read more info about Bluetooth tracing",
        moreAccessibilityHint: "Leaves the app and navigates to a webpage",
        settings: "Turn it on in settings",
        settingsAccessibility: "Turn bluetooth tracing on in settings",
      },
      multipleDiaries: {
        title: "You have multiple diaries stored on this device",
        description:
          "We've noticed that more than one account has been used to keep a digital diary on this device, and this no longer possible." +
          "\n" +
          "\n" +
          "You can copy over any diary you want to keep using now, or you can do this later.",
        okay: "Choose a diary",
        later: "Do this later",
      },
      contactDetails: {
        heading: "Tell us your contact details",
        headerIamgeLabel: "A person with COVID-19 speaking to a Contact Tracer",
        description:
          "This information helps contact tracers reach you faster if we need to." +
          "\n\n" +
          "If you are known by multiple names, enter the one that most people would use.",
        email: "Email address",
        firstName: "First name",
        lastName: "Last name ",
        phoneNumber: "Phone number",
        phoneNumberInfo: "Mobile numbers are preferred.",
        submit: "Submit",
        doThisLater: "Do this later",
      },
      enableAlerts: {
        heading: "Enable notifications",
        headerImageLabel: "Two phones receiving COVID-19 exposure alerts",
        description:
          "We use notifications to let you know if you may have been in close contact with someone with COVID-19. \n\nFrom time to time we may also send announcements and reminders to keep your diary up to date. \n\nYou can always update your notification preferences in My Data tab.",
        enableNotifications: "Enable notifications",
        done: "Done",
      },
      thanks: {
        heading: "You've joined our team of 5 million",
        headerImageLabel:
          "A person with NZ COVID Tracer app surrounded by their friends and family",
        description: [
          "Thanks for downloading and using the NZ COVID Tracer app to protect yourself, your whānau, and your community.",
          "",
          "Together we can stop the spread of COVID-19.",
        ].join("\n"),
        finish: "Finish",
      },
      lockCode: {
        heading: "A reminder about privacy",
        headerImageLabel: "A key opening a lock",
        description:
          "Your diary is stored only on your phone. It isn’t uploaded anywhere unless a contact tracer asks you to share it and you say yes." +
          "\n" +
          "\n" +
          "We recommend you set a lock code on your phone to keep your data safe and private.",
        okay: "Okay",
      },
    },
    errors: {
      mfaEnabled: {
        title: "We couldn’t confirm your email address",
        detail:
          "We are removing the use of login and two-factor authentication. We advise that you turn two-factor authentication off on the website to be able to confirm your email address during this step.",
        cancel: "Cancel",
        loginOnline: "Go to website",
      },
    },
  },
};
