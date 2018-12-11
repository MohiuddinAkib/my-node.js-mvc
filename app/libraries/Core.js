const CoreUrl = require('url');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { APPPATH } = require('../helpers');

class Core {
  /**
   * Gets url and call corresponding controller & method
   */
  constructor(req, res, router) {
    this.req = req;
    this.res = res;
    this.currentController = '';
    this.currentMethod = '';
    this.params = [];
    // Get request method
    const requestMethod = this.req.method.toLowerCase() + 's';
    // init router
    this.router = router;
    const routes = this.router[requestMethod];
    let url = this.getUrl();
    if (url !== null) {
      url = this.matchRoute(url, routes);
    }
    // Path to controllers
    const controllerPath = path.join(APPPATH, `controllers/${url[0]}.js`);
    // Look in controllers for first value of url aka controller
    fs.access(controllerPath, err => {
      if (err) {
        console.error(`Controller ${url[0]} does not exist`);
        return;
      }

      // Require the controller
      const $parentController = require(path.join(
        APPPATH,
        `controllers/Controller.js`
      ));
      // Child controller/specific controller for  specific route
      const $controllerClass = require(controllerPath);
      this.currentController = new $controllerClass(
        new $parentController(this.req, this.res)
      );

      // Check for the second part of the url
      if (!_.isEmpty(url[1])) {
        // Check to see if the method exists in controller
        if (typeof this.currentController[url[1]] === 'function') {
          this.currentMethod = url[1];
        } else {
          console.error(
            `Method ${url[1]} does not exist inside ${
              this.currentController.constructor.name
            }`
          );
          return;
        }
      }

      // Call a callback with array of params
      this.currentController[this.currentMethod](
        this.req,
        this.res,
        ...this.params
      );
    });
  }

  /**
   * Sanitize requested url and split urls into an array
   *
   * this.getUrl()
   *
   * @return array url
   */
  getUrl() {
    let url = this.req.url.trim();
    if (url !== '/') {
      // removes the ending '/' if exists
      url = url.replace(/\/$/, '');
      // removes the starting '/' if exists
      url = url.replace(/^\//, '');
      url = CoreUrl.parse(url).pathname;
      url = url.split('/');
    } else {
      url = url.split();
    }
    return url;
  }

  /**
   * Matches requested url with registerd routes
   *
   * url = this.matchRoute(url, routes);
   *
   * @param array url
   * @param array routes
   *
   * @return array url
   */
  matchRoute(url, routes) {
    routes.forEach(({ route, controllerAction }) => {
      let tmp;
      if (route !== '/') {
        tmp = route.replace(/^\//, '');
        tmp = tmp.split('/');
      } else {
        tmp = route.split();
      }

      for (let i = 0; i < url.length; i++) {
        if (url.length === tmp.length) {
          // Checking if route has ":"
          if (tmp[i] !== url[i] && tmp[i].indexOf(':') !== -1) {
            tmp[i] = url[i];
            this.params.push(url[i]);
          }

          if (_.difference(tmp, url).length === 0) {
            if (typeof controllerAction === 'function') {
              controllerAction(...this.params);
              return;
            } else {
              controllerAction.push(...this.params);
            }
            url = controllerAction;
            break;
          }
        }
      }
    });
    return url;
  }
}

module.exports = Core;
