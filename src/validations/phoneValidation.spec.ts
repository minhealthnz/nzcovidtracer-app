import { phoneValidation } from "./validations";

type ValidationError =
  | "validations:phone:invalid"
  | "validations:phone:required";

describe("#phoneValidation", () => {
  const data: [string, string, true | ValidationError[]][] = [
    ["2101231234", "NZ", true],
    ["210123123", "NZ", true],
    ["21012312", "NZ", true],
    ["2101231", "NZ", ["validations:phone:invalid"]],
    ["02102323234", "NZ", true],
    ["0210232323", "NZ", true],
    ["021023232", "NZ", true],
    ["02102323", "NZ", ["validations:phone:invalid"]],
    ["1234", "NZ", ["validations:phone:invalid"]],
    ["091231234", "NZ", true],
    ["09123123", "NZ", ["validations:phone:invalid"]],
    ["91231234", "NZ", true],
    ["9123123", "NZ", ["validations:phone:invalid"]],
    ["", "NZ", ["validations:phone:invalid", "validations:phone:required"]],
    ["1201231234", "NZ", ["validations:phone:invalid"]],
    ["001231234", "NZ", ["validations:phone:invalid"]],
    ["abcd", "NZ", ["validations:phone:invalid"]],
    ["02102323234a", "NZ", true],
    ["01189998819991197253", "NZ", ["validations:phone:invalid"]],
  ];

  for (const row of data) {
    const phone = row.slice(0, 2);
    const validationResult = row[2];
    it(`${phone[0]} ${
      validationResult === true ? "succeeds" : "fails"
    }`, async () => {
      if (validationResult === true) {
        const result = await phoneValidation.validate(phone);
        expect(result).toEqual(phone);
      } else {
        expect.assertions(1);
        try {
          await phoneValidation.validate(phone, { abortEarly: false });
        } catch (err) {
          expect(err.errors).toEqual(validationResult);
        }
      }
    });
  }
});
