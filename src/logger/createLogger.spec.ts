import { nanoid, SerializedError } from "@reduxjs/toolkit";

import { createLogger } from "./createLogger";

const buildError = () => {
  const error: SerializedError = {
    name: nanoid(),
    message: nanoid(),
    stack: nanoid(),
    code: nanoid(),
  };
  const formatted = [
    error.name,
    error.message,
    error.code,
    "",
    error.stack,
  ].join("\n");
  return {
    error,
    formatted,
  };
};

describe("#logInfo", () => {
  it("logs message", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    logger.logInfo("bar");
    expect(transport.log).toBeCalledWith("info", "foo", "bar");
  });
  it("logs error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logInfo(error);
    expect(transport.log).toBeCalledWith("info", "foo", formatted);
  });
  it("logs message, error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logInfo("zzz", error);
    expect(transport.log).toBeCalledWith(
      "info",
      "foo",
      "zzz" + "\n" + formatted,
    );
  });
});

describe("#logWarning", () => {
  it("logs message", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    logger.logWarning("bar");
    expect(transport.log).toBeCalledWith("error", "foo", "bar");
  });
  it("logs error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logWarning(error);
    expect(transport.log).toBeCalledWith("error", "foo", formatted);
  });
  it("logs message, error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logWarning("zzz", error);
    expect(transport.log).toBeCalledWith(
      "error",
      "foo",
      "zzz" + "\n" + formatted,
    );
  });
});

describe("#logError", () => {
  it("logs message", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    logger.logError("bar");
    expect(transport.log).toBeCalledWith("error", "foo", "bar");
  });
  it("logs error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logError(error);
    expect(transport.log).toBeCalledWith("error", "foo", formatted);
  });
  it("logs message, error", () => {
    const transport = {
      log: jest.fn(),
    };
    const logger = createLogger("foo", [transport]);
    const { error, formatted } = buildError();
    logger.logError("zzz", error);
    expect(transport.log).toBeCalledWith(
      "error",
      "foo",
      "zzz" + "\n" + formatted,
    );
  });
});
