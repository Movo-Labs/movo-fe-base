"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import CountUp from "@/components/CountUp";

const World = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.World),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
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
  // Main Global Routes
  {
    order: 1,
    startLat: 1.3,
    startLng: 103.8,
    endLat: 51.5,
    endLng: -0.1,
    arcAlt: 0.4,
    color: "#ffffff",
  },
  {
    order: 2,
    startLat: 51.5,
    startLng: -0.1,
    endLat: 40.7,
    endLng: -74.0,
    arcAlt: 0.35,
    color: "#ffffff",
  },
  {
    order: 3,
    startLat: 40.7,
    startLng: -74.0,
    endLat: 34.0,
    endLng: -118.2,
    arcAlt: 0.3,
    color: "#ffffff",
  },
  {
    order: 4,
    startLat: 34.0,
    startLng: -118.2,
    endLat: 35.6,
    endLng: 139.7,
    arcAlt: 0.45,
    color: "#ffffff",
  },
  {
    order: 5,
    startLat: -33.8,
    startLng: 151.2,
    endLat: 1.3,
    endLng: 103.8,
    arcAlt: 0.35,
    color: "#ffffff",
  },
];

const features = [
  {
    title: "Secure MPC Wallet",
    description: "Industry-leading security for your digital assets",
  },
  {
    title: "Low Transaction Fees",
    description: "Competitive rates for all transactions",
  },
  {
    title: "Real-Time Settlements",
    description: "Instant confirmation and settlement",
  },
  {
    title: "Multiple Cryptocurrency",
    description: "Support for various digital currencies",
  },
];

const stats = [
  {
    value: "2458932.47",
    label: "Total Revenue",
    prefix: "$",
  },
  {
    value: "1847265,89",
    label: "USDC Payments",
    prefix: "$",
  },
  {
    value: "9876543210",
    label: "IDR Payments",
    prefix: "Rp",
  },
  {
    value: "15847",
    label: "Transactions",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const handleGetStarted = () => {
    if (isConnected) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard"); // Will show connect wallet modal on dashboard
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#062038] to-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold text-white">Movo</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <World data={globeData} globeConfig={globeConfig} />
        </div>
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Cross-Border Crypto Payments Powered by X402
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Web3 Payments Made Simple with the X402 Protocol. Simplify
            cryptocurrency transactions and cross-border settlements using our
            secure, fast, and reliable payment platform.
          </p>
          <div className="flex items-center justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 py-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="count-up-text text-2xl md:text-3xl font-bold text-white">
              {stat.prefix && <span>{stat.prefix}</span>}
              <CountUp
                from={0}
                to={parseFloat(stat.value)}
                duration={1}
                direction="up"
                separator=","
              ></CountUp>
            </div>
            <div className="text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Powerful Web3 Payment Features
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Everything you need to accept and manage cryptocurrency payments for
            your business with Movo.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
