"use client";
import { ReactNode } from "react";
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from "ably/react";

const ABLY_API_KEY = process.env.NEXT_PUBLIC_ABLY_API_KEY!;

const client = new Ably.Realtime({key: ABLY_API_KEY});

export default function AblyReactProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AblyProvider client={client}>
        <ChannelProvider channelName="/readings/temp">
          <ChannelProvider channelName="/readings/humidity">
            <ChannelProvider channelName="/readings/pressure">
              {children}
            </ChannelProvider>
          </ChannelProvider>
        </ChannelProvider>
      </AblyProvider>
    )
}
