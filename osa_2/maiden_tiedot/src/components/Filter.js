import React from 'react'

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <form>
      <p>filter countries <input
        value={newFilter}
        onChange={handleFilterChange} />
      </p>
    </form>
  )
}

export default Filter