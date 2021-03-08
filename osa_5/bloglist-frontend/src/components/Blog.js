import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showAll, setShowAll] = useState(false)
  const hideWhenVisible = { display: showAll ? 'none' : '' }
  const showWhenVisible = { display: showAll ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    backgroundColor: 'blue'
  }

  const currentUser = window.localStorage.getItem('loggedUser')
  const currentUserJSON = JSON.parse(currentUser)

  const ViewRemoveButton = () => {
    if (currentUserJSON === null) {
      return null
    }
    if (currentUserJSON.username === blog.user.username) {
      <button onClick={handleRemove} style={buttonStyle}>remove</button>
    }

    return null
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        { blog.title } { blog.author } <button onClick={() => setShowAll(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>{ blog.title } { blog.author } <button onClick={ () => setShowAll(false) }>hide</button></p>
        <p>{ blog.url }</p>
        <p>likes { blog.likes } <button onClick={handleLike} className="likeButton">like</button></p>
        <p>{ blog.user.name }</p>
        <ViewRemoveButton />
      </div>
    </div>
  )
}

export default Blog