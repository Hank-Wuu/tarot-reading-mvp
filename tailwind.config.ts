import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0b1020",
        panel: "#11182b",
        mist: "#d9e3ff",
        gold: "#d4b06a",
        plum: "#6d4cff",
        rose: "#f096aa"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(6, 10, 22, 0.35)"
      },
      backgroundImage: {
        stars:
          "radial-gradient(circle at 20% 20%, rgba(212, 176, 106, 0.14), transparent 32%), radial-gradient(circle at 80% 0%, rgba(109, 76, 255, 0.2), transparent 28%), linear-gradient(180deg, #070b16 0%, #0b1020 55%, #10182f 100%)"
      }
    }
  },
  plugins: []
};

export default config;
