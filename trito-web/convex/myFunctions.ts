import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const postReadings = mutation({
  args: {deviceId: v.id('devices'), temp: v.float64(), humidity: v.float64(), pressure: v.float64()},
  handler: async (ctx, args) => {
    const reading = await ctx.db.insert("readings", {deviceId: args.deviceId, temp: args.temp, humidity: args.humidity, pressure: args.pressure});
    return reading;
  },
});

// Create a new task with the given text
export const registerDevice = mutation({
  args: { lat: v.float64(), lon: v.float64(), name: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const deviceId = await ctx.db.insert("devices", { name: args.name, description: args.description, lat: args.lat, lon: args.lon});
    return deviceId;
  },
});

export const getDevices = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").collect();
    return devices;
  }
})

export const getAllData = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").collect();
    return Promise.all(
      (devices ?? []).map(async dev => {
        return {
          device: dev,
          readings: await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), dev._id)).order("desc").take(30)
        }
      })
    )
  }
})

export const getLatestReadings = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const reading = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").first();
    return reading;
  }
})

export const getReadings = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const readings = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").take(30);
    return readings;
  }
})

export const getLatestTemp = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const reading = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").first();
    return {
      creationTime: reading?._creationTime,
      deviceId: reading?.deviceId,
      temp: reading?.temp,
    };
  }
})

export const getTemp = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const readings = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").take(30);
    return readings.map(r => {return {temp: r.temp, deviceId: r.deviceId, creationTime: r._creationTime}});
  }
})

export const getLatestHumidity = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const reading = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").first();
    return {
      creationTime: reading?._creationTime,
      deviceId: reading?.deviceId,
      humidity: reading?.humidity,
    };
  }
})

export const getHumidity = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const readings = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").take(30);
    return readings.map(r => {return {humidity: r.humidity, deviceId: r.deviceId, creationTime: r._creationTime}});
  }
})

export const getLatestPressure = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const reading = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").first();
    return {
      creationTime: reading?._creationTime,
      deviceId: reading?.deviceId,
      pressure: reading?.pressure,
    };
  }
})

export const getPressure = query({
  args: {deviceId: v.id('devices')},
  handler: async (ctx, args) => {
    const readings = await ctx.db.query("readings").filter((q) => q.eq(q.field("deviceId"), args.deviceId)).order("desc").take(30);
    return readings.map(r => {return {pressure: r.pressure, deviceId: r.deviceId, creationTime: r._creationTime}});
  }
})
