export default function handler(req, res) {
  try {
    const mapsJsKey = process.env.NEXT_PUBLIC_MAPS_JS_KEY || null;
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).json({ mapsJsKey });
  } catch (e) {
    console.error("ENV ERROR:", e);
    res.status(500).json({ error: "ENV_FAIL", message: String(e?.message || e) });
  }
}
