"use client";

import { WorldMap } from "@/components/ui/world-map";

export default function MapPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">Map</h1>
      <WorldMap
        pins={[
          { lat: 37.7749, lng: -122.4194 }, // San Francisco
          { lat: 42.3314, lng: -83.0458 },  // Detroit
          { lat: 36.1699, lng: -115.1398 }, // Las Vegas
          { lat: 54.5973, lng: -5.9301 },  // Belfast
          { lat: 55.9533, lng: -3.1883 },  // Edinburgh
          { lat: 48.8566, lng: 2.3522 },   // Paris
        ]}
        dots={[
          // New York → Mexico City
          { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 19.4326, lng: -99.1332 } },
          // New York → Lima
          { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: -12.0464, lng: -77.0428 } },
          // New York → Cape Town
          { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: -33.9249, lng: 18.4241 } },
          // New York → London
          { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 51.5074, lng: -0.1278 } },
          // London → Vienna
          { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 48.2082, lng: 16.3738 } },
          // Vienna → Budapest
          { start: { lat: 48.2082, lng: 16.3738 }, end: { lat: 47.4979, lng: 19.0402 } },
          // Budapest → Prague
          { start: { lat: 47.4979, lng: 19.0402 }, end: { lat: 50.0755, lng: 14.4378 } },
          // Prague → Munich
          { start: { lat: 50.0755, lng: 14.4378 }, end: { lat: 48.1351, lng: 11.5820 } },
          // Munich → Zurich
          { start: { lat: 48.1351, lng: 11.5820 }, end: { lat: 47.3769, lng: 8.5417 } },
          // Zurich → Helsinki
          { start: { lat: 47.3769, lng: 8.5417 }, end: { lat: 60.1699, lng: 24.9384 } },
          // Helsinki → Tallinn
          { start: { lat: 60.1699, lng: 24.9384 }, end: { lat: 59.4370, lng: 24.7536 } },
          // Tallinn → Riga
          { start: { lat: 59.4370, lng: 24.7536 }, end: { lat: 56.9496, lng: 24.1052 } },
          // Riga → Vilnius
          { start: { lat: 56.9496, lng: 24.1052 }, end: { lat: 54.6872, lng: 25.2797 } },
          // Vilnius → Athens
          { start: { lat: 54.6872, lng: 25.2797 }, end: { lat: 37.9838, lng: 23.7275 } },
          // Athens → Rhodes
          { start: { lat: 37.9838, lng: 23.7275 }, end: { lat: 36.4341, lng: 28.2176 } },
          // Rhodes → Istanbul
          { start: { lat: 36.4341, lng: 28.2176 }, end: { lat: 41.0082, lng: 28.9784 } },
          // Istanbul → London
          { start: { lat: 41.0082, lng: 28.9784 }, end: { lat: 51.5074, lng: -0.1278 } },
        ]}
      />
    </div>
  );
}
