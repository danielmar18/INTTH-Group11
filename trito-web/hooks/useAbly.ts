import { useState } from 'react';
import { useChannel, useChannelStateListener, useConnectionStateListener } from 'ably/react';
import { ReadingType, SecondaryData } from '@/types/db';
import { Id } from '@/convex/_generated/dataModel';


export function useAblyData<T extends keyof ReadingType>(readingType: T) {
  const [readings, setReadings] = useState<SecondaryData<T>[]>([]);

  useConnectionStateListener('connected', () => {
    console.log('Connected to Ably!');
  });

  
  useChannelStateListener(`/readings/${readingType}`, (channel) => {
      console.log(channel);
    } 
  );

  const { channel } = useChannel(`/readings/${readingType}`, (message) => {
    const timeStamp = message.timestamp;
    if(timeStamp !== undefined){
      const enc = new TextDecoder('utf-8');
      const str = enc.decode(message.data);
      const obj: {device: string, reading: number} = JSON.parse(str);
      let newObj: SecondaryData<T> = {[readingType]: obj.reading, _creationTime: timeStamp, deviceId: obj.device as Id<'devices'>} as SecondaryData<T>;
      setReadings(prevReadings => [...prevReadings, newObj]);
    }
  });
  
  return readings;
}
