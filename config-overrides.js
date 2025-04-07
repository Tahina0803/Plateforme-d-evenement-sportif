// config-overrides.js  
module.exports = function override(config, env) {  
    if (config.devServer) {  
      // Remplacez les options obsolètes par 'setupMiddlewares'  
      config.devServer.setupMiddlewares = (middlewares, devServer) => {  
        console.log('Middleware configuré');  
        return middlewares;  
      };  
    }  
    return config;  
  };