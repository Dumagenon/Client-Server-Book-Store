const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config')
const router = Router();

async function createToken(id, password, login) {
  const token = await jwt.sign(
    { userId: id, password, login },
    config.get('jwtSecret'),
    { expiresIn: "1h" }
  );
  return token;
}

router.post(
  '/register',
  [
    check('login', "Login is incorrect!").isLength({ min: 3 }),
    check('email', "Email is incorrect!").isEmail(),
    check('password', "Password must have 8 chars").isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Incorrect data of registration!"
      })
    }
    
    try {
      
      const { email, password, login } = req.body;
      
      const isUniqLogin = await User.findOne({ login });
      const isUniqEmail = await User.findOne({ email });

      if (isUniqLogin) {
        return res.status(400).json({ message: "This Login is already taken!" });
      }
      if (isUniqEmail) {
        return res.status(400).json({ message: "This Email is already taken!" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, login });

      await user.save();

      const token = await createToken(user.id, password, login);
      
      res.status(201).json({
        token,
        userId: user.id,
        userName: login,
        message: "User created successfully!"
      });
    } catch (e) {
      return res.status(500).json({ message: e.message});
    }
  }
);
router.post(
  '/login',
  [
    check('logData', "You're enter incorrect data!").isLength({ min: 3 }),
    check('password', "Password must have 8 chars").isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Incorrect data of login!"
      })
    }

    try {
      const { logData, password } = req.body;
      const isEmail = validator.isEmail(logData);
      const user = await User.findOne(isEmail ? {email: logData} : {login: logData});

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Your password incorrect!" });
      }

      const token = await createToken(user.id, password, user.login);

      res.json({ token, userId: user.id, userName: user.login });
    } catch (e) {
      return res.status(500).json({ message: e.message});
    }
  }
);

module.exports = router;