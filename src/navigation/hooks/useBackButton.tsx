import { EventConsumer, NavigationAction } from "@react-navigation/native";
import { useEffect } from "react";

type BeforeRemove = {
  beforeRemove: {
    data: {
      action: NavigationAction;
    };
    canPreventDefault: true;
  };
};

export interface BackButtonOptions {
  // Invoked when back button is pressed, return true to prevent default behaviour
  handleBackPressed?: () => boolean;
}

export function useBackButton(
  navigation: EventConsumer<BeforeRemove>,
  options?: BackButtonOptions,
) {
  const handleBackPressed = options?.handleBackPressed;
  useEffect(() => {
    const unsubsribe = navigation.addListener("beforeRemove", (e) => {
      if (!handleBackPressed) {
        return;
      }

      const result = handleBackPressed();
      if (result) {
        e.preventDefault();
      }
    });
    return unsubsribe;
  }, [navigation, handleBackPressed]);
}
