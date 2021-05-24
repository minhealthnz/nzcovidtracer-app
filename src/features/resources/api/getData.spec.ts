import { RemoteSectionListData } from "@components/types";
import { nanoid } from "@reduxjs/toolkit";
import Axios from "axios";

import { getData } from "./getData";

describe("#getData", () => {
  it("fetches data", async () => {
    const etag = nanoid();
    const client = Axios.create();
    const get = (client.get = jest.fn());
    const data: RemoteSectionListData = {
      sections: [
        {
          title: "foo",
          data: [],
        },
      ],
    };

    const response = {
      status: 200,
      headers: {
        etag: nanoid(),
        expires: "Tue, 01 Jun 2021 00:00:00 GMT",
      },
      data,
    };

    get.mockReturnValue(response);

    const result = await getData(etag, client);

    // Sends the If-None-Match etag header
    expect(client.get).toHaveBeenCalledWith("", {
      headers: { "if-none-match": `${etag}`, "cache-control": "no-cache" },
    });

    expect(result.data).toEqual(data);
    expect(result.notModified).toBe(false);
    expect(result.etag).toEqual(response.headers.etag);
    expect(result.expires).toEqual(new Date("2021-06-01T00:00:00.000Z"));
  });

  it("returns not modified", async () => {
    const etag = nanoid();
    const client = Axios.create();
    const get = (client.get = jest.fn());

    get.mockImplementation(() => {
      const error = {
        isAxiosError: true,
        response: {
          status: 304,
          headers: {
            expires: "Tue, 01 Jun 2021 00:00:00 GMT",
          },
        },
      };
      throw error;
    });

    const result = await getData(etag, client);

    expect(result.notModified).toBe(true);
    expect(result.expires).toEqual(new Date("2021-06-01T00:00:00.000Z"));
  });
});
