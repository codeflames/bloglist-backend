const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blogs = require('../models/blogs')
const initialBlogs = require('./bloglist_api_helper').initialBlogs

mongoose.set('bufferTimeoutMS', 10000)




beforeEach(async () => {
  await Blogs.deleteMany({})
  await Blogs.insertMany(initialBlogs)
})

describe('GETTING BLOGLIST', () => {

  test('API should return a list of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

})

describe('GETTING A SINGLE BLOG', () => {

  test('API should return a blog with id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('POSTING BLOGS', () => {

  test('API should create a new blog', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }
    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(response.body[initialBlogs.length].title).toEqual('Test Blog')
    expect(response.body[initialBlogs.length].author).toEqual('Test Author')
    expect(response.body[initialBlogs.length].url).toEqual('http://testurl.com')
    expect(response.body[initialBlogs.length].likes).toEqual(0)
  })

  test('API should return 0 likes if likes is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
    }
    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body[initialBlogs.length].likes).toEqual(0)
  })

  test('API should return 400 if title or url is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const newBlog2 = {
      author: 'Test Author',
      url: 'http://testurl.com',
    }
    await api.post('/api/blogs').send(newBlog2).expect(400)
  })
})

describe('DELETING BLOGS', () => {
  test('API should return 204 if blog is deleted', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }
    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const id = response.body[initialBlogs.length].id
    await api.delete(`/api/blogs/${id}`).expect(204)
    const response2 = await api.get('/api/blogs')
    expect(response2.body).toHaveLength(initialBlogs.length)
  })
})

describe('UPDATING BLOGS', () => {
  test('API should return 200 if blog is updated', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }
    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
    const id = response.body[initialBlogs.length].id
    const updatedBlog = {
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://updatedurl.com',
      likes: 1
    }
    await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200)
    const response2 = await api.get('/api/blogs')
    expect(response2.body[initialBlogs.length].title).toEqual('Updated Blog')
    expect(response2.body[initialBlogs.length].author).toEqual('Updated Author')
    expect(response2.body[initialBlogs.length].url).toEqual('http://updatedurl.com')
    expect(response2.body[initialBlogs.length].likes).toEqual(1)
  },
  10000
  )
})


afterAll(() => {
  mongoose.connection.close()
})