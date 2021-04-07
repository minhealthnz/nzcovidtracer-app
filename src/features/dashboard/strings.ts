export const strings = {
  en: {
    accessibility: {
      dashboard: {
        beenInContact: "Location alert from a diary entry match",
        beenInCloseContact: "Alert from Bluetooth tracing match",
        notificationTitleHintSingle:
          "You have 1 exposure alert. Swipe right to find out more",
        notificationTitleHintDouble:
          "You have 2 exposure alerts. Swipe right to find out more",
      },
    },
    screenTitles: {
      dashboard: "Dashboard",
    },
    screens: {
      dashboard: {
        heading: "Protect yourself, your whānau, and\nyour community",
        linkAccessiblityHint: "Leaves the app and navigates to a webpage",
        sections: {
          trace: "Trace your steps",
          help: "Help contact tracers",
          advice: "Advice",
          stats: {
            title: "Latest updates",
            refresh: "Refresh",
            refreshAccessibility: "Refresh latest updates",
            accessibilityHint: "Leaves app and navigates to a webpage",
            footer: "Source",
            yourEntries: "days of diary entries over last 14 days",
            error:
              "Something went wrong and we couldn't load the updates. Check your network connection and try again",
          },
          alertDoubleExposure: "COVID-19 contact alerts",
          alertENFExposure: "COVID-19 Bluetooth alert",
          alertLocationExposure: "COVID-19 location alert",
        },
        cards: {
          stats: {
            linkAccessibilityHint: "Tap to learn more",
            increase: "increased by {0} since yesterday",
            decrease: "decreased by {0} since yesterday",
          },
          places: {
            title: "Record a visit",
            description: "Scan or add entries to your digital diary",
          },
          bluetoothTracing: {
            accessibilityHint:
              "Tap to learn more and change Bluetooth tracing status",
            disabled: {
              title: "Bluetooth tracing is off",
              description: "Turn on to anonymously log other nearby app users",
            },
            enabled: {
              title: "Bluetooth tracing is on",
              description: "Anonymously log other nearby app users",
            },
            notSupported: {
              title: "Bluetooth Tracing could not be activated",
              description: "Your device may not be supported",
              accessibilityHint: "Tap to learn more",
            },
            notVerified: {
              title: "Activating Bluetooth tracing...",
              description:
                "We are checking whether your device supports Bluetooth tracing",
            },
          },
          contactAlerts: {
            title: "Enable contact alerts",
            description:
              "Get an alert if you may have been exposed to COVID-19",
          },
          registerDetails: {
            title: "Update your details",
            description: "Help us contact you faster if we need to",
          },
          registerLocation: {
            title: "Update your address",
            description: "Help us locate you faster if we need to",
          },
          nhi: {
            title: "Add your NHI number",
            description: "Have your details ready for a faster COVID-19 test",
          },
          unite: {
            title: "Share the app",
            description:
              "The more of us who help contact tracing, the safer we all are",
            shareMessage:
              "NZ COVID Tracer app - Sign up to protect yourself, your whānau, and your community https://tracing.covid19.govt.nz/",
          },
          moreInfo: {
            title: "Learn more",
            description:
              "Find resources about contact tracing and how to stay safe",
          },
          test: {
            title: "COVID-19 test locations",
            description: "Find where you could get tested",
          },
        },
        footer: {
          title: "Remember to wash your hands",
          detail:
            "Wash often. Use soap. 20 seconds. Then dry. This kills the virus by bursting its protective bubble.",
        },
        beenInContact: {
          title: "You may have been in contact with COVID-19",
          description:
            "Confirm your name and phone number and we’ll give you a call. If you begin to feel unwell, call Healthline at 0800 358 5453.",
          requestCallback: "Send your details",
          callbackRequested: "Details sent",
          more: "Find out more",
          moreAccessibilityHint: "Leaves the app and navigates to a webpage",
          locationAccessibilityHint: "Double tap to view diary entry",
          dismiss: {
            title: "Would you like to dismiss this alert?",
            dimiss: "Dismiss",
            cancel: "Cancel",
          },
          detailsSent: "Details sent",
          lastExposed: "Last exposed: ",
          riskyLocationAt: "\nat ",
        },
        beenInCloseContact: {
          more: "Find out more",
          moreAccessibilityHint: "Leaves the app and navigates to a webpage",
          dismiss: {
            title: "Would you like to dismiss this alert?",
            dimiss: "Dismiss",
            cancel: "Cancel",
          },
          lastExposed1: "Last exposed in the last 36 hours ",
          lastExposed2: "Last exposed around {0} ({1}) ",
          day: "day ago",
          days: "days ago",
          daySinceLastExposure: "{0} {1}",
          numberOfExposures: "times over the last 14 days",
          requestCallback: "Send your details",
          callbackRequested: "Details sent",
        },
        alerts: {
          dismiss: {
            title: "Would you like to dismiss these alerts?",
            dimiss: "Dismiss",
            cancel: "Cancel",
          },
        },
      },
    },
  },
};
