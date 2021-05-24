import {
  RemoteCardData,
  RemoteInfoBlockData,
  RemotePanelButtonData,
  RemotePanelData,
  RemoteSectionData,
  RemoteSectionListData,
} from "@components/types";
import * as yup from "yup";

export const sectionSchema = yup.object<RemoteSectionData>().shape({
  title: yup.string().optional(),
  data: yup
    .array()
    .of(
      yup.lazy((value) => {
        switch (value) {
          case "Card":
            return cardSchema;
          case "Panel":
            return panelSchema;
          case "InfoBlock":
            return infoBlockSchema;
          default:
            return yup.mixed();
        }
      }),
    )
    .defined(),
});

export const cardSchema = yup.object<RemoteCardData>().shape({
  component: yup.string().equals(["Card"]),
  title: yup.string().required(),
  body: yup.string().optional(),
  backgroundColor: yup.string().optional(),
  icon: yup.string().optional(),
  externalLink: yup.string().optional(),
  deepLink: yup.string().optional(),
  action: yup.string().optional().equals(["share-app"]),
});

export const panelButtonSchema = yup.object<RemotePanelButtonData>().shape({
  text: yup.string().required(),
  externalLink: yup.string().optional(),
  deepLink: yup.string().optional(),
  accessibilityHint: yup.string().optional(),
});

export const panelSchema = yup.object<RemotePanelData>().shape({
  component: yup.string().equals(["Panel"]),
  title: yup.string().required(),
  body: yup.string().required(),
  backgroundColor: yup.string().optional(),
  buttons: yup.array().of(panelButtonSchema).defined(),
});

export const infoBlockSchema = yup.object<RemoteInfoBlockData>().shape({
  component: yup.string().equals(["InfoBlock"]),
  icon: yup.string().required(),
  title: yup.string().required(),
  body: yup.string().required(),
  backgroundColor: yup.string().optional(),
});

export const sectionListSchema = yup.object<RemoteSectionListData>().shape({
  sections: yup.array().of(sectionSchema).defined(),
});
