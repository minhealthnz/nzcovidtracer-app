import { TestCommand } from "@features/debugging/testCommand";
import moment from "moment";
import { Alert } from "react-native";
import { ExposureContextValue } from "react-native-exposure-notification-service";

export const enfContacts = (exposure: ExposureContextValue): TestCommand => ({
  command: "enfContacts",
  title: "Display all close constacts",
  async run() {
    const { getCloseContacts } = exposure;
    const contacts = await getCloseContacts();

    const latestExposureDate = contacts?.reduce<number>((max, contact) => {
      const exposureDate = moment(parseInt(contact.exposureAlertDate, 10))
        .subtract(contact.daysSinceLastExposure, "days")
        .valueOf();
      return max > exposureDate ? max : exposureDate;
    }, 0);

    const str = contacts?.reduce<string>(
      (acc, contact, ix, array) =>
        acc
          .concat(
            `Alert date: ${moment(
              parseInt(contact.exposureAlertDate, 10),
            ).format("DD MMM HH:mm")}`,
          )
          .concat(
            `\nExposure date: ${moment(parseInt(contact.exposureAlertDate, 10))
              .subtract(contact.daysSinceLastExposure, "days")
              .format("DD MMM HH:mm")}`,
          )
          .concat(`\nRisk score: ${contact.maxRiskScore}`)
          .concat(`\nKeys count: ${contact.matchedKeyCount}`)
          .concat(
            `\nDurations: ${JSON.stringify(contact.attenuationDurations)}`,
          )
          .concat(`\n${ix < array.length - 1 ? "-----------------\n" : ""}`),
      "\n",
    );
    Alert.alert(
      `Close constacts (${contacts?.length})\nThe most recent exposure:\n${
        latestExposureDate
          ? moment(latestExposureDate).format("DD MMM HH:mm")
          : "none"
      }`,
      str, // JSON.stringify(contacts),
    );
  },
});
