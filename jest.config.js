const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/Components/(.*)$': '<rootDir>/src/Components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
