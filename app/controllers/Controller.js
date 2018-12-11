const fs = require('fs');
const edge = require('edge.js');
const { parse } = require('querystring');
const { ROOTPATH } = require('../helpers');

class Controller {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * Validate request body
   *
   */
  validate(data) {
    console.log('validating...', data);
  }

  /**
   * @description Parse request body
   *
   */
  requestBody() {
    return new Promise(resolve => {
      const FORM_URLENCODED = 'application/x-www-form-urlencoded';
      if (this.req.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        this.req.on('data', chunk => {
          body += chunk.toString();
        });
        this.req.on('end', () => {
          resolve(parse(body));
        });
      }
    });
  }

  /**
   * Renders view
   * @param {*} template
   * @param {*} data
   */
  view(template, data = {}) {
    const templatePath = `${ROOTPATH}/views/${template}.edge`;

    // Check to see if template exists
    fs.access(templatePath, err => {
      if (err)
        return console.error(
          'Template ' + template + '.edge does not exist',
          err
        );

      // Render template
      const html = edge.render(template, { ...data });
      this.res.write(html);
      this.res.end();
    });
  }
}

module.exports = Controller;
