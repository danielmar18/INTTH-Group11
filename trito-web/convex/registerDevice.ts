import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
export const registerDeviceHandler = httpAction(async (ctx, request) => {
  const { name, description, lat, lon } = await request.json();

  if(typeof lat !== 'number' || typeof lon !== 'number') {
    return new Response(JSON.stringify({msg: "Latitude & Longitude should be numbers (Invalid format)"}), {
      status: 400,
    });
  }

  const deviceId = await ctx.runMutation(api.myFunctions.registerDevice, {
    lat: lat,  
    lon: lon,
    name: name,
    description: description  
  });

  return new Response(JSON.stringify({"id": deviceId}), {
    status: 201,
  });
});
