class AboutController {
  constructor(parent) {
    this.parent = parent;
  }

  index() {
    this.parent.view('about/index');
  }

  create() {
    this.parent.view('about/create');
  }

  store(req, res) {
    if (req.method === 'POST') {
      this.parent.requestBody().then(data => console.log(data));
    }
  }
}

module.exports = AboutController;
