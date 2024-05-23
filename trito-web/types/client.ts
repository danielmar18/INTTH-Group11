import { Position } from "deck.gl"
import { Device, Reading } from "./db"
import { Doc } from "@/convex/_generated/dataModel"

export type DataType = {
  device: Device,
  readings: Reading[]
}

export type DeviceInfo = {
  position: Position,
  name: string,
  description?: string,
  deviceId: Doc<"devices">["_id"],
  dataAmount: number
}