module.exports = {
  config: {
    fontSize: 12,
    fontFamily: "Courier Prime Code, CloudYuanZhunGBK, Noto Color Emoji",
    fontWeightBold: "normal",
    lineHeight: 1.2,
    letterSpacing: -1,
    cursorColor: "rgba(255,255,255,0.8)",
    cursorShape: "BEAM",
    cursorBlink: "true",
    foregroundColor: "#ddd",
    backgroundColor: "#111",
    borderColor: "#222",
    padding: "2px 2px",
    copyOnSelect: false,
    webGLRenderer: false,
    webLinksActivationKey: "ctrl",
    windowSize: [600, 400],
    css: `
      .notifications_view {
        display: none;
      }
    `
  },
  localPlugins: ["newcwd"],
  plugins: ["hyperminimal"],
}
