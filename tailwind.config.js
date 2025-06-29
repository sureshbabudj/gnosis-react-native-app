/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(-3deg)" },
          "25%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(-3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      fontFamily: {
        // Override default sans-serif to use Fira Sans Regular
        sans: ["FiraSans_400Regular"],
        // Override default serif to use Alice
        serif: ["Alice_400Regular"],
        // Override default mono
        mono: ["FiraSans_400Regular"],

        // Custom font families for specific weights
        // These will create font-thin, font-extralight, etc. classes
        thin: ["FiraSans_100Thin"],
        extralight: ["FiraSans_200ExtraLight"],
        light: ["FiraSans_300Light"],
        normal: ["FiraSans_400Regular"],
        medium: ["FiraSans_500Medium"],
        semibold: ["FiraSans_600SemiBold"],
        bold: ["FiraSans_700Bold"],
        extrabold: ["FiraSans_800ExtraBold"],
        black: ["FiraSans_900Black"],

        // Italic versions
        "thin-italic": ["FiraSans_100Thin_Italic"],
        "extralight-italic": ["FiraSans_200ExtraLight_Italic"],
        "light-italic": ["FiraSans_300Light_Italic"],
        "normal-italic": ["FiraSans_400Regular_Italic"],
        "medium-italic": ["FiraSans_500Medium_Italic"],
        "semibold-italic": ["FiraSans_600SemiBold_Italic"],
        "bold-italic": ["FiraSans_700Bold_Italic"],
        "extrabold-italic": ["FiraSans_800ExtraBold_Italic"],
        "black-italic": ["FiraSans_900Black_Italic"],

        // Ropa Sans font
        ropa: ["RopaSans_400Regular"],
        "ropa-italic": ["RopaSans_400Regular_Italic"],

        // Alice font
        alice: ["Alice_400Regular"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
