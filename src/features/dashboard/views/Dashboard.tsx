import { AssetFilter } from "@components/molecules/AssetFilter";
import { SwitchScrollView } from "@components/molecules/Switch/SwitchScrollView";
import { Resources } from "@features/resources/views/Resources";
import { StackScreenProps } from "@react-navigation/stack";
import { MainStackParamList } from "@views/MainStack";
import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";

import { DashboardList } from "./DashboardList";

interface Props extends StackScreenProps<MainStackParamList> {}

const Container = styled.View`
  flex-direction: row;
`;

const windowWidth = Dimensions.get("window").width;

const Page = styled.View`
  width: ${windowWidth}px;
`;

export function Dashboard(props: Props) {
  return (
    <SwitchScrollView>
      <Container>
        <AssetFilter>
          <Page>
            <DashboardList {...props} />
          </Page>
          <Page>
            <Resources />
          </Page>
        </AssetFilter>
      </Container>
    </SwitchScrollView>
  );
}
