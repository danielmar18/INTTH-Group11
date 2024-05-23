import { NextRequest, NextResponse } from 'next/server';

const HOST = process.env?.CONVEX_HTTP_URL ?? '';
const API_KEY = process.env?.API_KEY ?? '';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  if(auth !== API_KEY){
    return NextResponse.json('Unauthorized', {status: 401});
  }else{
    const url = `${HOST}/devices`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  }
}