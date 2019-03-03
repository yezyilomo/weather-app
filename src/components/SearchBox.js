import React, { useState, useEffect } from 'react';
import {apiURL, proxyURL, SuggestionBox} from './';
import {Link} from 'react-router-dom';


function removeSpinner() {
    document.getElementById("load-search").style.display = "none";
}

function showSpinner() {
    document.getElementById("load-search").style.display = "inline-block";
}

function showSuggestions() {
    document.getElementById("search-results").style.display = 'inline-block';
}

function removeSuggestions() {
    let fnc = () => {
        document.getElementById("search-results").style.display = 'none';
    };
    setTimeout(fnc, 200);
}


function getPlaces(suggestions) {
    return suggestions.map(place => (
        <Link class="result-link" style={{ 'color': 'black', 'text-decoration': 'none' }}
            key={`${place[0]}`} to={{ pathname: `woeid/${place[0]}`, state: { modal: true } }} >
            {place[1]}
        </Link>
    ));
}

function SearchBox(props) {
    let [suggestions, setSuggestions] = useState([]);

    let updateSuggestions = (key) => {
        fetch(`${proxyURL}/router/woeid?url=${apiURL}/location/search/?query=${key}`)
            .then(response => response.json())
            .then(results => Object.values(JSON.parse(JSON.stringify(results)).data))
            .then(results => setSuggestions(
                results.map(val => [val.woeid, val.title])
            ))
            .then(results => removeSpinner())
            .catch(error => console.log(error));
    }
    
    let getSuggestions = (event) => {
        let key = event.target.value;
        if (key === "") {
            setSuggestions([]);
            removeSpinner();
            return
        }
        showSpinner();
        updateSuggestions(key);
    }

    let searchWeather = (event) => {
        event.preventDefault();
        let key = event.target.q.value;
        props.search(key);
    }

    return (
        <div id="search">
            <div id="search-container">
                <form id="search_form" onSubmit={searchWeather} method="get" action="/search">
                    <SuggestionBox id="search-results" datalist={getPlaces(suggestions)} />
                    <input autocomplete="off" onBlur={removeSuggestions} onFocus={showSuggestions}
                        list="places" id="search_bar" onChange={getSuggestions} type="text" name="q"
                        placeholder="Search Location..." />
                    <i id="load-search" class="fa fa-circle-notch fa-spin" />
                    <button id="submit" type="submit">
                        <i id='search_icon' className="fa fa-search" ></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

export {SearchBox};