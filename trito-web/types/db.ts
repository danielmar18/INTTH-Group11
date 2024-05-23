import { Doc } from "@/convex/_generated/dataModel";

export type Device = Doc<"devices">;

export type Reading = Doc<"readings">;

export type ReadingData = Pick<Reading, "temp" | "humidity" | "pressure">;

export type ReadingType = Pick<Reading, "humidity" | "pressure" | "temp">

export type SecondaryData<Property extends keyof ReadingType> = Pick<Reading, "_creationTime" | "deviceId"> & Pick<Reading, Property>;