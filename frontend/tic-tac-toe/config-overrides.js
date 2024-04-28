module.exports = function override(config, env) {
    // Do stuff with the webpack config...
    config.resolve.fallback = {
      net: false,
      tls: false,
      fs: false,
      crypto: false
    };
    return config;
  };
  