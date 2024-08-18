import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        main: "#a388ee",
        mainAccent: "#9e66ff", // not needed for shadcn components
        overlay: "rgba(0,0,0,0.8)", // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: "#e3dff2",
        text: "#000",
        border: "#000",

        // dark mode
        darkBg: "#1D1F27",
        darkText: "#eeefe9",
        darkBorder: "#000",
        secondaryBlack: "#1b1b1b", // opposite of plain white, not used pitch black because borders and box-shadows are that color
      },
      borderRadius: {
        base: "6px",
      },
      boxShadow: {
        light: "3px 3px 0px 0px #000",
        dark: "3px 3px 0px 0px #000",
      },
      translate: {
        boxShadowX: "3px",
        boxShadowY: "3px",
        reverseBoxShadowX: "-3px",
        reverseBoxShadowY: "-3px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
