import React, { useState, useEffect } from 'react';
import {apiURL, proxyURL, Block} from './';


// Weather Modal
function WeatherModal(props) {
    let [weather, setWeather] = useState({
        title: "Loading..", weather_state_name: 'Unknown State', humidity: 0,
        air_pressure: 0, the_temp: 0, weather_state_abbr: 'No'
    })

    let getWeather = () => {
        let woeid = props.match.params.woeid;
        fetch(`${proxyURL}/router/weather?url=${apiURL}/location/${woeid}/`)
            .then(response => response.json())
            .then(results => {
                let json_results = JSON.stringify(results);
                let cache = sessionStorage.getItem(woeid);
                if (cache !== json_results) {
                    setWeather(JSON.parse(json_results).weather);
                    sessionStorage.setItem(woeid, JSON.stringify(results));
                }
            })
            .catch(error => console.log(error));
    }

    useEffect(() =>{
        let woeid = props.match.params.woeid;
        let hit = sessionStorage.getItem(woeid);
        if (hit) {
            setWeather(JSON.parse(hit).weather);
        }
        else {
            getWeather();
        }
    }, [])

    let isModal = false;
    try {
        isModal = props.location.state.modal;
    }
    catch (e) {
        isModal = false;
    }
    let back = e => { e.stopPropagation(); props.history.goBack(); };
    const styles = {
        'background-image': `url("https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg")`
    };

    return (
        <Block>
            {isModal ?
                <div>
                    <div class="modal-parent" onClick={back}></div>
                    <div class="location-weather" style={styles}>
                        <span class="close-icon" onClick={back}><i class="fas fa-times"></i> </span>
                        <div class="location-location"> <span>{weather.title}</span> </div>
                        <div class="location-temperature"> {Math.round(weather.the_temp)} ℃ </div>
                        <div class="location-weather_state_name"> {weather.weather_state_name} </div>
                        <div class="location-humidity">Humidity: &nbsp; &nbsp; {weather.humidity}%</div>
                        <div class="location-air_pressure">Air Pressure: &nbsp; &nbsp; {Math.round(weather.air_pressure)}mb</div>
                        <div class="location-wind_direction">
                            Wind Direction: &nbsp; &nbsp; {weather.wind_speed} {weather.wind_direction_compass}
                        </div>
                        <div class="location-date">Applicable Date: &nbsp; &nbsp; {weather.applicable_date} </div>
                        <div class="location-predictability">Predictability: &nbsp; &nbsp; {weather.predictability}% </div>
                        <div class="location-timezone">Timezone: &nbsp; &nbsp; {weather.timezone} </div>
                        <div class="location-sunrise">Sunrise: &nbsp; &nbsp; {weather.sun_rise} </div>
                        <div class="location-sunset">Sunset: &nbsp; &nbsp; {weather.sun_set} </div>
                    </div>
                </div> : null
            }
        </Block>
    );
}


export {WeatherModal};