"use client";

import { useState, useEffect } from "react";
import { WorldMap, CityPin } from "@/components/ui/world-map";
import { AnimatedGroup } from "@/components/ui/animated-group";

// City definitions with optional photo arrays
// Add images to any city: images: ["/path/to/photo1.jpg", ...]
const cities: Record<string, CityPin> = {
  nyc:       { lat: 40.7128, lng: -74.0060, label: "New York" },
  mexicoCity:{ lat: 19.4326, lng: -99.1332, label: "Mexico City" },
  lima:      { lat: -12.0464, lng: -77.0428, label: "Lima" },
  capeTown:  { lat: -33.9249, lng: 18.4241, label: "Cape Town" },
  london:    { lat: 51.5074, lng: -0.1278, label: "London" },
  vienna:    { lat: 48.2082, lng: 16.3738, label: "Vienna" },
  budapest:  { lat: 47.4979, lng: 19.0402, label: "Budapest" },
  prague:    { lat: 50.0755, lng: 14.4378, label: "Prague" },
  munich:    { lat: 48.1351, lng: 11.5820, label: "Munich" },
  zurich:    { lat: 47.3769, lng: 8.5417, label: "Zurich" },
  helsinki:   { lat: 60.1699, lng: 24.9384, label: "Helsinki" },
  tallinn:   { lat: 59.4370, lng: 24.7536, label: "Tallinn" },
  riga:      { lat: 56.9496, lng: 24.1052, label: "Riga" },
  vilnius:   { lat: 54.6872, lng: 25.2797, label: "Vilnius" },
  athens:    { lat: 37.9838, lng: 23.7275, label: "Athens" },
  rhodes:    { lat: 36.4341, lng: 28.2176, label: "Rhodes" },
  istanbul:  { lat: 41.0082, lng: 28.9784, label: "Istanbul" },
  sf:        { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
  detroit:   { lat: 42.3314, lng: -83.0458, label: "Detroit" },
  lasVegas:  { lat: 36.1699, lng: -115.1398, label: "Las Vegas" },
  belfast:   { lat: 54.5973, lng: -5.9301, label: "Belfast" },
  edinburgh: { lat: 55.9533, lng: -3.1883, label: "Edinburgh" },
  paris:     { lat: 48.8566, lng: 2.3522, label: "Paris" },
};

const c = cities;

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState<CityPin | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCity(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">Map</h1>
      <WorldMap
        onPinClick={(pin) => setSelectedCity(pin)}
        pins={[c.sf, c.detroit, c.lasVegas, c.belfast, c.edinburgh, c.paris]}
        dots={[
          { start: c.nyc, end: c.mexicoCity },
          { start: c.nyc, end: c.lima },
          { start: c.nyc, end: c.capeTown },
          { start: c.nyc, end: c.london },
          { start: c.london, end: c.vienna },
          { start: c.vienna, end: c.budapest },
          { start: c.budapest, end: c.prague },
          { start: c.prague, end: c.munich },
          { start: c.munich, end: c.zurich },
          { start: c.zurich, end: c.helsinki },
          { start: c.helsinki, end: c.tallinn },
          { start: c.tallinn, end: c.riga },
          { start: c.riga, end: c.vilnius },
          { start: c.vilnius, end: c.athens },
          { start: c.athens, end: c.rhodes },
          { start: c.rhodes, end: c.istanbul },
          { start: c.istanbul, end: c.london },
        ]}
      />
      <p className="text-xs text-neutral-400 mt-2 text-center">
        Scroll to zoom &middot; Drag to pan &middot; Click pins to explore
      </p>

      {/* City photo modal */}
      {selectedCity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCity(null)}
        >
          <div
            className="relative max-w-2xl w-full mx-4 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200 text-xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedCity.label}</h2>
            {selectedCity.images && selectedCity.images.length > 0 ? (
              <AnimatedGroup
                key={selectedCity.label}
                className="grid grid-cols-2 gap-3 md:grid-cols-3"
                preset="blur-slide"
              >
                {selectedCity.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${selectedCity.label} photo ${i + 1}`}
                    className="h-auto w-full rounded-lg object-cover aspect-[4/3]"
                  />
                ))}
              </AnimatedGroup>
            ) : (
              <p className="text-neutral-500 text-sm">
                No photos yet. Add images to this city to see them here.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
