{\rtf1\ansi\ansicpg1252\cocoartf2706
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export const config = \{ runtime: "edge" \};\
\
export default async function handler(req) \{\
  const \{ searchParams \} = new URL(req.url);\
  const lat = searchParams.get("lat");\
  const lng = searchParams.get("lng");\
  const radius = searchParams.get("radius") || "1000";\
  const type = searchParams.get("type") || "subway_station";\
\
  if (!lat || !lng) \{\
    return new Response(JSON.stringify(\{ error: "Missing lat/lng" \}), \{ status: 400 \});\
  \}\
\
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");\
  url.searchParams.set("location", `$\{lat\},$\{lng\}`);\
  url.searchParams.set("radius", radius);\
  url.searchParams.set("type", type);\
  url.searchParams.set("key", process.env.GOOGLE_SERVER_KEY);\
\
  const r = await fetch(url.toString());\
  const data = await r.json();\
\
  return new Response(JSON.stringify(data), \{\
    status: r.ok ? 200 : 400,\
    headers: \{ "content-type": "application/json", "cache-control": "s-maxage=300, stale-while-revalidate=1200" \},\
  \});\
\}\
}
