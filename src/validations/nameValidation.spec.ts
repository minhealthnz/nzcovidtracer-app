import { ValidationError } from "yup";

import {
  firstNameValidation,
  lastNameValidation,
  middleNameValidation,
} from "./validations";

it.each([
  ["foo", true],
  [1, false],
  ["bar'", true],
  ["foo bar", true],
  ["fo'o bar", true],
  ["fo'o -bar", true],
  ["fo’o -bar", true],
  ["foʼo -bar", true],
  ["@", false],
])("validates first name %s %s", (name, result) => {
  if (result) {
    expect(firstNameValidation.validateSync(name)).toEqual(name);
    expect(middleNameValidation.validateSync(name)).toEqual(name);
    expect(lastNameValidation.validateSync(name)).toEqual(name);
  } else {
    expect(() => firstNameValidation.validateSync(name)).toThrow(
      ValidationError,
    );
    expect(() => middleNameValidation.validateSync(name)).toThrow(
      ValidationError,
    );
    expect(() => lastNameValidation.validateSync(name)).toThrow(
      ValidationError,
    );
  }
});
