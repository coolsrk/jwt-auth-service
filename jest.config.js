// eslint-disable-next-line no-undef
  module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    verbose: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    testMatch: ['<rootDir>/test/**/*.spec.ts'],
    coverageReporters: ['lcov', 'html'],
    setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
    preset: 'ts-jest',
    clearMocks: true,
  };
