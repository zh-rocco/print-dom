module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true, // http://2ality.com/2015/12/babel6-loose-mode.html
        modules: false, // https://github.com/rollup/rollup-plugin-babel#modules
        useBuiltIns: "usage", // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
      },
    ],
  ],
  plugins: ["@babel/plugin-external-helpers", "@babel/plugin-transform-runtime"],
};
