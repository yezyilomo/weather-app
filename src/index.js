import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Home} from './components';
import {BrowserRouter as Router} from 'react-router-dom';

//present when browser is closed and opened
//localStorage.setItem(777, 'hello there');
//localStorage.getItem(777);

//present on current session(dissapear when browser closed)
// sessionStorage.setItem('myData', data);
// sessionStorage.getItem('myData');

ReactDOM.render(<Router><Home /></Router>, document.getElementById("root"));
