export default async function handler(req, res) {
  try {
    const { origin, destination, mode = "bicycling", transitModes = "" } = req.query || {};
    if (!origin || !destination) {
      return res.status(400).json({ status: "REQUEST_DENIED", error_message: "Missing origin/destination" });
    }
    const key = process.env.GOOGLE_SERVER_KEY;
    if (!key) {
      return res.status(500).json({ status: "REQUEST_DENIED", error_message: "GOOGLE_SERVER_KEY not set" });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("mode", String(mode).toLowerCase());
    if (String(mode).toLowerCase() === "transit" && transitModes) {
      url.searchParams.set("transit_mode", String(transitModes).toLowerCase());
    }
    url.searchParams.set("key", key);

    const r = await fetch(url.toString());
    const data = await r.json().catch(() => ({}));
    const ok = r.ok && (data.status === "OK" || data.status === "ZERO_RESULTS");

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=600");
    return res.status(ok ? 200 : 400).json(data);
  } catch (e) {
    console.error("DIRECTIONS ERROR:", e);
    return res.status(500).json({ status: "SERVER_ERROR", error_message: String(e?.message || e) });
  }
}
