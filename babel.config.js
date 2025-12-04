module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@src": "./src",
            "@api": "./src/api",
            "@components": "./src/components",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@types": "./src/types",
          },
        },
      ],
    ],
  };
};
