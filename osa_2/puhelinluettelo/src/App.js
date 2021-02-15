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

    if (!validateForm()) return

    const friend = persons.find(person => person.name === newName)

    if (friend) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number (${friend.number}) with a new one (${newNumber})?`)
      if (confirmUpdate) {
        const modifiedPerson = { ...friend, number: newNumber }
      
      personsService
        .update(friend.id, modifiedPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person => (
            person.id !== updatedPerson.id ? person : modifiedPerson
          )))
          setNewName('')
          setNewNumber('')
          setErrorStyle('update')
          setErrorMessage(`Updated "${newName}" with new number "${newNumber}"`)
          handleErrorMessage()
        })
        .catch(err => {
          setErrorStyle('delete')
          setErrorMessage(err.response.data.error)
          handleErrorMessage()
        })
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personsService
        .create(personObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setErrorStyle('add')
          setErrorMessage(`Added ${newName} with new number ${newNumber}`)
          handleErrorMessage()
        })
        .catch(err => {
          setErrorStyle('delete')
          setErrorMessage(err.response.data.error)
          handleErrorMessage()
        })
    }
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    personsService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        setErrorStyle('delete')
        setErrorMessage(`Information of ${personToDelete.name} has already been removed from server`)
        setPersons(persons.filter(n => n.id !== personToDelete.id))
        handleErrorMessage()
      })
    setErrorStyle('delete')
    setErrorMessage(
      `Deleted ${personToDelete.name}`
    )
    handleErrorMessage()
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

  const validateForm = () => {
    if (newName.trim().length < 1 || newNumber.trim().length < 1) {
      alert('both name and number should be given')
      return false
    }
    return true
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