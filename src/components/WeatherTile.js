import React, { useState, useEffect } from 'react';
import {apiURL, proxyURL} from './';

// Weather tile
function WeatherTile(props) {
    
    let [weather, setWeather] = useState({
        title: "Loading..", weather_state_name: 'Unknown State',
        humidity: 0, air_pressure: 0, the_temp: 0, weather_state_abbr: 'No'
    })

    let getWeather = () => {
        fetch(`${proxyURL}/router/weather?url=${apiURL}/location/${props.woeid}/`)
            .then(response => response.json())
            .then(results => {
                let json_results = JSON.stringify(results);
                let cache = sessionStorage.getItem(props.woeid);
                if (cache !== json_results) {
                    setWeather(JSON.parse(json_results).weather);
                    sessionStorage.setItem(props.woeid, JSON.stringify(results));
                }
            })
            .catch(error => console.log(error));
    }

    useEffect(() =>{
        let woeid = props.woeid;
        let hit = sessionStorage.getItem(woeid);
        if (hit) {
            setWeather(JSON.parse(hit).weather);
        }
        else {
            getWeather();
        }
    }, [props.woeid])

    const styles = {
        'background-image': `url("https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg")`
    };
    return (
        <div class="weather-tile" style={styles}>
            <div class="location"> <span>{weather.title}</span> </div>
            <div class="temperature"> {Math.round(weather.the_temp)} ℃ </div>
            <div class="weather_state_name"> {weather.weather_state_name} </div>
            <div class="humidity">Humidity: {weather.humidity}%</div>
            <div class="air_pressure">Air Pressure: {Math.round(weather.air_pressure)}mb </div>
        </div>);
}

export {WeatherTile};