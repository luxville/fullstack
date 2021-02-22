const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const testUser = {
    username: 'test',
    name: 'Tester',
    password: 'user'
  }
  await api
    .post('/api/users')
    .send(testUser)

  const login = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      name: testUser.name,
      password: testUser.password
    })

  const token = login.body.token

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
  const testUser = {
    username: 'test',
    name: 'Tester',
    password: 'user'
  }

  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/",
    likes: 13
  }

  const login = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = login.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogTitles = blogsAtEnd.map(blog => blog.title)
  expect(blogTitles).toContain('xkcd')
})

test('blog with undefined likes can be added', async () => {
  const testUser = {
    username: 'test',
    name: 'Tester',
    password: 'user'
  }

  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/"
  }

  const login = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = login.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
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

  const testUser = {
    username: 'test',
    name: 'Tester',
    password: 'user'
  }

  const newBlog = {
    author: "Randall Munroe",
    url: "https://what-if.xkcd.com/",
    likes: 13
  }

  const login = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = login.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

test('blog with undefined url can not be added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const testUser = {
    username: 'test',
    name: 'Tester',
    password: 'user'
  }

  const newBlog = {
    title: "xkcd",
    author: "Randall Munroe",
    likes: 13
  }

  const login = await api
    .post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password
    })

  token = login.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const testUser = {
      username: 'test2',
      name: 'Tester',
      password: 'user'
    }
    await api
      .post('/api/users')
      .send(testUser)

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'root1',
      name: 'Superuser',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    //const usernames = usersAtEnd.map(user => user.username)
    //expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test2',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique. Value: `test2`')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password length is under three characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'xx'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username length is under three characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rt',
      name: 'Superuser',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`rt`) is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code if valid token is not used', async () => {
    const newUser = {
      username: 'test2',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const newBlog = {
        title: "xkcd",
        author: "Randall Munroe",
        likes: 13
      }
    
      const login = await api
        .post('/api/login')
        .send({
          username: newUser.username,
          password: newUser.password
        })

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})