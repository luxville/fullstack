const mongoose = require('mongoose')
const logger = require('./utils/logger')

if (process.argv.length < 3) {
  logger.info('give password as argument')
  process.exit(1)
}

const userAndPassword = process.argv[2]

const url = `mongodb+srv://${userAndPassword}@cluster0-ziluf.mongodb.net/bloglist?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length === 3) {
  Blog
    .find({})
    .then(blogs => {
      blogs.forEach(b => {
        logger.info(b)
      })
    })
  mongoose.connection.close()
}

if (process.argv.length === 7) {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6]
  })
  blog.save()
    .then(() => {
      logger.info('blog saved')
      mongoose.connection.close()
    })
}