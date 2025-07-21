import { UAParser } from "ua-parser-js";

export const getClientInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();

  let device = "Desktop";
  if (result.device.type) {
    device = result.device.model || result.device.type || "Unknown Device";
  }

  // Fetch IP-based location info
  let location = null;
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      location = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        org: data.org,
      };
    }
  } catch (err) {
    // Ignore location errors
  }

  return {
    os: result.os.name || "Unknown OS",
    browser: result.browser.name || "Unknown Browser",
    device,
    location, // { ip, city, region, country, org } or null
  };
};
