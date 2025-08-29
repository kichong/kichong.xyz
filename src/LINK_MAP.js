// LINK_MAP.js — JS module so we avoid JSON import quirks in Vite/Babel.
// Shape supports either { title, items: [...] } or { title, sections: [...] }.

export default {
  triangle: {
    title: "TOOLS",
    items: [
      { label: "Mindmapper", href: "https://mindmapper.kichong.xyz/" }
    ]
  },

  square: {
    title: "WORK",
    sections: [
      {
        subtitle: "Ethereum Foundation (Privacy and Scaling Explorations)",
        items: [
          { label: "TLSNotary History", href: "https://tlsnotary.org/blog/2025/08/08/tlsnotary-history" },
          { label: "Beyond Zero-Knowledge", href: "https://mirror.xyz/privacy-scaling-explorations.eth/xXcRj5QfvA_qhkiZCVg46Gn9uX8P_Ld-DXlqY51roPY" },
          { label: "zkEVM", href: "https://mirror.xyz/privacy-scaling-explorations.eth/I5BzurX-T6slFaPbA4i3hVrO7U2VkBR45eO-N3CSnSg" },
          { label: "SNARK Fundamentals", href: "https://erroldrummond.gitbook.io/snark-fundamentals" }
        ]
      },
      {
        subtitle: "Decrypt",
        items: [
          { label: "Author Page", href: "https://decrypt.co/author/kichongtran" }
        ]
      },
      {
        subtitle: "Gemini's Cryptopedia",
        items: [
          { label: "DeFi", href: "https://www.gemini.com/cryptopedia/explore#de-fi" }
        ]
      },
      {
        subtitle: "Blokt",
        items: [
          { label: "Author Page", href: "https://blokt.com/author/ki-chong-tran/" }
        ]
      },
      {
        subtitle: "ARC Hub PNH",
        items: [
          { label: "NBC News", href: "https://www.nbcnews.com/news/asian-america/cambodias-socially-driven-startup-scene-lures-entrepreneurs-n370621" },
          { label: "Tech in Asia", href: "https://www.techinasia.com/brothers-paving-cambodias-3d-printing-revolution" },
          { label: "Khmer Times", href: "https://www.khmertimeskh.com/25784/3d-printed-prosthetics-find-their-first-match/" }
        ]
      }
    ]
  },

  circle: {
    title: "ART",
    items: [
      { label: "Ethereum Papers", href: "https://www.ethpapers.xyz" }
    ]
  },

  cross: {
    title: "CONNECT",
    items: [
      { label: "Email", href: "mailto:kichong@ethpapers.xyz" }
    ]
  }
};
