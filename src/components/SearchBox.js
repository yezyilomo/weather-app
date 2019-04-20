import React, {useState} from 'react';
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
        <Link class="result-link" key={`${place[0]}`} to={{ pathname: `woeid/${place[0]}`, state: { modal: true } }} >
            {place[1]}
        </Link>
    ));
}

function SearchBox(props) {
    let [suggestions, setSuggestions] = useState([]);
    let keyword = ""; 
    
    let updateSuggestions = (key, results) => {
        // Ensure safe update
        if(key == keyword){
            setSuggestions(
                results.map(data => [data.woeid, data.title])
            )
            return true;
        }
        return false;
    }

    let fetchSuggestions = (key) => {
        fetch(`${proxyURL}/router/woeid?url=${apiURL}/location/search/?query=${key}`)
            .then(response => response.json())
            .then(results => Object.values(JSON.parse(JSON.stringify(results)).data))
            .then(results => results.slice(0,8))
            .then(results => updateSuggestions(key, results))
            .then(isUpdated => isUpdated && removeSpinner())
            .then(results => showSuggestions()) // because of removeSuggestions on searchWather
            .catch(error => console.log(error));
    }
    
    let getSuggestions = (event) => {
        let key = event.target.value.trim();
        keyword = key;
        if (key === "") {
            setSuggestions([]);
            removeSpinner();
            return
        }
        showSpinner();
        fetchSuggestions(key);
    }

    let searchWeather = (event) => {
        removeSpinner();
        removeSuggestions();
        event.preventDefault();
        let key = event.target.q.value;
        props.search(key);
    }
    const styles = {
        'height': '1.5rem',
        'width': '1.5rem',
        'border-width': '2px'
    };
    return (
        <div class="text-center">
            <form onSubmit={searchWeather} method="get" action="/search">
                <SuggestionBox datalist={getPlaces(suggestions)} />
                <input autocomplete="off" onBlur={removeSuggestions} onFocus={showSuggestions}
                    list="places" id="search_bar" onChange={getSuggestions} type="text" name="q"
                    placeholder="Search Location..." />
                <div id="load-search" class="spinner-border text-secondary" role="status" style={styles}>
                </div>
                <button id="submit" type="submit">
                    <i id='search_icon' className="fa fa-search" ></i>
                </button>
            </form>
        </div>
    );
}

export {SearchBox};