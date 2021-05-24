import { sectionListSchema } from "./validations";

describe("sectionListSchema", () => {
  it.each([
    {
      sections: [],
    },
    {
      sections: [
        {
          title: "foo",
          data: [],
        },
      ],
    },
    {
      sections: [
        {
          title: "foo",
          data: [
            {
              component: "Card",
              title: "bar",
            },
          ],
        },
      ],
    },
  ])("accepts valid data", (data) => {
    expect(sectionListSchema.validate(data)).resolves.not.toThrow();
  });

  it.each([
    { sections: undefined },
    {
      sections: [
        {
          title: 1,
        },
      ],
    },
    {
      sections: [
        {
          title: "foo",
          data: [
            {
              component: "unknown",
            },
          ],
        },
      ],
    },
    {
      sections: [
        {
          title: "foo",
          data: "notArray",
        },
      ],
    },
  ])("throws on invalid data", (data) => {
    expect(sectionListSchema.validate(data)).rejects.toThrow();
  });
});
