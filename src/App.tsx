import { colors } from "@constants";
import { setCurrentRouteName } from "@domain/device/reducer";
import { ExposureProvider } from "@features/enf/components/ExposureProvider";
import { createPersistor, createStore } from "@lib/reduxStore";
import { navigationRef } from "@navigation/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { ModalStack } from "@views/ModalStack";
import { AnyScreen } from "@views/screens";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { Store } from "redux";
import { Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export function App() {
  const [hasStore, setHasStore] = useState(false);

  useLayoutEffect(() => {
    const store = createStore();
    const persistor = createPersistor(store);
    storeRef.current = store;
    persistorRef.current = persistor;
    setHasStore(true);
  }, []);

  const storeRef = useRef<Store>();
  const persistorRef = useRef<Persistor>();

  const handleNavigationStateChange = useCallback(() => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (storeRef.current && currentRouteName) {
      storeRef.current.dispatch(
        setCurrentRouteName(currentRouteName as AnyScreen),
      );
    }
  }, []);

  if (!hasStore || storeRef.current == null || persistorRef.current == null) {
    return null;
  }

  return (
    <>
      <StatusBar backgroundColor={colors.yellow} barStyle="dark-content" />
      <Provider store={storeRef.current}>
        <PersistGate loading={null} persistor={persistorRef.current}>
          <ExposureProvider>
            <SafeAreaProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={handleNavigationStateChange}
                onStateChange={handleNavigationStateChange}
              >
                <ModalStack />
              </NavigationContainer>
            </SafeAreaProvider>
          </ExposureProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
