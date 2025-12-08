// LINK_MAP.js — JS module so we avoid JSON import quirks in Vite/Babel.
// Shape supports either { title, items: [...] } or { title, sections: [...] }.

export default {
  triangle: {
    title: "TOOLS",
    items: [
      { label: "mindmapper", href: "https://mindmapper.kichong.xyz/" },
      { label: "TXT", href: "https://txt.ethpapers.xyz/" }
    ]
  },

  square: {
    title: "WORDS",
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
        subtitle: "Substack",
        items: [
          { label: "moneygame.la", href: "https://moneygamela.substack.com/" },
          { label: "Yang Gang Wisdom", href: "https://yanggangwisdom.substack.com/" },
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
          { label: "DeFi Section", href: "https://www.gemini.com/cryptopedia/explore#de-fi" }
        ]
      },
      {
        subtitle: "Blokt",
        items: [
          { label: "Author Page", href: "https://blokt.com/author/ki-chong-tran/" }
        ]
      },

  circle: {
    title: "ART",
    items: [
      { label: "Ethereum Papers", href: "https://www.ethpapers.xyz" },
      { label: "KCT", href: "https://kichongtran.substack.com/" }
    ]
  },

  cross: {
    title: "CONNECT",
    items: [
      { label: "Email", href: "mailto:kichong@ethpapers.xyz" },
      { label: "GitHub", href: "https://github.com/kichong" },
      { label: "Upwork", href: "https://www.upwork.com/freelancers/~01bc0910579b37b62f" },
    ]
  }
};
