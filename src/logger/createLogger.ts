import { SerializedError } from "@reduxjs/toolkit";
import _ from "lodash";

import { createTransports } from "./createTransports";
import { Logger } from "./Logger";

type ErrorType = Error | SerializedError;

export function createLogger(name: string, transports = createTransports()) {
  const logger = new Logger({
    name,
    transports,
  });
  const result = {
    logInfo: (message: string | ErrorType, error?: ErrorType) => {
      safeCall(() => logger.logInfo(formatError(message, error)));
    },
    logWarning(message: string | ErrorType, error?: ErrorType) {
      safeCall(() => {
        logger.logError(formatError(message, error));
      });
    },
    logError(message: string | ErrorType, error?: ErrorType) {
      safeCall(() => {
        logger.logError(formatError(message, error));
      });
    },
  };

  return result;
}

function safeCall(callback: () => void) {
  try {
    callback();
  } catch (err) {
    if (__DEV__) {
      throw err;
    }
  }
}

function formatError(message: string | ErrorType, error?: ErrorType) {
  const output = [];
  output.push(_formatError(message));
  if (error != null) {
    output.push(_formatError(error));
  }

  return output.join("\n");
}

function _formatError(error: string | ErrorType) {
  if (_.isString(error)) {
    return error;
  }

  const serialized = error instanceof Error ? toSerialized(error) : error;

  const lines = [];

  if (serialized.name) {
    lines.push(serialized.name);
  }

  if (serialized.message) {
    lines.push(serialized.message);
  }

  if (serialized.code) {
    lines.push(serialized.code);
  }

  if (serialized.stack) {
    lines.push("");
    lines.push(serialized.stack);
  }

  return lines.join("\n");
}

function toSerialized(err: Error): SerializedError {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
}
