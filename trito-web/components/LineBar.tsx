"use client"

import React from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { timeFormat } from 'd3-time-format';
import { Reading, ReadingData, ReadingType, SecondaryData } from '@/types/db';

export const background = '#f3f3f3';

const rectBg = '#333';
const gridlines = '#505050';
const textAndOutlines = '#A1A1A1';
const label = '#BAB9B9';

const colorValues = {
  "temp": "#005EF0",
  "humidity": "#F00000",
  "pressure": "#00F026"
} as const;

const secondaryColorValues = {
  "temp": "#00D6F0",
  "humidity": "#FF2492",
  "pressure": "#00F09E"
} as const;

const measurementLineColorValues = {
  "temp": "#247AFF70",
  "humidity":  "#FF242470",
  "pressure": "#24FF4770"
} as const;

// accessors
const date = <T extends keyof ReadingType> (d: Reading | SecondaryData<T>) => new Date(d._creationTime).valueOf();

export type ThresholdProps<T extends keyof ReadingType> = {
  data: Reading[];
  readingType: T;
  secondaryData: SecondaryData<T>[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const LineBar = <T extends keyof ReadingType>({ data, secondaryData, readingType, width, height, margin = { top: 40, right: 30, bottom: 50, left: readingType === "pressure" ? 55 : 45 }}: ThresholdProps<T>) => {

  const getReadingDataNumberValue = (d: ReadingData) => Number(d[readingType]);
  const getSecondaryDataNumberValue = (d: SecondaryData<T>) => Number(d[readingType]);
  
  const test2 = [...data.map(el => el[readingType]), ...(secondaryData?.map(el => el[readingType]) ?? [])];
  const temperatureScale = scaleLinear<number>({
    domain: [
      Math.min(...test2),
      Math.max(...test2),
    ],
    nice: true,
  });
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const test = [...data.map(el => el._creationTime), ...(secondaryData?.map(el => el._creationTime) ?? [])];
  const timeScale = scaleTime<number>({
    domain: [Math.min(...test), Math.max(...test)] 
  });
  

  timeScale.range([0, xMax]);
  temperatureScale.range([yMax, 0]);

// Define your tick format function
const formatDate = timeFormat("%H:%M");

// Wrapper function to ensure type compatibility
const formatTick = (value: Date | { valueOf(): number }): string => {
  // Check if 'value' is a Date instance, otherwise handle as a NumberValue
  if (value instanceof Date) {
    return formatDate(value);
  } else {
    // Assuming value is a NumberValue, convert to Date
    return formatDate(new Date(value.valueOf()));
  }
};
  return (
    <div className='border border-neutral-500 rounded-lg'>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={rectBg} rx={8} />
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={temperatureScale} width={xMax} height={yMax} stroke={gridlines} />
          <GridColumns scale={timeScale} width={xMax} height={yMax} stroke={gridlines}  />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke={gridlines} />
          <line x1={0} x2={xMax} y1={temperatureScale(data.length > 0 ? data[0][readingType] : 0)} y2={temperatureScale(data.length > 0 ? data[0][readingType] : 0)} stroke={measurementLineColorValues[readingType]} />
          <AxisBottom top={yMax} scale={timeScale} numTicks={width > 520 ? 10 : 5} tickStroke={textAndOutlines} stroke={textAndOutlines} tickLabelProps={{stroke: "50", fill: textAndOutlines}} tickFormat={formatTick} />
          <AxisLeft scale={temperatureScale} tickStroke={textAndOutlines} stroke={textAndOutlines} tickLabelProps={{stroke: "50", fill: textAndOutlines}}  />
          <text x="-70" y="15" stroke={label} strokeWidth={1} transform="rotate(-90)" fontSize={10}>
            {readingType === "humidity" ? "Humidity (%)" : readingType === "pressure" ? "Pressure (hPa)" : "Temperature (°C)"}
          </text>
          {
            secondaryData !== undefined &&
            <LinePath
              data={secondaryData}
              curve={curveBasis}
              x={(d) => timeScale(date(d)) ?? 0}
              y={(d) => temperatureScale(getSecondaryDataNumberValue(d)) ?? 0}
              stroke={secondaryColorValues[readingType]}
              strokeWidth={1.5}
              strokeOpacity={0.6}
              strokeDasharray="1,2"
            />
          }
          <LinePath
            data={data}
            curve={curveBasis}
            x={(d) => timeScale(date(d)) ?? 0}
            y={(d) => temperatureScale(getReadingDataNumberValue(d)) ?? 0}
            stroke={colorValues[readingType]}
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray=""
          />
        </Group>
      </svg>
    </div>
  );
}

export default LineBar;