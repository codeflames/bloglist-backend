const Users = require('../models/users')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  },
]

const usersInDb = async () => {
  const users = await Users.find({})
  return users.map(user => user.toJSON())
}

const hashPassword = async (password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}


const testUser = {
  username: 'testuser01',
  name: 'Test User',
  password: 'testpassword'
}

const testUserForUsernameError = {
  username: 'te',
  name: 'Test User2',
  password: 'testpassword2'
}

const testUserForPasswordError = {
  username: 'testuser2',
  name: 'Test User2',
  password: 'te'
}

module.exports = {
  initialUsers,
  usersInDb,
  hashPassword,
  testUser,
  testUserForUsernameError,
  testUserForPasswordError
}
