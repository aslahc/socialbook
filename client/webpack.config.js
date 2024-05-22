module.exports = {
  // ... other webpack configuration
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  // ... other webpack configuration
};
