// module.exports = {
//     dependencies: {
//       // Disable Hermes for iOS to avoid conflicts in podfile
//       'hermes-engine': {
//         platforms: {
//           ios: null, // Disables autolinking for iOS
//           android: null, // Uncomment this if you don't want Hermes on Android as well
//         },
//       },
//     },
//     project: {
//       ios: {
//         sourceDir: './ios', // Ensure iOS project is properly configured
//       },
//       android: {
//         sourceDir: './android', // Customize Android settings if needed
//       },
//     },
//   };
  
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: {}, // make sure this dependencies are all valid installed packages or empty if you don't need it
};