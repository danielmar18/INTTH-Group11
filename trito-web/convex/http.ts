import { httpRouter } from "convex/server";
import { registerDeviceHandler } from "./registerDevice";
import { getHumidityHandler, getLatestHumidityHandler, getLatestPressureHandler, getLatestReadingsHandler, getLatestTempHandler, getPressureHandler, getReadingsHandler, getTempHandler, postReadingsHandler } from "./readings";
import { getDevicesHandlder } from "./devices";

const http = httpRouter();

http.route({
  path: "/devices",
  method: "POST",
  handler: registerDeviceHandler,
});

http.route({
  path: "/readings",
  method: "POST",
  handler: postReadingsHandler,
});

http.route({
  path: "/readings",
  method: "GET",
  handler: getReadingsHandler,
});

http.route({
  path: "/readings/latest",
  method: "GET",
  handler: getLatestReadingsHandler,
});

http.route({
  path: "/readings/temp",
  method: "GET",
  handler: getTempHandler,
});

http.route({
  path: "/readings/temp/latest",
  method: "GET",
  handler: getLatestTempHandler,
});

http.route({
  path: "/readings/humidity",
  method: "GET",
  handler: getHumidityHandler,
});

http.route({
  path: "/readings/humidity/latest",
  method: "GET",
  handler: getLatestHumidityHandler,
});

http.route({
  path: "/readings/pressure",
  method: "GET",
  handler: getPressureHandler,
});

http.route({
  path: "/readings/pressure/latest",
  method: "GET",
  handler: getLatestPressureHandler,
});

http.route({
  path: "/devices",
  method: "GET",
  handler: getDevicesHandlder,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;