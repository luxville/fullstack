import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [showAll, setShowAll] = useState(false)
  //const [isOwner, setIsOwner] = useState(user === blog.user.id)

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
    if (currentUserJSON.username !== blog.user.username) {
      return null
    }

    return (
      <button onClick={handleRemove} style={buttonStyle}>remove</button>
    )
  }

  if (!showAll) {
    return (
      <div style={blogStyle}>
        <div>
          { blog.title } { blog.author } <button onClick={() => setShowAll(true)}>view</button>
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        <p>{ blog.title } { blog.author } <button onClick={ () => setShowAll(false) }>hide</button></p>
        <p>{ blog.url }</p>
        <p>likes { blog.likes } <button onClick={handleLike}>like</button></p>
        <p>{ blog.user.name }</p>
        <ViewRemoveButton />
      </div>
    </div>
  )
}

export default Blog