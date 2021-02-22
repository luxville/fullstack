const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined || body.password.length === 0) {
    response.status(400).json({ error: 'password missing' })
  } else if (body.password.length < 3) {
    response.status(400).json({ error: 'password must be at least 3 characters' })
  }

  const blog = await Blog.findById(body.blogId)

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter