const b1 = {
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0
}
const b2 = {
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}
const b3 = {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0
}
const b4 = {
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0
}
const b5 = {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0
}
const b6 = {
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0
}
const noList = null
const emptyList = []
const listWithOneBlog = [b4]
const listWithManyBlogs =[b1, b2, b3, b4, b5, b6]

describe('most likes', () => {
  const mostLikes = require('../utils/list_helper').mostLikes

  test('empty list returns no blogs', () => {
    const result = mostLikes(emptyList)
    expect(result).toEqual('no blogs on the list')
  })

  test('when list has only one blog returns likes of that', () => {
    const result = mostLikes(listWithOneBlog)
    expect(result).toEqual({ author: "Robert C. Martin", likes: 10 })
  })

  test('when list has many blogs returns the most liked author', () => {
    const result = mostLikes(listWithManyBlogs)
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
  })
})

describe('most blogs', () => {
  const mostBlogs = require('../utils/list_helper').mostBlogs

  test('empty list returns no blogs', () => {
    const result = mostBlogs(emptyList)
    expect(result).toEqual('no blogs on the list')
  })

  test('when list has only one blog returns that', () => {
    const result = mostBlogs(listWithOneBlog)
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 1 })
  })

  test('when list has many blogs returns the author of most of them', () => {
    const result = mostBlogs(listWithManyBlogs)
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 })
  })
})

describe('favorite blog', () => {
  const favoriteBlog = require('../utils/list_helper').favoriteBlog

  test('empty list returns null', () => {
    const result = favoriteBlog(emptyList)
    expect(result).toEqual(null)
  })

  test('when list has only one blog returns that', () => {
    const result = favoriteBlog(listWithOneBlog)
    expect(result).toEqual(b4)
  })

  test('when list has many blogs returns the most favorited of them', () => {
    const result = favoriteBlog(listWithManyBlogs)
    expect(result).toEqual(b3)
  })
})

describe('total likes', () => {
  const totalLikes = require('../utils/list_helper').totalLikes

  test('empty list returns zero', () => {
    const result = totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('no list returns zero', () => {
    const result = totalLikes(noList)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(10)
  })

  test('when list has many blogs equals the likes of all', () => {
    const result = totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('dummy test', () => {
  const dummy = require('../utils/list_helper').dummy
  const listHelper = require('../utils/list_helper')

  test('dummy returns 1', () => {
    const blogs = null

    const result = dummy(blogs)
    expect(result).toBe(1)
  })

  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})