"use client";

import dynamic from "next/dynamic";

const World = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.World),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

const globeConfig = {
  pointSize: 1,
  globeColor: "#062038",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  emissive: "#062038",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
};

const globeData = [
  {
    order: 1,
    startLat: -25.5,
    startLng: 133.7,
    endLat: 35.8,
    endLng: 104.1,
    arcAlt: 0.3,
    color: "#ffffff",
  },
  {
    order: 2,
    startLat: 51.5,
    startLng: -0.1,
    endLat: 40.7,
    endLng: -74.0,
    arcAlt: 0.3,
    color: "#ffffff",
  },
  // Add more arcs as needed
];

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-black">
      <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      <div className="relative h-full w-full">
        <World data={globeData} globeConfig={globeConfig} />
      </div>
    </div>
  );
}
