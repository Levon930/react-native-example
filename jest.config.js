module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  globals: {
    If: 'If',
    Choose: 'Choose',
    Otherwise: 'Otherwise',
    When: 'When',
    For: 'For',
    route: {},
    useSafeArea: () => {},
  },

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'json',
  ],

  // An array of regexp pattern strings,
  // matched against all module paths before considered 'visible' to the module loader
  modulePathIgnorePatterns: [
    'node_modules/react-native/Libraries/react-native/',
    'node_modules/react-native/packager/',
  ],

  // A preset that is used as a base for Jest's configuration
  preset: 'react-native',

  // The paths to modules that run some code
  // to configure or set up the testing environment before each test
  setupFiles: ['./jest/setup.js'],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // An array of regexp pattern strings that are matched against all test paths,
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.js$': require.resolve('react-native/jest/preprocessor.js'),
  },

  // An array of regexp pattern strings that are matched against all source file paths,
  // matched files will skip transformation
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native'
      + '|react-(native|universal|navigation)-(.*)'
      + '|@react-native-community/(.*)'
      + '|@react-navigation/(.*)'
      + '|bs-platform'
      + '|react-native-gesture-handler'
      + '|react-native-localize)',
  ],
};
