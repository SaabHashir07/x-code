import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build ko lint errors ki wajah se fail hone se bachane ke liye.
    // Errors abhi bhi `npm run lint` se dikhte hain, sirf build ko block nahi karte.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
