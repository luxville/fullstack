import React from 'react'
import Weather from './Weather'

const Country = ({country}) => {

  return (
    <div>
      <h2>{country.name}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language => (
          <li>
            {language.name}
          </li>
        ))}
      </ul>
      <img src={country.flag} alt={`${country.name} flag`} width="100"></img>
      <Weather country={country} />
    </div>
  )
}

export default Country