const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

loginRouter.post('/', async (request, response) => {
  console.log('got here')
  console.log('request.body', request.body)
  const { username, password } = request.body
  console.log('username', username)
  const user = await User.findOne({ username })
  console.log('user', user)
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }


  const userForToken = {
    username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  response.status(200).send({ token, username, name: user.name, id: user._id })
})

module.exports = loginRouter