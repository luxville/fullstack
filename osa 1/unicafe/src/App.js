import React, { useState } from 'react'

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        <p>Yhtään palautetta ei ole vielä annettu</p>
      </div>
    )
  }
  return (
    <table>
      <StatisticsLine text='Hyvä' value={good} addition='' />
      <StatisticsLine text='Neutraali' value={neutral} addition='' />
      <StatisticsLine text='Huono' value={bad} addition='' />
      <StatisticsLine text='Yhteensä' value={total} addition='' />
      <StatisticsLine text='Keskiarvo' value={(good - bad) / (total)} addition='' />
      <StatisticsLine text='Positiiviset' value={(good / (total)) * 100} addition=' %' />
    </table>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <div>
      <button onClick={handleClick}>
        {text}
      </button>
    </div>
  )
}

const StatisticsLine = (props) => {
  const text = props.text
  const value = props.value
  const addition = props.addition

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
      <td>{addition}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>Anna palautetta</h1>
      <Button handleClick={handleGoodClick} text='Hyvä' />
      <Button handleClick={handleNeutralClick} text='Neutraali' />
      <Button handleClick={handleBadClick} text='Huono' />
      <h1>Tilastot</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
