module.exports = {
  testEnvironment: 'node',
  // transform: {
  //   '.(ts|tsx)': 'ts-jest',
  // },
  testRegex: '/test/.*\\.(test|spec)\\.(js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverageFrom: ['src/*.{js,ts}', 'src/**/*.{js,ts}'],
  setupFilesAfterEnv: ['<rootDir>/test/boot.js'],
};
