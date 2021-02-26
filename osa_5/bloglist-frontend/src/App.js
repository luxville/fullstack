import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import createBlogForm from './components/createBlogForm'
import loginForm from './components/loginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [errorStryle, setErrorStyle] = useState('error')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    console.log(blogs)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      console.log(window.localStorage)
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
    console.log('logging out')
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const handleErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const blog = await blogService.create({
          title, author, url
        })
      setBlogs(blogs.concat(blog))
      setErrorStyle('add')
      setErrorMessage(`a new blog "${title}" by ${author} added`)
      handleErrorMessage()
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorStyle('error')
      setErrorMessage('something went wrong')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={errorMessage} errorStyle={errorStryle} />
        {loginForm({handleLogin, username, setUsername, password, setPassword})}
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
      <h2>create new</h2>
      {createBlogForm({handleCreateBlog, title, setTitle, author, setAuthor, url, setUrl})}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App