import React from 'react'

const Notification = ({ message, errorStyle }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={errorStyle}>
      {message}
    </div>)
}

export default Notification