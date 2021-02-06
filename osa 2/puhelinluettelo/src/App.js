import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personsService from './services/persons'
import './index.css'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ errorStyle, setErrorStyle ] = useState('add')

  const names = persons.map(person => person.name)

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  console.log(persons)

  const addPerson = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber
    }

    if(names.includes(newName)) {
      const person = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number (${person.number}) with a new one (${newNumber})?`)) {
        personsService
        .update(person.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.name !== newName ? person : updatedPerson))
          })
          .catch(error => {
            setErrorStyle('delete')
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setPersons(persons.filter(n => n.id !== person.id))
          })
        setErrorStyle('update')
        setErrorMessage(
          `Updated ${newName} with new number ${newNumber}`
        )
        handleErrorMessage()
        }
    } else {
      personsService
        .create(personObject)
          .then(returnedPersons => {
            setPersons(persons.concat(returnedPersons))
          })
        setErrorStyle('add')
        setErrorMessage(
          `Added ${newName} with number ${newNumber}`
        )
        handleErrorMessage()
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value, newName)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value, newNumber)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value, newFilter)
    setNewFilter(event.target.value.toLowerCase())
  }

  const handleErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    personsService
      .deletePerson(id)
    setErrorStyle('delete')
    setErrorMessage(
      `Deleted ${person.name}`
    )
    handleErrorMessage()
    setPersons(persons.filter(person => person.id !== id))
  }

  const Notification = ({ message, errorStyle }) => {
    if (message === null) {
      return null
    }

    return (
      <div className={errorStyle}>
        {message}
      </div>)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} errorStyle={errorStyle} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson} />
    </div>
  )
}

export default App