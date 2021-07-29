import { VerticalSpacing } from "@components/atoms";
import Divider from "@components/atoms/Divider";
import { SectionHeader } from "@components/atoms/SectionHeader";
import { SectionList } from "@components/atoms/SectionList";
import { Card } from "@components/molecules/Card";
import { grid3x } from "@constants";
import { DebugScreen } from "@features/debugging/screens";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MainStackParamList } from "@views/MainStack";
import { TabScreen } from "@views/screens";
import React, { useCallback } from "react";
import { ListRenderItemInfo, SectionListData } from "react-native";

import { useProfileSections } from "../hooks/useProfileSections";
import { ProfileItem } from "../types";
import { ProfileFooter } from "./ProfileFooter";

export interface ProfileProps
  extends BottomTabScreenProps<MainStackParamList, TabScreen.MyData> {}

export default function Profile(props: ProfileProps) {
  const handlePressDebugMenu = useCallback(() => {
    props.navigation.navigate(DebugScreen.Menu);
  }, [props.navigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProfileItem>) => {
      if (item === "footer") {
        return <ProfileFooter onPressDebugMenu={handlePressDebugMenu} />;
      }

      return <Card {...item} />;
    },
    [handlePressDebugMenu],
  );
  const sections = useProfileSections();

  const renderSectionFooter = useCallback(({ section }) => {
    return section.isLastSection ? null : <VerticalSpacing height={grid3x} />;
  }, []);

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(_card: ProfileItem | undefined, index: number) =>
          `card${index}`
        }
        renderSectionFooter={renderSectionFooter}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        renderSectionHeader={(info: {
          section: SectionListData<ProfileItem>;
        }) => <SectionHeader title={info.section.title} />}
      />
    </>
  );
}
