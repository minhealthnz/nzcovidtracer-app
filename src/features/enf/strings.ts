export const strings = {
  en: {
    accessibility: {
      enf: {
        enfShareImageAlt: "Upload your information",
      },
    },
    screenTitles: {
      enfSettings: "Bluetooth tracing",
      enfShare: "Share Bluetooth tracing data",
      enfShareSuccess: "Share Bluetooth tracing data",
    },
    screens: {
      enfSettings: {
        title: "Trace your encounters with Bluetooth tracing",
        description:
          "Anonymously log when you are near other app users by enabling your phone’s Exposure Notification System.",
        buttonEnabled: "Turn it off",
        buttonEnabledAccessibility: "Turn bluetooth tracing off",
        buttonDisabled: "Turn it on",
        buttonDisabledAccessibility: "Turn bluetooth tracing on",
        buttonBlocked: "Authorise in settings",
        enableBluetooth: "Enable Bluetooth tracing",
        buttonBlockedAccessibility: "Authorise bluetooth tracing in settings",
        headerImageAccessibilityLabel:
          "Two phones anonymously exchanging Bluetooth tracing keys at a cafe.",
        secondaryButton: "Find out more",
        secondaryButtonAccessibilityLabel:
          "Read more info about Bluetooth tracing",
        secondaryButtonAccessibilityHint:
          "Leaves the app and navigates to a webpage",
        tipSubHeading: "Keep scanning",
        tipDescription:
          "You need to keep scanning in even if you have Bluetooth tracing on. These work together to help contact tracing.",
        bluetoothMessageTip:
          "Bluetooth needs to be enabled in your phone settings for Bluetooth tracing to work.",
        bluetoothMessageTurnOn: "Turn on Bluetooth",
        bluetoothMessageTurnOnIOS: "Turn on Bluetooth in settings",
        bluetoothMessageTurnOnIOSHint:
          "Navigates to your device's system settings",
        yourPrivacy: "Your privacy",
        yourPrivacySubtitle:
          "Bluetooth tracing cannot share your location, name, or anything else about you.",
        howItWorks: "How it works",
        order1: "1.",
        order2: "2.",
        order3: "3.",
        howItWorks1:
          "Bluetooth tracing only works when you enable Exposure Notifications in your system settings and have Bluetooth on.",
        howItWorks2:
          "Your phone will use low-energy Bluetooth to exchange keys with other app users who have Bluetooth tracing on.",
        howItWorks3:
          "You will receive an exposure notification if you were in close contact with another app user who has COVID-19.",
        bannerEnabled: "Bluetooth tracing is on",
        bannerEnabledAccessibilityLabel:
          "Bluetooth tracing status: Bluetooth tracing is on",
        bannerDisabled: "Bluetooth tracing is off",
        bannerDisabledAccessibilityLabel:
          "Bluetooth tracing status: Bluetooth tracing is off",
        bannerInactive: "Bluetooth tracing is not active",
        bannerInactiveAccessibilityLabel:
          "Bluetooth tracing status: Bluetooth tracing is not active",
        notSupported: {
          title: "Bluetooth tracing",
          subtext: "We can't currently activate Bluetooth tracing for you.",
          subtextP1: "Make sure you're connected to the internet.",
          subtextP2: "Make sure your operating system is up to date.",
          subtextP3:
            "If you're not sure why you're seeing this message, get in touch with us at ",
          link: "help@covidtracer.min.health.nz",
          subtextP4:
            "You can still help contact tracing efforts by scanning the QR code posters and creating manual entries in your diary.",
          tip:
            "You can still help contact tracing efforts by scanning the QR code posters and creating manual entries in your diary.",
        },
        disableModal: {
          title: "Turn off Bluetooth contact tracing?",
          description:
            "If you turn off this feature, you will stop logging when you are near other app users and won’t receive exposure notifications.\nIf you’ve been nearby someone with COVID-19 during the last 14 days, you won’t be notified. This action will not delete random IDs saved by the Exposure Notification System.",
          turnOff: "Turn off",
          cancel: "Cancel",
        },
      },
      enfShare: {
        title: "Share my Bluetooth tracing codes",
        description:
          "This will upload the anonymous codes your phone generated over the last two weeks so Exposure Notifications can be quickly sent to other Bluetooth users who may have been in close contact with you.",
        button: "Share",
        buttonAccessibilityLabel: "Share my Bluetooth tracing codes",
        inputLabel: "Data request code",
        inputInfo: "Enter the code given to you online or by a Contact Tracer.",
        tip:
          "You can only share your Bluetooth tracing codes if you were contacted by a Contact Tracer.",
        errors: {
          code: {
            invalid: "Incorrect code. Check your code and try again",
            rateLimited:
              "You have tried to share your tracing codes too many times. Try again later.",
            network:
              "Something went wrong. Make sure you have a network connection and try again.",
          },
        },
      },
      enfShareSuccess: {
        title: "Thanks for helping stop the spread",
        description:
          "Your Bluetooth tracing data has been sent to the Contact Tracing System.",
        button: "Finish",
        buttonAccessibilityHint: "Navigates to My Data screen",
      },
    },
  },
};
