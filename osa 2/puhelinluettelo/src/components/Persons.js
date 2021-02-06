import React from 'react'

const Persons = ({ persons, newFilter, deletePerson }) => {
  //const names = persons.map(name => name.name)
  const filter = persons.filter(person => person.name.toLowerCase().includes(newFilter))
  
  const personsToShow = () => (
    filter.map(person =>
      <div key={person.id}>
        {person.name} {person.number} <Button 
          name={person.name}
          id={person.id}
          deletePerson={deletePerson} 
        />
      </div>
    )
  )

  const Button = ({ name, id, deletePerson }) => {
    return (
      <button onClick={() => confirmDelete({name, id, deletePerson})}>delete</button>
    )
  }

  const confirmDelete = ({ name, id, deletePerson }) => {
    if (window.confirm(`Delete ${name}?`)) {
      deletePerson(id)
    }
  }

  return (
    personsToShow()
  )
}

export default Persons