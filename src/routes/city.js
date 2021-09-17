import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';

let cityRouter = express.Router();

cityRouter.param('city', (req, res, next, id) => {
  req.city = id;
  next();
});

cityRouter.get('/:city', (req, res) => {
  
  const locationURL = encodeURI(req.city); 
  const apiKey = process.env.API_KEY;
  const pageKey = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${locationURL}`
  const getCityCode = async () => {
    const response1 = await fetch(pageKey);
    const apiJsonKey = await response1.json();
    return apiJsonKey[0].Key
  }

  const getCityForecast = async () => {
    const keyLocation = await getCityCode();
    const weather = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${keyLocation}?apikey=${apiKey}&metric=true`
    const response2 = await fetch(weather);
    return await response2.json();
  }

  const getElements = async () => {
    const apiJsonWeather = await getCityForecast();
    const temperature = `${apiJsonWeather[0].Temperature.Value}C`;
    const condition = apiJsonWeather[0].IconPhrase;
    const isDayLight = apiJsonWeather[0].IsDaylight;
    let icon = Number(apiJsonWeather[0].WeatherIcon);
      if (icon <= 10) {
        icon = `0${icon}`
      }
    const iconLink = `https://developer.accuweather.com/sites/default/files/${icon}-s.png`
    res.send(`<h1>City: ${req.city}</h1> <h3>Temperature: ${temperature}</h3> <h3>Condition: ${condition}</h3> <h3>Is it Daylight? ${isDayLight}</h3> <image src="${iconLink}"></image>`);
  }

  getElements();

});

export default cityRouter;