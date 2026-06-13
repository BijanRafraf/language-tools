module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: "#d6d3d1",
        paper: "#fafaf9",
        paperMuted: "#f5f5f4",
        ink: {
          DEFAULT: "#4c0519",
          strong: "#3f0314",
          accent: "#be123c",
          muted: "#a8a29e",
          inverse: "#fff1f2",
        },
        action: {
          DEFAULT: "#4c0519",
          hover: "#881337",
          active: "#083344",
          activeHover: "#164e63",
          ring: "#0e7490",
        },
      },
      fontFamily: {
        editorial: ["Georgia", '"Times New Roman"', "Times", "serif"],
        ui: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
        reading: "42rem",
      },
      borderWidth: {
        rail: "4px",
      },
      borderRadius: {
        action: "1rem",
      },
      boxShadow: {
        panel: "0 8px 18px rgba(76, 5, 25, 0.12)",
        subtle: "0 1px 2px rgba(76, 5, 25, 0.08)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "180ms",
      },
    },
  },
};
