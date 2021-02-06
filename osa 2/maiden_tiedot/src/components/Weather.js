import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Weather = ({country}) => {
  const [location, setLocation] = useState([])
  const [current, setCurrent] = useState([])

  const capital = country.capital

  useEffect(() => {
    console.log('effect', "http://api.weatherstack.com/current?access_key="+api_key+"&query="+capital+"&units=m")
    axios
      .get('http://api.weatherstack.com/current?access_key='+api_key+'&query='+capital+', '+country.name+'&units=m')
      .then(response => {
        setLocation(response.data.location)
        console.log('location loaded', location)
        setCurrent(response.data.current)
      })
      console.log('location', location, 'current', current)
  }, [])

  return (
    <div>
      <h3>Weather in {location.name}, {location.country}</h3>
      <p><b>Temperature:</b> {current.temperature} Celsius</p>
      <img src={current.weather_icons} alt={`Weather at ${location.name}, ${location.country}`}></img>
      <p><b>Wind:</b> {current.wind_speed} kph direction {current.wind_dir}</p>
    </div>
  )
}

export default Weather