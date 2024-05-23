import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  devices: defineTable({
    description: v.optional(v.string()),
    lat: v.float64(),
    lon: v.float64(),
    name: v.optional(v.string()),
  }),
  readings: defineTable({
    deviceId: v.id("devices"),
    humidity: v.float64(),
    pressure: v.float64(),
    temp: v.float64(),
  })
});