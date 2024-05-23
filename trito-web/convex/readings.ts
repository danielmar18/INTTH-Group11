import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const postReadingsHandler = httpAction(async (ctx, request) => {
  const body = await request.json();
  if("messages" in body){
    const firstMsg = body.messages[0];
    if("data" in firstMsg){
      const data = atob(firstMsg.data);
      const obj = JSON.parse(data);
      if("device" in obj && "temp" in obj && "humidity" in obj && "pressure" in obj){
        const deviceId = obj.device;
        const temp = parseFloat(obj.temp);
        const humidity = parseFloat(obj.humidity);
        const pressure = parseFloat(obj.pressure);
        const newEntry = await ctx.runMutation(api.myFunctions.postReadings, {deviceId: deviceId, temp: temp, humidity: humidity, pressure: pressure});
        return new Response(newEntry, {
          status: 201
        });
      }else{
        return new Response("Device or reading not in object", {
          status: 400,
        });
      }
    }else{
      return new Response("Data not in messages", {
        status: 400,
      });
    }
  }else{
    return new Response("Body not correct", {
      status: 400,
    });
  }
});

export const getReadingsHandler = httpAction(async (ctx, request) => {  
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getReadings, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});

export const getLatestReadingsHandler = httpAction(async (ctx, request) => {  
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getLatestReadings, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});

export const getTempHandler = httpAction(async (ctx, request) => {  
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getTemp, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});


export const getLatestTempHandler = httpAction(async (ctx, request) => { 
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getLatestTemp, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});

export const getHumidityHandler = httpAction(async (ctx, request) => {  
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getHumidity, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});


export const getLatestHumidityHandler = httpAction(async (ctx, request) => { 
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getLatestHumidity, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});

export const getPressureHandler = httpAction(async (ctx, request) => {  
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getPressure, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});


export const getLatestPressureHandler = httpAction(async (ctx, request) => { 
  const deviceId = request.headers.get('deviceId'); 
  const data = await ctx.runQuery(api.myFunctions.getLatestPressure, {deviceId: deviceId as Id<'devices'>});
  return new Response(JSON.stringify({data}), {
    status: 200,
  });
});

