module.exports = {
  setupFilesAfterEnv: [
    "./setupTests.js"
  ],
  verbose: true,
  testEnvironment: 'jsdom',
  coverageReporters: ['json', 'text', 'lcov', 'clover']
};
