import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const getDevicesHandlder = httpAction(async (ctx, request) => { 
  const data = await ctx.runQuery(api.myFunctions.getDevices);
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});