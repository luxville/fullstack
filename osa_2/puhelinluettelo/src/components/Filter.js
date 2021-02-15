import React from 'react'

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <form>
      <p>filter shown with <input
          value={newFilter}
          onChange={handleFilterChange}
        />
      </p>
    </form>
  )
}

export default Filter