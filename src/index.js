import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Container extends React.Component{
  constructor(props){
    super(props);
    this.state={key: false, long: 0, lat: 0, woeid: [] };
    this.get_location();
    this.search_woeid=this.search_woeid.bind(this);
    this.get_local_weather=this.get_local_weather.bind(this);
  }

  componentDidMount(){
    this.timerID=this.get_woeid();
  }

  componentWillMount(){
     delete this.timerID;
  }

  get_location(){
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(pos=> this.setState({lat: pos.coords.latitude, long: pos.coords.longitude}) );
     }
     else {
       this.setState({lat: 0, long: 0});
    }
  }

  get_woeid(){
    this.setState({woeid: []});
    fetch(`http://127.0.0.1:8000/router/woeid?url=https://www.metaweather.com/api/location/search/?lattlong=${this.state.lat},${this.state.long}`)
    .then(response => response.json())
    .then(results => this.setState({ woeid: Object.values( JSON.parse( JSON.stringify(results) ).data ).map(val=>val.woeid) }) )
    .catch(error => console.log(error));
  }

  search_woeid(location){
    this.setState({woeid: []});
    fetch(`http://127.0.0.1:8000/router/woeid?url=https://www.metaweather.com/api/location/search/?query=${location}`)
    .then(response => response.json())
    .then(results => this.setState({ woeid: Object.values( JSON.parse( JSON.stringify(results) ).data ).map(val=>val.woeid) }) )
    .catch(error => console.log(error));
  }

  get_local_weather(){
    this.get_location();
    this.get_woeid();
  }

  weather_list(woeid_lst){
    return woeid_lst.map(woeid=> <li> <Weather woeid={woeid} /> </li> );
  }

  render(props){
    return <div id="container">
             <div id="contents">
               <Search search={this.search_woeid}/>
               <div onClick={this.get_local_weather} id="location">
                 <i class="fas fa-map-marker-alt"></i>
                 <div>Near by weather</div>
               </div>
               <ul id="weather_list">
                  {this.weather_list(this.state.woeid)}
               </ul>
              </div>
              <Footer/>
           </div>;
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
    this.timerID=this.get_weather();
  }

  componentWillUnmount(){
     delete this.timerID;
  }

  get_weather(props){
    let hit=sessionStorage.getItem(this.props.woeid);
      fetch(`http://127.0.0.1:8000/router/weather?url=https://www.metaweather.com/api/location/${this.props.woeid}/`)
      .then(response=>response.json())
      .then(results=>{
        let json_results=JSON.stringify(results);
        let cache=sessionStorage.getItem(this.props.woeid);
        if(cache!==json_results){
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
    this.search_weather=this.search_weather.bind(this);
    this.search_by_click=this.search_by_click.bind(this);
  }

  search_weather(event){
    event.preventDefault();
    let key=event.target.q.value;
    this.props.search(key);
  }

  search_by_click(){
    let key=document.getElementById("search_form").q.value;
    this.props.search(key);
  }
  render(props){
    return <div id="search">
              <form id="search_form" onSubmit={this.search_weather}>
                <input id="search_bar" type="text" onChange={this.search_by_click} name="q" placeholder="Search Location..."/>
                <input id="submit" type="submit" value=""/> <i id="search_icon" onClick={this.search_by_click} class="fas fa-search"></i>
              </form>
           </div>;
  }
}

class Footer extends React.Component{
  render(props){
    return <div id="footer"> <div id="version">React Version: {React.version}</div> </div>
  }
}
//present when browser is closed and opened
//localStorage.setItem(777, 'hello there');
//localStorage.getItem(777);

//present on current session(dissapear when browser closed)
// sessionStorage.setItem('myData', data);
// sessionStorage.getItem('myData');
ReactDOM.render(<Container/>, document.getElementById("root"));
