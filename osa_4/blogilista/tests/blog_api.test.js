const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { test, expect } = require('@jest/globals')


beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifier must be named id', async () => {
  const blogs = await helper.blogsInDb()
  const idList = blogs.map(blog => expect(blog.id).toBeDefined())

  expect(idList).toBeDefined()
})

test('new blog can be added', async () => {
  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/",
    likes: 13
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogTitles = blogsAtEnd.map(blog => blog.title)
  expect(blogTitles).toContain('xkcd')
})

test('blog with undefined likes can be added', async () => {
  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogTitles = blogsAtEnd.map(blog => blog.title)
  expect(blogTitles).toContain('xkcd')
})

test('blog with undefined title can not be added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/",
    likes: 13
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

test('blog with undefined url can not be added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    likes: 13
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})