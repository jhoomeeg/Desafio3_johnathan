module.exports = {
  preset: "ts-jest",
  testTimeout: 30000,
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "^@config/(.*)$": "<rootDir>/src/config/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
