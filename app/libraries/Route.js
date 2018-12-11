const { view } = require('../helpers');

class Route {
  constructor() {
    this.gets = [];
    this.posts = [];
  }

  get(route, controllerAction) {
    if (typeof controllerAction === 'function') {
      // Pass the function as it is
      this.gets.push({ route, controllerAction });
    } else if (typeof controllerAction === 'string') {
      controllerAction = controllerAction.trim().split('@');
      const controller = controllerAction[0];
      const action = controllerAction[1];

      this.gets.push({ route, controllerAction: [controller, action] });
    }
  }

  post(route, controllerAction) {
    if (typeof controllerAction === 'function') {
      // Pass the function as it is
      this.posts.push({ route, controllerAction });
    } else if (typeof controllerAction === 'string') {
      controllerAction = controllerAction.trim().split('@');
      const controller = controllerAction[0];
      const action = controllerAction[1];

      this.posts.push({ route, controllerAction: [controller, action] });
    }
  }
}

module.exports = Route;
