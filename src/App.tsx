import { colors } from "@constants";
import { SwitchProvider } from "@features/dashboard/components/SwitchProvider";
import { ExposureProvider } from "@features/enf/components/ExposureProvider";
import { createPersistor, createStore } from "@lib/reduxStore";
import { NavigationContainer } from "@navigation/NavigationContainer";
import { ModalStack } from "@views/ModalStack";
import React, { useLayoutEffect, useRef, useState } from "react";
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
              <SwitchProvider>
                <NavigationContainer>
                  <ModalStack />
                </NavigationContainer>
              </SwitchProvider>
            </SafeAreaProvider>
          </ExposureProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
