// eslint-disable-next-line no-undef
module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/dist', '/dist-demo', '/test', '/site'],
  coverageDirectory: 'test/coverage',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
