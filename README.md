# my-node.js-mvc
PHP framework TraversyMVC inspired node.js framework
# Download the file

Run the following command in terminal:

```bash
  npm install
```

## Start server

To start the server run following command:

```bash
  npm start
```

### Defining route

To define route go to routes.js file and define route like following:

```javascript
// passing params
router.get('/:id', function(id) {
  console.log(`Hello your id is ${id}`);
});

// more than one params
router.get('/:id/:name', (id, name) => {
  console.log(`Hello ${name} your id is ${id}`);
});
```

As a second arg in get method we can pass controller and methods separated by @ sign:

```javascript
router.get('/user', 'UserController@index');
```

Inside app folder -> inside controllers -> UserController.js:

```javascript
class UserController {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Handles view for user index
   * Get all user
   * @type GET
   * @return resource
   */
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
}
```

#### Handling params inside controller method

To do so:

```javascript
// Get a user with id
router.get('/user/:id', 'UserController@show');
```

inside controller method we get req and res as first two args. After them all are route params:

```javascript
class UserController {
  constructor(parent) {
    this.parent = parent;
  }

  async show(req, res, id) {
    try {
      const users = await User.findById(id).exec();

      this.parent.view('user/show', {
        user
      });
    } catch (error) {
      throw new Error('UserController@show error', error);
    }
  }
}
```

To render view we use:

```javascript
this.parent.view('folderName/viewName', { name: 'John Doe' });
```

Views should be created inside views folder and extension would be .edge:

```blade
  @layout('layouts/app')

  @section('content')
    <p>Hello {{name}}</p>
  @endsection
```

**validation**: Inside app folder -> validations folder -> Joi and lodash npm package is used for custom validation.

```javascript
const Joi = require('joi');
const _ = require('lodash');

// User Schema
const UserSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim(),
  email: Joi.string()
    .min(5)
    .max(255)
    .required()
    .email()
    .trim()
});

module.exports = userValidateInput = data => {
  const errors = {};
  let values = {};

  UserSchema.validate(data, (err, value) => {
    if (err) {
      errors[err.details[0].path[0]] = err.details[0].message;
      return;
    }
    values = value;
  });

  return {
    errors,
    values,
    isValid: _.isEmpty(errors)
  };
};
```

Then inside controller this validation method is required in order to validate input:

```javascript
// User model
const User = require('../models/User');
// Validation
const userInputValidation = require('../validations/user');

class UserController {
  constructor(parent) {
    this.parent = parent;
  }

  async store(req, res) {
    if (req.method === 'POST') {
      // To get form data from request body
      const data = await this.parent.requestBody();
      // Extracting the return fro validation method
      const { errors, isValid, values } = userInputValidation(data);
      if (!isValid) {
        this.parent.view('/user/create', {
          errors
        });
        return;
      }
      // If not invalid proceed
    }
  }
}
```

To get form data from request body:

```javascript

const data = await this.parent.requestBody();

```

request body will return a promise with your form's field name and it's value containing object.

> ### Up until now there is only two methods for route. So for put method post is used for now
>
> **imp note** : whenever any change is made inside .edge file then we have to save again inside any .js file. Else it causes some issue
