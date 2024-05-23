"use client";
import { FlyToInterpolator, MapViewState, PickingInfo } from 'deck.gl';
import { useQuery } from 'convex/react';
import {api} from '../convex/_generated/api';
import { useAblyData } from '@/hooks/useAbly';
import MapComponent from '@/components/MapComponent';
import { useCallback, useMemo, useState } from 'react';
import LineBar from '@/components/LineBar';
import { DataType, DeviceInfo } from '@/types/client';
import { CheckCircle, XCircle } from 'react-feather';

const initalView: MapViewState = {
  longitude: 10.19684831488,
  latitude: 56.17250806063,
  zoom: 14,
  pitch: 45,
  transitionInterpolator: new FlyToInterpolator({speed: 2}),
  transitionDuration: 'auto'
}


export default function Home() {
  const [view, setView] = useState<MapViewState>(initalView);
  const [selected, setSelected] = useState<DataType | null>(null);
  const data: DataType[] | undefined = useQuery(api.myFunctions.getAllData);

  const temps = useAblyData("temp");
  const humid = useAblyData("humidity");
  const pressure = useAblyData("pressure");

  const callbackOnClick = useCallback((info: PickingInfo) => {
    const newSelected = data?.find(el => el.device._id === info.object.deviceId);
    if(newSelected) {
      setView({
        longitude: newSelected && newSelected.device.lon ? newSelected.device.lon  - 0.0023 : 10.19684831488,
        latitude: newSelected && newSelected.device.lat ? newSelected.device.lat - 0.001 : 56.17250806063,
        zoom: 16,
        pitch: 45,
        transitionInterpolator: new FlyToInterpolator({speed: 2}),
        transitionDuration: 'auto'
      })
      setSelected(newSelected);
    }
  }, [data]);

  const onClose = useCallback(() => {
    setSelected(null);
    setView(initalView);
  }, []);

  const deviceTransformer = useCallback((data: DataType): DeviceInfo => ({
    position: [data.device.lon, data.device.lat],
    name: data.device.name || 'N/A',
    description: data.device.description,
    deviceId: data.device._id,
    dataAmount: data.readings.length / 30
  }), []);

  const ashraeStandard = useMemo(() => {
    const retObj = {
      temp: 0,
      humidity: 0,
    }
    if(temps.length > 0) {
      if(temps[temps.length - 1]?.temp < 20 ){
        retObj.temp -= 1;
      }
      if(temps[temps.length - 1]?.temp > 24) {
        retObj.temp += 1;
      }
    }
    if(humid.length > 0) {
      if(humid[humid.length - 1]?.humidity < 30 ){
        retObj.humidity -= 1;
      }
      if(humid[humid.length - 1]?.humidity > 60) {
        retObj.humidity += 1;
      }
    }
    return retObj;
  }, [humid, temps])

  const dataReadings = useMemo(() => data?.find(el => el.device._id === selected?.device._id)?.readings ?? [], [data, selected]);
  const tempReadings = useMemo(() => temps.filter(el => el.deviceId === selected?.device._id), [temps, selected]);
  const humidReadings = useMemo(() => humid.filter(el => el.deviceId === selected?.device._id), [humid, selected]);
  const pressureReadings = useMemo(() => pressure.filter(el => el.deviceId === selected?.device._id), [pressure, selected]);

  return (
    <main className="min-h-screen h-screen w-screen">
      {
        selected && 
        <div className='absolute flex top-1/2 -translate-y-1/2 left-2 z-50 h-[98vh] pointer-events-none '>
          <div className='h-full w-fit relative flex flex-col justify-evenly bg-neutral-800 border border-neutral-500 rounded-md items-center px-10 py-4 pointer-events-auto'>
            <div className='absolute top-2 right-2 cursor-pointer' onClick={onClose}>
              <XCircle color='#DAD9D9' size={20} />
            </div>
            <div className=''>
              <LineBar data={dataReadings} readingType="temp" secondaryData={tempReadings} height={300} width={500} />
            </div>
            <div className=''>
              <LineBar data={dataReadings} readingType="pressure" secondaryData={pressureReadings} height={300} width={500} />
            </div>
            <div className=''>
              <LineBar data={dataReadings} readingType="humidity" secondaryData={humidReadings} height={300} width={500} />
            </div>
          </div>
          <div className='bg-neutral-800 rounded-md ml-4 border border-neutral-500 self-end p-4 pointer-events-auto'>
            <div className='px-2 flex max-w-80 rounded-sm' style={{background: "#333"}}>
             <div className='flex flex-col items-center'>
                <div className='my-2 text-center'>
                  <div className='text-xs text-neutral-400 whitespace-nowrap'>
                    Device Name
                  </div>
                  <div className='text-lg text-neutral-300 font-semibold'>
                    {selected.device.name}
                  </div>
                </div>
                <div className='my-2 text-center border-b border-neutral-500 pb-2'>
                  <div className='text-xs text-neutral-400 whitespace-nowrap'>
                    Description
                  </div>
                  <div className='text-neutral-300 ml-2'>
                    {selected.device.description || 'N/A'}
                  </div>
                </div>
                <div className='my-2 flex justify-evenly w-4/5'>
                  <div className='text-center'>
                    <div className='text-xs text-neutral-400 whitespace-nowrap'>
                      Data Amount
                    </div>
                    <div className='text-neutral-300'>
                      {`${Math.round(((dataReadings.length / 30) * 100) * 100 / 100)}%` || 'N/A'}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-xs text-neutral-400 whitespace-nowrap'>
                      ASHRAE Standard
                    </div>
                    <div className='group text-neutral-300 flex justify-center relative'>
                      {
                        ashraeStandard.temp + ashraeStandard.humidity === 0 ? <CheckCircle color='#00FF00' className='mt-1' size={20} /> : <XCircle className='mt-1' color='#FF0000' size={20} />
                      }
                      <div className='absolute duration-200 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 bg-neutral-800 -top-1 -translate-y-full w-fit p-3 rounded-md shadow-md'>
                        <div className='whitespace-nowrap text-sm text-neutral-300'>
                          {
                            ashraeStandard.temp === 1 ? 'Temp: Too High' : ashraeStandard.temp === -1 ? 'Temp: Too Low' : 'Temp: Within Range'
                          }
                        </div>
                        <div className='whitespace-nowrap text-sm text-neutral-300'>
                          {
                            ashraeStandard.humidity === 1 ? 'Humidity: Too High' : ashraeStandard.humidity === -1 ? 'Humidity: Too Low' : 'Humidity: Within Range'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex w-full justify-around text-center'>
                  <div className='my-2'>
                    <div className='text-xs text-neutral-400 whitespace-nowrap'>
                      Current Temp.
                    </div>
                    <div className=' text-neutral-300 text-sm'>
                      {`${Math.round((temps[temps.length - 1]?.temp) * 100) / 100 }°`|| 'N/A'}
                    </div>
                  </div>
                  <div className='my-2'>
                    <div className='text-xs text-neutral-400 whitespace-nowrap text-justify'>
                      Current Humidity
                    </div>
                    <div className='text-neutral-300 text-sm'>
                    {`${Math.round((humid[humid.length - 1]?.humidity) * 100) / 100 }%`|| 'N/A'}
                    </div>
                  </div>
                  <div className='my-2'>
                    <div className='text-xs text-neutral-400 whitespace-nowrap'>
                      Current Pressure
                    </div>
                    <div className='text-neutral-300  text-sm'>
                    {`${Math.round((pressure[pressure.length - 1]?.pressure) * 100) / 100 }hPa`|| 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
      }
      <MapComponent onClick={callbackOnClick} devices={data?.map(el => deviceTransformer(el)) ?? []} view={view} />
    </main>
  );
}
