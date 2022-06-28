export const strings = {
  en: {
    screenTitles: {
      savingLocations: "Saving locations",
      savedLocations: "Saved locations",
      saveNewLocation: "Save a location",
      placeOrActivity: "Add diary entry",
      pickSavedLocation: "Choose saved location",
    },
    screens: {
      saveLocationOnboarding: {
        subtitle: "Save a scan for next time",
        description1:
          "You can now save a location that you’ve scanned in to before and select it when manually adding a diary entry.",
        description2:
          "A manual diary entry from a saved location is as good as scanning in - it means you can get an early warning if you have come into contact with COVID-19.",
        secondSubtitle: "Save a written entry",
        secondDescription:
          "Make it easy to add entries for places you visit regularly when they don't have a poster, such as your friend’s place or if you’ve just stayed home.",
        tip: "Don’t save public transport or taxis. Every vehicle has a different QR code.",
        saveLocation: "Would you like to save this location?",
        save: "Save",
        saveNew: "Save a location",
        cancel: "Cancel",
        buttonTitle: "Would you like to save this location?",
        manualDiaryImageAccessibilityLabel: "Manual Diary Entry",
        scannedLocationImageAccessibilityLabel: "Previously scanned location",
      },
      pickSavedLocation: {
        heading: "You don't have any saved locations yet",
        subtitle: "Save a scan for next time",
        description:
          "You can now save a location that you’ve scanned in to before and select it when manually adding a diary entry.",
        description2:
          "A manual diary entry from a saved location is as good as scanning in - it means you can get an early warning if you have come into contact with COVID-19.",
        secondSubtitle: "Save a written entry",
        secondDescription:
          "Make it easy to add entries for places you visit regularly when they don't have a poster, such as your friend’s place or if you’ve just stayed home.",
      },
      savedLocations: {
        saveNew: "Save new",
        accessibility: {
          saveNew: "Save new location",
          deleteLocationHint: "Swipe right to delete location",
        },
        deleteModal: {
          title:
            "Would you like to delete ‘{{locationName}}’ from saved locations?",
          description:
            "This saved location is no longer stored in your diary. If you delete it, you will no longer be able to create manual entries as if you scanned the poster, until you scan the QR code again.",
          cancel: "Cancel",
          delete: "Delete",
        },
        addManualEntry: "Add as a new written entry",
        addManualEntryAccessibilityHint: "{0} of {0}",
      },
      saveNewLocation: {
        listHeader: "Recent locations:",
        successBanner: "'{{name}}' saved",
        undo: "Undo",
        searchEmptyList:
          "There are no saved or recent locations that match your search.",
        locationsEmptyList:
          "All locations you've visited in the last 60 days have already been saved.",
        accessibilityHint: "swipe right to save new location",
        successBannerAccessibilityLabel: "Location saved.",
        successBannerAccessibilityHint: "Double tap to undo.",
      },
      saveNewLocationEmpty: {
        buttonLabel: "Add diary entry",
        title: "Your diary is empty",
        description:
          "You can save locations after you’ve scanned a QR code poster or added a diary entry manually.",
      },
      placeOrActivity: {
        stayedHome: "I stayed home",
        stayedHomeAccessibilityLabel: "Saved home location",
        stayedHomeAccessibilityHint:
          "Double tap to pick as a diary entry location or activity",
        viewSaved: "View saved",
        viewSavedAccessibilityLabel: "View saved Locations",
        searchBarAccessibility: "Editting {0} Edit box, Search Here.",
        searchBarAccessibilityHint: "predictions available below.",
        stepOneOfTwo: "Step 1 of 2",
        placeOrActivity: "Place or activity",
      },
    },
    components: {
      saveLocationButton: {
        saved: "Saved location. Tap to unsave.",
        unSaved: "Unsaved location. Tap to save.",
      },
      locationIcon: {
        manualEntry: "Manual Diary Entry",
        scannedLocation: "Scanned Location",
        saved: "Saved",
      },
      locationListItem: {
        accessibility: {
          manualEntry: "{0}. {1} Option {2} of {3}",
          scannedLocation: "{0}. {1} at {2} Option {3} of {4}",
          hint: "Double tap to choose this as your diary entry location or activity",
          delete: "Delete saved location",
          save: "Save this location",
        },
      },
    },
  },
};
