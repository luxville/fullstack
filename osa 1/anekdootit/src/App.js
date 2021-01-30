import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState({
    anecdote: 0,
    votes: [0, 0, 0, 0, 0, 0],
    mostVotes: 0,
    mostVotesIndex: 5
  })

  const handleNextClick = () => {
    const random = Math.random() * 6
    const selected = Math.floor(random)
    setSelected(current => ({
      ...current,
      anecdote: selected
    }))
  }

  const handleVoteClick = () => {
    let points = selected.votes
    points[selected.anecdote] += 1
    if (points[selected.anecdote] > selected.mostVotes) {
      selected.mostVotes = points[selected.anecdote]
      selected.mostVotesIndex = selected.anecdote
    }
    setSelected(current => ({
      ...current,
      votes: { ...current.votes, ...points }
    }))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected.anecdote]}</p>
      <p>has {selected.votes[selected.anecdote]} votes</p>
      <button onClick={handleVoteClick}>
        vote
      </button>
      <button onClick={handleNextClick}>
        next anecdote
      </button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[selected.mostVotesIndex]}</p>
      <p>has {selected.mostVotes} votes</p>
    </div>
  )
}

export default App