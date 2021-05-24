import {
  RemoteCardData,
  RemotePanelData,
  RemoteSectionListData,
} from "@components/types";

const panel1: RemotePanelData = {
  component: "Panel",
  title: "COVID-19 Vaccines are now available to public",
  body:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.",
  buttons: [
    {
      text: "Find out when I can get vaccinated",
      externalLink: "http://foo",
    },
  ],
  backgroundColor: "#ADAACE",
};

const card1: RemoteCardData = {
  component: "Card",
  title: "Am I eligible?",
  body: "Find out if you can get vaccinated",
  externalLink: "http://foo",
};

const card2: RemoteCardData = {
  component: "Card",
  title: "Apply for an early vaccine",
  icon: "https://c19-stats-dev.s3-ap-southeast-2.amazonaws.com/mask.png",
  externalLink: "http://foo",
};

const card3: RemoteCardData = {
  component: "Card",
  title: "How COVID-19 vaccine rollup will work",
  icon: "https://c19-stats-dev.s3-ap-southeast-2.amazonaws.com/mask.png",
  externalLink: "http://foo",
};

export const data: RemoteSectionListData = {
  sections: [
    {
      data: [panel1, card1],
    },
    {
      title: "More information",
      data: [card2, card3],
    },
  ],
};
