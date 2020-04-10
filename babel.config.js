let plugins = [];
plugins.push([
  "import",
  {
    libraryName: "vant",
    libraryDirectory: "es",
    style: true
  },
  "vant"
]);
if (process.env.NODE_ENV === "production")
  plugins.push(["transform-remove-console", { exclude: [] }]); // exclude: ["error", "warn"]

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: plugins
};
