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
        title: "Bluetooth tracing",
        description:
          "Anonymously log when you are near other app users by enabling your phone’s Exposure Notification System.",
        descriptioniOS12:
          "Your phone is partially supported. You can enable Bluetooth tracing now, and it will work fully in a future version of the app. ",
        descriptionLinkiOS12:
          "Read more about Bluetooth tracing on iOS 12.5 here.",
        buttonEnabled: "Turn it off",
        buttonEnabledAccessibility: "Turn bluetooth tracing off",
        buttonDisabled: "Turn it on",
        buttonDisabledAccessibility: "Turn bluetooth tracing on",
        buttonBlocked: "Authorise in settings",
        buttonBlockedAccessibility: "Authorise bluetooth tracing in settings",
        secondaryButton: "Find out more",
        secondaryButtonAccessibilityLabel:
          "Read more info about Bluetooth tracing",
        secondaryButtonAccessibilityHint:
          "Leaves the app and navigates to a webpage",
        subheading: "How it works",
        subtext:
          "Your phone will use Bluetooth to exchange anonymous codes with other phones using the app with Bluetooth enabled.",
        subtextP2:
          "It cannot share your location, your name, or anything else about you.",
        subtextP3:
          "You will receive an exposure notification through the app if you may have been in close contact with another app user who has COVID-19.",
        bannerEnabled: "Bluetooth tracing is on",
        bannerEnabledAccessibilityLabel:
          "Bluetooth tracing status: Bluetooth tracing is on",
        bannerDisabled: "Bluetooth tracing is off",
        bannerDisabledAccessibilityLabel:
          "Bluetooth tracing status: Bluetooth tracing is off",
        notSupported: {
          subtext: "We can't currently activate Bluetooth Tracing for you.",
          subtextP1: "Make sure you're connected to the internet.",
          subtextP2: "Make sure your operating system is up to date.",
          subtextP3:
            "If you're not sure why you're seeing this message, get in touch with us at ",
          link: "help@covidtracer.min.health.nz",
          subtextP4:
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
        inputInfo: "Enter the code texted to you by a Contact Tracer",
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
