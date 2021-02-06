import React from 'react'
import Country from './Country'

const Countries = ({ countries, newFilter, setNewFilter }) => {
  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(newFilter))
  const setCountry = (filter) => setNewFilter(filter)
  
  const countriesToShow = (filteredCountries) => {
    if (filteredCountries.length > 10 || filteredCountries.length === 0) {
      return (`Found ${filteredCountries.length} matches, specify another filter`)
    }
    if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
      return (
        filteredCountries.map(country =>
          <div key={country.name}>
            {country.name} <button
              onClick={() =>
                setCountry(country.name.toLowerCase())}>
                show
            </button>
          </div>
          )
      )
    }

    const country = filteredCountries[0]
    return (
      <Country country={country} />
    )
  }

  return countriesToShow(filteredCountries)
}

export default Countries