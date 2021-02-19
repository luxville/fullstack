const _ = require('lodash')
const logger = require('./logger')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs === null || blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return null
  }
  return blogs.reduce((previous, current) => 
    previous.likes > current.likes 
      ? previous
      : current
      , 0
  )
}

const mostBlogs = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return 'no blogs on the list'
  }

  const blogsByAuthor = _.groupBy(blogs, 'author')

  let maximum = Math.max(...Object.keys(blogsByAuthor).map(author => {
    return blogsByAuthor[author].length
  }))

  let mostBlogsAuthor = Object.keys(blogsByAuthor).find(author => 
    blogsByAuthor[author].length === maximum)

  return {
    author: mostBlogsAuthor,
    blogs: maximum
  }
}

const mostLikes = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return 'no blogs on the list'
  }

  const likesByAuthor = _(blogs).groupBy('author').map((l, a) => ({
    author: a, likes: _.sumBy(l, 'likes')
  })).value()

  let maximum = likesByAuthor.reduce((previous, current) =>
    previous.likes > current.likes
      ? previous
      : current
      , 0
  )

  return maximum
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}