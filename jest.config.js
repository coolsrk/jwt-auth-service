// eslint-disable-next-line no-undef
  module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    verbose: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    testMatch: ['<rootDir>/test/**/*.spec.ts'],
    coverageReporters: ['lcov', 'html'],
    preset: 'ts-jest',
    clearMocks: true,
  };
