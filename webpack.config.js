const { override, addWebpackPlugin } = require('customize-cra');  
const webpack = require('webpack');  

module.exports = override(  
    (config) => {  
        // Ajoutez cette partie pour remplacer les middleware de config  
        if (config.devServer) {  
            config.devServer.setupMiddlewares = (middlewares, devServer) => {  
                // Ajoutez vos middlewares ici si nécessaire  
                console.log('Avant le middleware');  
                return middlewares;  
            };  
        }  
        return config;  
    },  
    // Vous pouvez ajouter d'autres plugins ou configurations ici  
);