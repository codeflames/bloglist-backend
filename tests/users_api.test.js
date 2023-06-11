const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Users = require('../models/users')
const api = supertest(app)
const userHelper = require('./users_api_helper')

mongoose.set('bufferTimeoutMS', 10000)


beforeEach(async () => {
  await Users.deleteMany({})
  const passwordHash = await userHelper.hashPassword(userHelper.initialUsers[0].password)
  const user = new Users({
    username: userHelper.initialUsers[0].username,
    name: userHelper.initialUsers[0].name,
    passwordHash
  })
  await user.save()
})

describe('GETTING USERS', () => {

  test('API should return a list of users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(userHelper.initialUsers.length)
  })

})

describe('POSTING USERS', () => {

  test('API should create a new user', async () => {
    const usersAtStart = await userHelper.usersInDb()
    console.log(userHelper.testUser)
    const user = userHelper.testUser
    await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)
    const usersAtEnd = await userHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usersAtEnd[usersAtStart.length].username).toEqual(user.username)
    expect(usersAtEnd[usersAtStart.length].name).toEqual(user.name)
  })

})

afterAll(() => {
  mongoose.connection.close()
})