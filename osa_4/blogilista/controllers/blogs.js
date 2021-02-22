const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('../app')
const { userExtractor } = require('../utils/middleware')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const token = request.token
  const user = request.user
  //const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!token) { // || !decodedToken.id
    return response.status(401).json({ error: 'invalid or missing token' })
  }
  //const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes === undefined
      ? 0
      : body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const token = request.token
  const user = request.user
  //const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  //const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'forbidden to delete this blog' })
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.find(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  logger.info('body: ', body.title, body.likes)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
logger.info('blog: ', blog.title, blog.likes)
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter