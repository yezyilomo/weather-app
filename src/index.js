import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

let apiUrl='http://127.0.0.1:8000';
//let apiUrl='http://c2303014.ngrok.io';

class Container extends React.Component{
  constructor(props){
    super(props);
    this.state={key: false, long: 0, lat: 0, woeid: [] };
    this.getLocation();
    this.searchWoeid=this.searchWoeid.bind(this);
    this.getLocalWeather=this.getLocalWeather.bind(this);
  }

  componentDidMount(){
    this.timerID=this.getWoeid();
  }

  componentWillMount(){
     delete this.timerID;
  }

  getLocation(){
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(pos=> this.setState({lat: pos.coords.latitude, long: pos.coords.longitude}) );
     }
     else {
       this.setState({lat: 0, long: 0});
    }
  }

  getWoeid(){
    this.setState({woeid: []});
    fetch(`${apiUrl}/router/woeid?url=https://www.metaweather.com/api/location/search/?lattlong=${this.state.lat},${this.state.long}`)
    .then(response => response.json())
    .then(results => this.setState({ woeid: Object.values( JSON.parse( JSON.stringify(results) ).data ).map(val=>val.woeid) }) )
    .catch(error => console.log(error));
  }

  searchWoeid(location){
    this.setState({woeid: []});
    fetch(`${apiUrl}/router/woeid?url=https://www.metaweather.com/api/location/search/?query=${location}`)
    .then(response => response.json())
    .then(results => this.setState({ woeid: Object.values( JSON.parse( JSON.stringify(results) ).data ).map(val=>val.woeid) }) )
    .catch(error => console.log(error));
  }

  getLocalWeather(){
    this.getLocation();
    this.getWoeid();
  }

  weatherList(woeid_lst){
    return woeid_lst.map(woeid=> <li> <Link class="weather-link" style={ {'text-decoration': 'none'} } key={`${woeid}`}  to={{ pathname: `woeid/${woeid}`, state: { modal: true } }} > <Weather woeid={woeid} /> </Link></li> );
  }

  render(props){
    return <div id="container">
             <div id="contents">
               <Search search={this.searchWoeid}/>
               <ToggleButton/>
               <div onClick={this.getLocalWeather} id="location">
                 <i class="fas fa-map-marker-alt"></i>
                 <div>Near by weather</div>
               </div>
               <ul id="weather_list">
                  {this.weatherList(this.state.woeid)}
               </ul>
               <Route exact path="/" component={null} />
               <Route path="/woeid/:woeid" component={WeatherModal} />
               <Route path="/search/:key" component={null} />
              </div>
              <Footer/>
           </div>;
  }
}


class WeatherModal extends React.Component{
  constructor(props){
    super(props);
    this.state={
      weather: {title: "Loading..", weather_state_name: 'Unknown State', humidity: 0, air_pressure: 0, the_temp: 0, weather_state_abbr: 'No'}
    };
  }

  componentDidMount(){
    this.timerID=this.getWeather();
  }

  componentWillUnmount(){
     delete this.timerID;
  }

  getWeather(props){
    let woeid=this.props.match.params.woeid;
    let hit=sessionStorage.getItem(this.props.match.params.woeid);
      fetch(`${apiUrl}/router/weather?url=https://www.metaweather.com/api/location/${woeid}/`)
      .then(response=>response.json())
      .then(results=>{
        let json_results=JSON.stringify(results);
        let cache=sessionStorage.getItem(woeid);
        if(cache !== json_results){
           this.setState({ weather: JSON.parse( json_results ).weather });
           sessionStorage.setItem(woeid, JSON.stringify(results) );
        }
       } )
      .catch( error=> console.log(error) );
  }

  render(props){
    let woeid=this.props.match.params.woeid;
    let hit=sessionStorage.getItem(woeid);
    if(hit){
      hit=JSON.parse(hit).weather;
    }
    else{
      hit=this.state.weather;
    }

    let isModal=false;
    try {
      isModal=this.props.location.state.modal;
    }
    catch (e) {
       isModal=false;
    }
    let back = e => {e.stopPropagation(); this.props.history.goBack();} ;
    const styles = { 'background-image': `url("https://www.metaweather.com/static/img/weather/${hit.weather_state_abbr}.svg")`};
    const weather = <div class="location-weather" style={styles}>
                     <span class="close-icon" onClick={back}><i class="fas fa-times"></i> </span>
                     <div class="location-location"> <span>{hit.title}</span> </div>
                     <div class="location-temperature"> {Math.round(hit.the_temp)} ℃ </div>
                     <div class="location-weather_state_name"> {hit.weather_state_name} </div>
                     <div class="location-humidity">Humidity: &nbsp; &nbsp; {hit.humidity}%</div>
                     <div class="location-air_pressure">Air Pressure: &nbsp; &nbsp; {Math.round(hit.air_pressure)}mb </div>
                     <div class="location-wind_direction">Wind Direction: &nbsp; &nbsp; {hit.wind_speed} {hit.wind_direction_compass} </div>
                     <div class="location-date">Applicable Date: &nbsp; &nbsp; {hit.applicable_date} </div>
                     <div class="location-predictability">Predictability: &nbsp; &nbsp; {hit.predictability}% </div>
                     <div class="location-timezone">Timezone: &nbsp; &nbsp; {hit.timezone} </div>
                     <div class="location-sunrise">Sunrise: &nbsp; &nbsp; {hit.sun_rise} </div>
                     <div class="location-sunset">Sunset: &nbsp; &nbsp; {hit.sun_set} </div>
                    </div>

    return isModal? <div> <div class="modal-parent" onClick={back}></div> {weather}</div> : <div> <div class="modal-parent" onClick={back}></div> {weather}</div> ;
  }
}

