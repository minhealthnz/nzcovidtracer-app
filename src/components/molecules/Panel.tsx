import { Text, VerticalSpacing } from "@components/atoms";
import { PanelButton } from "@components/atoms/PanelButton";
import { colors, fontFamilies, fontSizes } from "@constants";
import React from "react";
import styled from "styled-components/native";

interface PanelButton {
  text: string;
  deepLink?: string;
  externalLink?: string;
  accessibilityHint?: string;
}

const Container = styled.View<{ backgroundColor?: string }>`
  width: 100%;
  padding: 14px 16px 0 16px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.white};
`;

const TitleText = styled(Text)`
  font-size: ${fontSizes.xxLarge}px;
  line-height: 26px;
  font-family: ${fontFamilies["baloo-semi-bold"]};
  padding-top: 8px;
`;

const BodyText = styled(Text)`
  font-family: ${fontFamilies["open-sans"]};
  font-size: ${fontSizes.normal}px;
  line-height: 24px;
  padding-bottom: 24px;
`;

interface Props {
  title: string;
  body: string;
  backgroundColor?: string;
  buttons: PanelButton[];
}

export function Panel({ title, body, buttons, backgroundColor }: Props) {
  return (
    <Container backgroundColor={backgroundColor}>
      <TitleText>{title}</TitleText>
      <BodyText>{body}</BodyText>
      {buttons.map((button, index) => {
        const type = index === 0 ? "primary" : "secondary";
        return (
          <PanelButton
            key={index}
            type={type}
            text={button.text}
            accessibilityHint={button.accessibilityHint}
            externalLink={button.externalLink}
            deepLink={button.deepLink}
          />
        );
      })}
      {/* extra padding if the last button is a primary button */}
      {buttons.length === 1 && <VerticalSpacing height={20} />}
    </Container>
  );
}
