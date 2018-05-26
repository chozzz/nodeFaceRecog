var path = require('path'),
  config = {
    local: {
      mode: 'local',
      port: 3000,
      facesPath: path.join(_APP_ROOT_, "assets", "faces"),
      targetFacesPath: path.join(_APP_ROOT_, "assets", "targets")
    },
    staging: {
      mode: 'staging',
      port: 4000,
      facesPath: path.join(_APP_ROOT_, "assets", "faces"),
      targetFacesPath: path.join(_APP_ROOT_, "assets", "targets")
    },
    production: {
      mode: 'production',
      port: 5000,
      facesPath: path.join(_APP_ROOT_, "assets", "faces"),
      targetFacesPath: path.join(_APP_ROOT_, "assets", "targets")
    }
  };

module.exports = function(mode) {
  return config[mode || process.argv[2] || 'local'] || config.local;
}