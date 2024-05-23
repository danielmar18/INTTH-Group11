import { NextRequest, NextResponse } from 'next/server';

const HOST = process.env?.CONVEX_HTTP_URL ?? '';
const API_KEY = process.env?.API_KEY ?? '';

export async function GET(req: NextRequest, { params }: { params: { deviceId: string } }) {
  const auth = req.headers.get('Authorization');
  if(auth !== API_KEY){
    return NextResponse.json('Unauthorized', {status: 401});
  }else{
    const device = params.deviceId;
    const url  = req.nextUrl.searchParams.get('latest') ? `${HOST}/readings/humidity/latest` : `${HOST}/readings/humidity`;
    const res = await fetch(url, {
      headers:{
        deviceId: device
      }
    });
    const data = await res.json();
    return NextResponse.json(data);
  }
}