// Representative subset of London TfL stations for the client-side router.
// To expand, add more stations with { name, lat, lng, lines:[] }.

const STATIONS_DATA = [
  // Major Terminals
  { name: "King's Cross St. Pancras", lat: 51.5308, lng: -0.1238, lines: ["Northern", "Victoria", "Piccadilly", "Circle", "Hammersmith & City", "Metropolitan"] },
  { name: "Waterloo", lat: 51.5032, lng: -0.1147, lines: ["Jubilee", "Northern", "Bakerloo", "Waterloo & City"] },
  { name: "Paddington", lat: 51.5154, lng: -0.1755, lines: ["Bakerloo", "Circle", "District", "Hammersmith & City", "Elizabeth line"] },
  { name: "Liverpool Street", lat: 51.5178, lng: -0.0817, lines: ["Central", "Circle", "Hammersmith & City", "Metropolitan", "Elizabeth line", "London Overground"] },
  { name: "London Bridge", lat: 51.5055, lng: -0.0868, lines: ["Jubilee", "Northern"] },
  { name: "Victoria", lat: 51.4964, lng: -0.1439, lines: ["Victoria", "Circle", "District"] },
  { name: "Euston", lat: 51.5281, lng: -0.1336, lines: ["Northern", "Victoria", "London Overground"] },

  // Central Hubs
  { name: "Oxford Circus", lat: 51.5152, lng: -0.1419, lines: ["Central", "Bakerloo", "Victoria"] },
  { name: "Bank", lat: 51.5134, lng: -0.0891, lines: ["Central", "Northern", "Waterloo & City", "DLR"] },
  { name: "Holborn", lat: 51.5174, lng: -0.1200, lines: ["Central", "Piccadilly"] },
  { name: "Bond Street", lat: 51.5142, lng: -0.1494, lines: ["Central", "Jubilee", "Elizabeth line"] },
  { name: "Green Park", lat: 51.5067, lng: -0.1428, lines: ["Jubilee", "Piccadilly", "Victoria"] },
  { name: "Leicester Square", lat: 51.5113, lng: -0.1285, lines: ["Northern", "Piccadilly"] },
  { name: "Tottenham Court Road", lat: 51.5165, lng: -0.1310, lines: ["Central", "Northern", "Elizabeth line"] },
  
  // Key Interchanges
  { name: "Stratford", lat: 51.5416, lng: -0.0034, lines: ["Central", "Jubilee", "Elizabeth line", "DLR", "London Overground"] },
  { name: "Canary Wharf", lat: 51.5035, lng: -0.0186, lines: ["Jubilee", "Elizabeth line", "DLR"] },
  { name: "Canada Water", lat: 51.4980, lng: -0.0497, lines: ["Jubilee", "London Overground"] },
  { name: "Elephant & Castle", lat: 51.4945, lng: -0.1006, lines: ["Bakerloo", "Northern"] },
  { name: "South Kensington", lat: 51.4941, lng: -0.1738, lines: ["District", "Circle", "Piccadilly"] },
  { name: "Finbury Park", lat: 51.5642, lng: -0.1064, lines: ["Victoria", "Piccadilly"] },
  { name: "Highbury & Islington", lat: 51.5463, lng: -0.1035, lines: ["Victoria", "London Overground"] },
  
  // North
  { name: "Camden Town", lat: 51.5392, lng: -0.1426, lines: ["Northern"] },
  { name: "Archway", lat: 51.5654, lng: -0.1348, lines: ["Northern"] },
  { name: "Hampstead", lat: 51.5567, lng: -0.1783, lines: ["Northern"] },
  
  // South
  { name: "Brixton", lat: 51.4626, lng: -0.1147, lines: ["Victoria"] },
  { name: "Clapham Junction", lat: 51.4651, lng: -0.1706, lines: ["London Overground"] }, // Mostly rail, but key
  { name: "Vauxhall", lat: 51.4861, lng: -0.1253, lines: ["Victoria"] },
  { name: "Wimbledon", lat: 51.4214, lng: -0.2066, lines: ["District", "Tram"] },
  
  // East
  { name: "Whitechapel", lat: 51.5194, lng: -0.0601, lines: ["District", "Hammersmith & City", "London Overground", "Elizabeth line"] },
  { name: "Shoreditch High Street", lat: 51.5234, lng: -0.0759, lines: ["London Overground"] },
  
  // West
  { name: "Hammersmith", lat: 51.4925, lng: -0.2238, lines: ["District", "Piccadilly", "Hammersmith & City", "Circle"] },
  { name: "Shepherd's Bush", lat: 51.5046, lng: -0.2185, lines: ["Central", "London Overground"] },
  { name: "Notting Hill Gate", lat: 51.5091, lng: -0.1961, lines: ["Central", "District", "Circle"] },
  { name: "Earl's Court", lat: 51.4921, lng: -0.1925, lines: ["District", "Piccadilly"] }
];

// Helper to find nearest
function findStations({ lat, lng, radiusMeters }) {
  const matches = [];
  const R = 6371e3; // metres
  
  for (const s of STATIONS_DATA) {
    const φ1 = lat * Math.PI/180;
    const φ2 = s.lat * Math.PI/180;
    const Δφ = (s.lat-lat) * Math.PI/180;
    const Δλ = (s.lng-lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;

    if (d <= radiusMeters) {
      matches.push({ ...s, dist: d });
    }
  }
  
  return matches.sort((a,b) => a.dist - b.dist);
}
