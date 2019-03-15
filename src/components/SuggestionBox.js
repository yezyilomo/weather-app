import React from 'react';


function getSuggestions(data) {
    return data.map(suggestion => <li> {suggestion} </li>)
}


function SuggestionBox(props) {
    return (
        <div id="search-results" class="suggestionbox">
            <ul class="suggestions">
                {getSuggestions(props.datalist)}
            </ul>
        </div>
    );
}

export {SuggestionBox};