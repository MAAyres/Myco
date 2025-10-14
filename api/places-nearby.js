export default async function handler(req, res) {
  try {
    const { lat, lng, radius = "1000", type = "subway_station" } = req.query || {};
    if (!lat || !lng) {
      return res.status(400).json({ status: "REQUEST_DENIED", error_message: "Missing lat/lng" });
    }
    const key = process.env.GOOGLE_SERVER_KEY;
    if (!key) {
      return res.status(500).json({ status: "REQUEST_DENIED", error_message: "GOOGLE_SERVER_KEY not set" });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("type", String(type));
    url.searchParams.set("key", key);

    const r = await fetch(url.toString());
    const data = await r.json().catch(() => ({}));
    const ok = r.ok && (data.status === "OK" || data.status === "ZERO_RESULTS");

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1200");
    return res.status(ok ? 200 : 400).json(data);
  } catch (e) {
    console.error("PLACES ERROR:", e);
    return res.status(500).json({ status: "SERVER_ERROR", error_message: String(e?.message || e) });
  }
}
