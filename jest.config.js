module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest/setup.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