class Weather extends React.Component{
  constructor(props){
    super(props);
    this.state={
      weather: {title: "Loading..", weather_state_name: 'Unknown State', humidity: 0, air_pressure: 0, the_temp: 0, weather_state_abbr: 'No'}
    }
  }

  componentDidMount(){
    this.timerID=this.getWeather();
  }

  componentWillUnmount(){
     delete this.timerID;
  }

  getWeather(props){
    let hit=sessionStorage.getItem(this.props.woeid);
      fetch(`${apiUrl}/router/weather?url=https://www.metaweather.com/api/location/${this.props.woeid}/`)
      .then(response=>response.json())
      .then(results=>{
        let json_results=JSON.stringify(results);
        let cache=sessionStorage.getItem(this.props.woeid);
        if(cache !== json_results){
           this.setState({ weather: JSON.parse( json_results ).weather });
           sessionStorage.setItem(this.props.woeid, JSON.stringify(results) );
        }
       } )
      .catch( error=> console.log(error) );
  }

  render(props){
    let hit=sessionStorage.getItem(this.props.woeid);
    if(hit){
      hit=JSON.parse(hit).weather;
    }
    else{
      hit=this.state.weather;
    }
    const styles = { 'background-image': `url("https://www.metaweather.com/static/img/weather/${hit.weather_state_abbr}.svg")`};
    return <div class="weather" style={styles}>
             <div class="location"> <span>{hit.title}</span> </div>
             <div class="temperature"> {Math.round(hit.the_temp)} ℃ </div>
             <div class="weather_state_name"> {hit.weather_state_name} </div>
             <div class="humidity">Humidity: {hit.humidity}%</div>
             <div class="air_pressure">Air Pressure: {Math.round(hit.air_pressure)}mb </div>
           </div>;
  }
}

class Search extends React.Component{
  constructor(props){
    super(props);
    this.state={suggestions: []}
    this.searchWeather=this.searchWeather.bind(this);
    this.searchByClick=this.searchByClick.bind(this);
    this.match=this.match.bind(this);
    this.showSuggestions=this.showSuggestions.bind(this);
    this.removeSuggestions=this.removeSuggestions.bind(this);
  }

  searchWeather(event){
    event.preventDefault();
    let key=event.target.q.value;
    this.props.search(key);
  }

  updateSuggestions(key){
    fetch(`${apiUrl}/router/woeid?url=https://www.metaweather.com/api/location/search/?query=${key}`)
    .then(response => response.json())
    .then(results => this.setState({ suggestions: Object.values( JSON.parse( JSON.stringify(results) ).data ).map(val=>[ val.woeid, val.title] ) }) )
    .catch(error => console.log(error));
  }

  match(e){
    let key=e.target.value;
    this.setState({key: key});
    if(key===""){
      this.setState({suggestions: []});
      return
    }
    this.updateSuggestions(key);
  }

  showSuggestions(){
    document.getElementById("search-results").style.display='inline-block';
  }

  removeSuggestions(){
    let fnc= ()=>{document.getElementById("search-results").style.display='none'};
    setTimeout(fnc, 200);
  }

  searchByClick(){
    let key=document.getElementById("search_form").q.value;
    this.props.search(key);
  }


  places(suggestions){
    return suggestions.map( place => <Link class="result-link"  style={ {'color': 'black', 'text-decoration': 'none'} } key={`${place[0]}`}  to={{ pathname: `woeid/${place[0]}`, state: { modal: true } }} > {place[1]} </Link> );
  }
  render(props){
    return <div id="search">
             <div id="search-container">
              <form id="search_form" onSubmit={this.searchWeather} method="get" action="/search">
                <SuggestionBox id="search-results" datalist={this.places(this.state.suggestions)} />
                <input autocomplete="off" onBlur={this.removeSuggestions} onFocus={this.showSuggestions}
                 list="places" id="search_bar" onChange={this.match} type="text"  name="q"
                 placeholder="Search Location..."/>
                <button id="submit" type="submit"><i id='search_icon' onClick={this.searchByClick} class="fa fa-search" ></i></button>
              </form>
             </div>
           </div>;
  }
}


function ToggleButton(props){
    let states = new Map()
    states.set(false, 'left');
    states.set(true, 'right');

    let theme = new Map()
    theme.set(false, 'unset');
    theme.set(true, 'rgb(0, 0, 0, 0.8)');

    let [buttonState, setButtonState] = useState(false);
    let handleButtonToggle = (event) => {
        setButtonState(!buttonState);
        document.getElementById('container').style.backgroundColor = theme.get(!buttonState);
    }

  return <div class="toggle-button">
            <div class="slider-container" onClick={handleButtonToggle}>
                <div className={`slider ${states.get(buttonState)}`}></div>
            </div>
          </div>

}

class Footer extends React.Component{

  render(props){
    return <div id="footer">
               <div id="version">React Version: {React.version}</div>
           </div>
  }
}
//present when browser is closed and opened
//localStorage.setItem(777, 'hello there');
//localStorage.getItem(777);

//present on current session(dissapear when browser closed)
// sessionStorage.setItem('myData', data);
// sessionStorage.getItem('myData');
function suggestions(data){
   return data.map(suggestion => <li> {suggestion} </li>)
}

function SuggestionBox(props){
  return <div id={props.id} class="suggestionbox">
            <ul class="suggestions">
              {suggestions(props.datalist)}
            </ul>
          </div>
}

function Ren(prop) {
  return <Router>
              <Switch >
              <Route exact path="/" component={Container} />
              <Route exact path="/:woeid" component={WeatherModal} />
              </Switch>
         </Router>;
}

ReactDOM.render( <Router><Container/></Router>, document.getElementById("root"));
