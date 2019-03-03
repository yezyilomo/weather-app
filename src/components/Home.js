import React, { useState, useEffect } from 'react';
import {WeatherTile, apiURL, proxyURL, Block, SearchBox, ToggleButton, WeatherModal, Footer} from './';
import {Route, Link } from 'react-router-dom';


function weatherTiles(woeid_lst) {
    return woeid_lst.map(woeid => (
        <li>
            <Link class="weather-link" style={{ 'text-decoration': 'none' }}
                key={`${woeid}`} to={{ pathname: `woeid/${woeid}`, state: { modal: true } }} >
                <WeatherTile woeid={woeid} />
            </Link>
        </li>
    ));
}

function Home(props) {
    let [location, setLocation] = useState({long: null, lat: null});
    let [woeid, setWoeid] = useState(null); // Fix me. Used in both(No search results, Loading results)

    let getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => setLocation(
                    { lat: pos.coords.latitude, long: pos.coords.longitude }
                )
            );
        }
        else {
            setLocation({ lat: 0, long: 0 });
        }
    }

    let getWoeid = () => {
        setWoeid(null);
        fetch(`${proxyURL}/router/woeid?url=${apiURL}/location/search/?lattlong=${location.lat},${location.long}`)
            .then(response => response.json())
            .then(results => Object.values(JSON.parse(JSON.stringify(results)).data))
            .then(results => setWoeid(
                results.map(val => val.woeid)
            ))
            .catch(error => console.log(error));
    }
    let searchWoeid = (key) => {
        if(key === ""){
            setWoeid([]);
        }
        else{
            setWoeid(null);
        }
        fetch(`${proxyURL}/router/woeid?url=${apiURL}/location/search/?query=${key}`)
            .then(response => response.json())
            .then(results => Object.values(JSON.parse(JSON.stringify(results)).data))
            .then(results => setWoeid(
                results.map(val => val.woeid)
            ))
            .catch(error => console.log(error));
    }

    let getLocalWoeid = () => {
        getLocation();
        getWoeid();
    }
    useEffect(() => {
        getLocalWoeid();
    }, [location.lat, location.long])

    const styles = {
        'margin-top': '100px',
        'color': '#eeeeee',
        'font-family': 'Comfortaa'
    };

    return (
        <div id="container">
            <div id="contents">
                <SearchBox search={searchWoeid} />
                <ToggleButton />
                <div onClick={getLocalWoeid} id="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>Near by weather</div>
                </div>
                <ul id="weather_list">
                    {woeid === null? 
                        <Block><div style={styles}>Loading....</div></Block>: 
                     woeid.length === 0?
                        <Block><div style={styles}>No results found....</div></Block>:
                        <Block>{weatherTiles(woeid)}</Block>   
                    }
                </ul>
                <Route exact path="/" component={null} />
                <Route path="/woeid/:woeid" component={WeatherModal} />
                <Route path="/search/:key" component={null} />
            </div>
            <Footer />
        </div>
    );
}

export {Home};