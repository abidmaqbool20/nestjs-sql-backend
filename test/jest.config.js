module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
