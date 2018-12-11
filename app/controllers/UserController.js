const User = require('../models/User');
const userInputValidation = require('../validations/user');

class UserController {
  constructor(parent) {
    this.parent = parent;
  }

  async index() {
    try {
      const users = await User.find({})
        .sort('name')
        .exec();

      this.parent.view('user/index', {
        users
      });
    } catch (error) {
      throw new Error('UserController@index error', error);
    }
  }

  create() {
    this.parent.view('user/create');
  }

  async store(req, res) {
    if (req.method === 'POST') {
      const data = await this.parent.requestBody();
      const { errors, isValid, values } = userInputValidation(data);
      if (!isValid) {
        res.writeHead(302, {
          Location: 'http://localhost:8000/user/create'
        });
        this.parent.view('/user/create', {
          errors
        });
        return;
      }
      try {
        const user = await User.create({
          name: values.name,
          email: values.email
        });
        if (!user) {
          errors.creationError = 'User creation unsuccessful';
          return this.parent.view('/user/create', {
            errors
          });
        }
        return this.parent.view('/user/create', {
          success: 'Successfully created the user'
        });
      } catch (error) {
        throw new Error('User creation error', error);
      }
    }
  }
}

module.exports = UserController;
