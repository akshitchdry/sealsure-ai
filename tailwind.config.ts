import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        mist: "#f4f7f4",
        fern: "#2f6f5e",
        mint: "#83d4b7",
        coral: "#f36f5a",
        amber: "#f2bd4f",
        steel: "#587083"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 24, 32, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
