import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fretboard Trainer",
    short_name: "Fretboard Trainer",
    description: "Train your fretboard knowledge with Fretboard Trainer.",
    start_url: "/",
    display: "standalone",
    background_color: "#2C2E31",
    theme_color: "#2C2E31",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
