// lib/structured-data.js
import { getSiteUrl } from "./site-url";

export function getRootJsonLd() {
  const site = getSiteUrl();

  const NAME = "Brian Hartnett";
  const DESCRIPTION =
    "Software developer building automation, tools, and product-focused experiences.";
  const AVATAR = `${site}/og.png`; // optional but nice (or /headshot.jpg)
  const SAME_AS = [
    "https://github.com/bju12290",
    "https://www.linkedin.com/in/brian-hartnett-jr/",
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site}/#person`,
        name: NAME,
        url: site,
        image: AVATAR,
        description: DESCRIPTION,
        sameAs: SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: NAME,
        description: DESCRIPTION,
        publisher: { "@id": `${site}/#person` },
        inLanguage: "en-US",
        // Tell Google you have a search box (for later if necessary)
        // potentialAction: {
        //   "@type": "SearchAction",
        //   target: `${site}/search?q={search_term_string}`,
        //   "query-input": "required name=search_term_string",
        // },
      },
    ],
  };
}
