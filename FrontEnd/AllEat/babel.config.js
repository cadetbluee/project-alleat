module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', {loose: true}],
    ['@babel/plugin-transform-private-methods', {loose: true}],
    ['@babel/plugin-transform-private-property-in-object', {loose: true}],
    'nativewind/babel',
    ['module:react-native-dotenv', {moduleName: '@env', path: '.env'}],
    'react-native-reanimated/plugin', // Reanimated 플러그인 추가
  ],
};
