import { UAParser } from "ua-parser-js";

export const getClientInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    os: result.os.name || "Unknown OS",
    browser: result.browser.name || "Unknown Browser",
    device: result.device.model || "Unknown Device",
  };
};
