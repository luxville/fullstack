import React from 'react'

const Part = ({part}) => {
  return (
      <p>{part.name} {part.exercises}</p>
  )
}

const Total = ({exercises}) => {
  console.log(exercises)
  
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const initialValue = 0

  return (
    <div>
      <p>
        <b>
          total of {(exercises.reduce(reducer, initialValue))} exercises
        </b>
      </p>
    </div>
  )
}

const Course = ({course}) => {
  const parts = course.parts
  const exercises = parts.map(exercise => exercise.exercises)

  console.log(parts)

  return (
    <div>
      <h2>{course.name}</h2>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
      <Total exercises={exercises} />
    </div>
  )
}

export default Course