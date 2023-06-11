const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const Users = require('../models/users')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})



blogRouter.post('/', async (request, response) => {

  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const currentUser = await Users.findById(request.user.id)



  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: currentUser._id
  })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)

  currentUser.blogs = currentUser.blogs.concat(savedBlog._id)
  await currentUser.save()
})

blogRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const user = request.user

  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }else if (!user) {
    return response.status(401).json({ error: 'user missing or invalid' })
  }else if (!user.blogs.includes(request.params.id)) {
    return response.status(401).json({ error: 'Unauthorized action: only creators of blogs can delete their blogs' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = blogRouter