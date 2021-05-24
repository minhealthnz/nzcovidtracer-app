import { Pill, presets } from "@components/atoms/Pill";
import { Card, CardProps } from "@components/molecules/Card";
import { fontFamilies, fontSizes } from "@constants";
import { formatToLocaleString } from "@utils/formatToLocaleString";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

export function StatsCard(props: CardProps) {
  const isString = typeof props.dailyChange === "string";

  const hidePill = props.dailyChangeIsGood === undefined && isString;

  const fontSize = hidePill ? 15 : 10;

  const pillPresetName = useMemo(() => {
    if (hidePill) {
      return "text";
    }
    if (props.dailyChangeIsGood === undefined) {
      return "grey";
    }

    const positive =
      typeof props.dailyChange === "number" && props.dailyChange > 0;
    if (props.dailyChangeIsGood) {
      return positive ? "trendUpGreen" : "trendDownGreen";
    } else {
      return positive ? "trendUpRed" : "trendDownRed";
    }
  }, [props.dailyChange, props.dailyChangeIsGood, hidePill]);

  const pillPreset = presets[pillPresetName];

  const hasDailyChange = props.dailyChange !== 0 && props.dailyChange != null;

  const titleAccessoryView = useMemo(() => {
    if (props.dailyChange == null) {
      return null;
    }

    return (
      hasDailyChange && (
        <Pill
          text={formatToLocaleString(props.dailyChange)}
          fontSize={fontSize}
          {...pillPreset}
        />
      )
    );
  }, [hasDailyChange, props.dailyChange, fontSize, pillPreset]);

  return (
    <Card
      titleStyle={styles.statsTitle}
      titleAccessoryView={titleAccessoryView}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  statsTitle: {
    fontSize: fontSizes.xxxxLarge,
    fontFamily: fontFamilies["baloo-semi-bold"],
    lineHeight: 36,
    paddingTop: 13,
    marginBottom: -25,
    marginRight: 5,
  },
});
