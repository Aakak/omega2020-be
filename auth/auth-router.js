const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js')
console.log(Users, 'users-model')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res) => {
    let user = req.body;
    console.log(user, '🤢');
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        console.log(saved, 'this is saved')
        res.status(201).json(saved);

      })
      .catch(error => {
        console.log(error)
        res.status(500).json(error);
      });
      
  });
  
  router.post('/login', (req, res) => {
    let { email, password } = req.body;
  
    Users.findBy({ email })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = getJwtToken(user.email);
          res.status(200).json({
            message: `Welcome ${user.email}!`,
            token
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

function getJwtToken(email) {
    const payload = {
      email
    }
    const secret = process.env.JWT_SECRET || 'KEEP IT SECRET KEEP IT SAFE'
    const options = {
      expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
  }
  
  module.exports = router;