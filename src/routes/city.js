import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

let cityRouter = express.Router();

// This param will receive each city that is input by the user
cityRouter.param('city', (req, res, next, id) => {
  req.city = id;
  next();
});


// This get route will handle all the core functions to display the page with parsed JSON data from Accuweather API
cityRouter.get('/:city', (req, res) => {
  
  // Changes city names with spaces to a encodeURI, that way it can be readable by the API
  const locationURL = encodeURI(req.city); 
  // With dotenv package it is possible to get environment variables. This way it is possible to push 
  // the project to github without sending the api key tha is in .env file
  const apiKey = process.env.API_KEY;
  // Link that will return with JSON containing info about the location and the city code necessary
  // to request the current weather of the location
  const pageKey = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${locationURL}`
  
  // This function provides the city code
  const getCityCode = async () => {
    // node-fetch package was used to fetch the JSON file from Accuweather API
    const response1 = await fetch(pageKey);
    const apiJsonKey = await response1.json();
    // Returning the Key value from the array index 0 that contains the city code needed.
    return apiJsonKey[0].Key
  }

  // This function calls getCityCode to save the city code and request the final JSON with all current weather data
  const getCityForecast = async () => {
    const keyLocation = await getCityCode();
    const weather = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${keyLocation}?apikey=${apiKey}&metric=true`
    // As the last function, asynchronous functions are used to wait for the API's response in each function, avoiding 'undefined' return.
    const response2 = await fetch(weather);
    return await response2.json();
  }
  // This function will separate the necessary info from the JSON received from Accuweather and display then in the page
  const getElements = async () => {
    const apiJsonWeather = await getCityForecast();
    // The following four variables will receive the temperature, condition, if it is day time and the icon that
    // will be displayed in the page
    const temperature = `${apiJsonWeather[0].Temperature.Value}C`;
    const condition = apiJsonWeather[0].IconPhrase;
    const isDayLight = apiJsonWeather[0].IsDaylight;
    let icon = Number(apiJsonWeather[0].WeatherIcon);
      // Because the icon name is xx--s.png, it was necessary to handles the ones lower than 10 to avoid 
      // requesting the wrong link
      if (icon <= 10) {
        icon = `0${icon}`
      }
    const iconLink = `https://developer.accuweather.com/sites/default/files/${icon}-s.png`
    // The final response is sent with all info required in this challenge.
    res.send(`<h1>City: ${req.city}</h1> <h3>Temperature: ${temperature}</h3> <h3>Condition: ${condition}</h3> <h3>Is it Daylight? ${isDayLight}</h3> <image src="${iconLink}"></image>`);
  }

  getElements();

});

export default cityRouter;