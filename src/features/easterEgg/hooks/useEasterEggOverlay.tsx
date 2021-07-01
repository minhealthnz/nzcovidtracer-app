import React, { useCallback, useMemo, useState } from "react";

import { AnalyticsEvent, recordAnalyticEvent } from "../../../analytics";
import { EasterEggOverlay } from "../components/EasterEggOverlay";
import { emoji_whitelist } from "../util/emoji_whitelist";

export function useEasterEggOverlay() {
  const [state, setState] = useState<{ emojis: string[]; visible: boolean }>({
    emojis: [],
    visible: false,
  });
  const showEasterEgg = useCallback((payload: string[]) => {
    recordAnalyticEvent(AnalyticsEvent.EasterEggTriggered);
    setState({
      visible: true,
      emojis: payload.filter((emoji) =>
        emoji_whitelist.whitelist.includes(emoji),
      ),
    });
  }, []);
  const renderComponent = useMemo(() => {
    if (!state.visible) {
      return null;
    }
    return (
      <EasterEggOverlay
        emojis={state.emojis}
        onFinish={() => setState({ emojis: [], visible: false })}
        visible={state.visible}
      />
    );
  }, [state]);
  return {
    renderEasterEgg: renderComponent,
    showEasterEgg,
  };
}
