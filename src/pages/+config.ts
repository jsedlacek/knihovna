import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
export default {
  // Inherit from vike-react
  extends: [vikeReact],

  // Enable static site generation
  prerender: true,

  // Default meta tags
  title: "Nejlepší e-knihy zdarma",
  description:
    "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",

  // Language setting
  lang: "cs",
} satisfies Config;
