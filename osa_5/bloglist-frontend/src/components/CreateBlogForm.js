import React, { useState } from 'react'

const CreateBlogForm = ({ newBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    newBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setUrl(event.target.value)
  }

  return (
    <form onSubmit={createBlog}>
      <div>
        title:
        <input
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          value={author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlogForm