import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [errorStryle, setErrorStyle] = useState('error')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((current, previous) => previous.likes - current.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setErrorStyle('error')
      handleErrorMessage()
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const handleErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLike = async (id) => {
    const blog = blogs.find(blog => blog.id === id)

    try {
      const likedBlog = await blogService.update(blog)
      setBlogs(blogs
        .map(blog => blog.id !== id ? blog : likedBlog)
        .sort((current, previous) => previous.likes - current.likes))
    } catch (exception) {
      setErrorStyle('error')
      setErrorMessage('unable to like this blog')
      handleErrorMessage()
    }
  }

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id)

    if (window.confirm(
      `Remove blog "${blogToRemove.title}" by ${blogToRemove.author}?`
    )) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (exception) {
        setErrorStyle('error')
        setErrorMessage('unauthorized to remove this blog')
        handleErrorMessage()
      }
    }
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={errorMessage} errorStyle={errorStryle} />
        {LoginForm({ handleLogin, username, setUsername, password, setPassword })}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} errorStyle={errorStryle} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <CreateBlogForm newBlog={addBlog} />
      </Togglable>
      {blogs.map((blog, b) =>
        <Blog
          key={b}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleRemove={() => handleRemove(blog.id)}
        />
      )}
    </div>
  )
}

export default App