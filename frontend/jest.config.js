module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.tsx', '**/?(*.)+(spec|test).tsx'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
      },
  };