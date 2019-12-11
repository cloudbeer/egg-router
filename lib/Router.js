const path = require('path');
const tools = require('./util');

module.exports = (app) => {
  const bindController = (routers, ...opts) => {
    let newOps = opts.map((ele) => tools.transferToUrl(ele));
    const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];
    for (let key in routers) {
      let router = routers[key];

      switch (typeof router) {
        case 'function' :
          let parsedMethod = tools.parseMethodName(key);
          let middlewares = [];

          let path_match = parsedMethod.url;
          if (!path_match.startsWith('/')) {
            path_match = path.join('/', ...newOps, parsedMethod.url);            
            path_match = path_match.replace(/\\/g, "/"); //slash on windows is wrong.
          }
          if (app.config.env !== "prod") {
            app.logger.info(`Route ${parsedMethod.method.toUpperCase()}: ${path_match}`);
          }

          middlewares = parsedMethod.middlewares.map((key) => (app.middlewares[key]));
          const methods = parsedMethod.method.split('|');
          for (const mm of methods) {
            if (METHODS.indexOf(mm.toLowerCase()) >= 0) {
              app[mm](path_match, ...middlewares, router);
            } else {
              app.logger.warn('Cannot map', mm.toUpperCase() + ':', path_match);
            }
          }
          break;

        default :
          bindController(router, ...opts, key);
          break;
      }
    }
  };

  app.beforeStart(function*() {
    bindController(app.controller);
  });
};