class HomeController {
  constructor(parent) {
    this.parent = parent;
  }

  index() {
    console.log('HomeController index');
    this.parent.view('welcome', { username: 'mohammad akib' });
  }

  about(req, res, id, name) {
    console.log('HomeController about', id, name);
  }
}
module.exports = HomeController;
