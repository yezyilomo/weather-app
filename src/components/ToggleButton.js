import React, { useState, useEffect } from 'react';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function setThemeCookie(theme = false) {
    let intStates = new Map();
    intStates.set(false, 0);
    intStates.set(true, 1);
    theme = intStates.get(theme);
    var d = new Date();
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // in milliseconds
    document.cookie = `theme=${theme};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
}

function getThemeCookie() {
    let theme = getCookie('theme');
    if (theme === null) {
        return null;
    }
    theme = parseInt(theme, 10);
    theme = Boolean(theme);
    return theme;
}

// Toggle Button
function ToggleButton(props) {
    let themeStates = new Map();
    themeStates.set(false, { className: 'left', themeColor: 'unset', buttonColor: 'white' });
    themeStates.set(true, { className: 'right', themeColor: 'rgb(0, 0, 0, 0.8)', buttonColor: '#00687E' });

    let savedTheme = getThemeCookie();
    if (savedTheme === null) {
        setThemeCookie(false);
        savedTheme = false;
    }

    let [theme, setTheme] = useState(savedTheme);
    useEffect(() => {
        let container = document.getElementById('container');
        container.style.backgroundColor = themeStates.get(theme).themeColor;
    }, [theme]);

    let handleButtonToggle = (event) => {
        setThemeCookie(!theme);
        setTheme(!theme);
    }

    return (
        <div class="toggle-button">
            <div class="slider-container" onClick={handleButtonToggle}
                style={{ 'background-color': themeStates.get(theme).buttonColor }}>
                <div className={`slider ${themeStates.get(theme).className}`}></div>
            </div>
        </div>
    );
}


export {ToggleButton};