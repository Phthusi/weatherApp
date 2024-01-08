const button = document.querySelector('button');
const search = document.querySelector('.search input');
let isSearching = false;
let city_name;
let weather;
let wind_speed;
let weather_description;
let humidity;
let temperature;
let country;
let image_location;
let server_response;

function handleWeather(temperature,image_location,city_name,weather_description){
    weather_div = document.querySelector('.weather');
    weather_div.innerHTML = ` <br><h1>Weather</h1>
    <img src="${image_location}">
    <h1>Temp: ${temperature} °C</h1>
    <h2>Description: ${weather_description}</h2>
    <h2>City name: ${city_name}</h2>
    `;
}

function handleHumidity(humidity){
    humidity_div = document.querySelector('.humidity');
    humidity_div.innerHTML = `<br><h1>Humidity</h1>
    <br><br><br><br>
    <img src="images/humidity.png" height="90px">
    <br><br><br><br>
    <p style="font-size: 100px;">${humidity}%</p>`;
}


function handleWind(wind_speed){
    wind_speed_div = document.querySelector('.wind');
    wind_speed_div.innerHTML =`<br>
    <h1>Wind speed</h1>
    <br>
    <img src="images/wind.png" height="190px">
    <br><br><br>
    <p style="font-size: 30px;">wind speed:${wind_speed} km/hr</p>`
}


function fetchData(){
    city_name = search.value;
    url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city_name}&appid=e7eabdf45f0299cd46884cf249371561`;
    let weather_conditions = {
        clear:'images/clear.png',clouds:'images/clouds.png',
        drizzle:'images/drizzle.png',mist:'images/mist.png',rain:'images/rain.png',
        snow:'images/snow.png',wind:'images/wind.png'
      };
    fetch(url).
    then((response)=>{
        return response.json();
    }).
    then((json_response)=>{
        server_response = json_response;
        if(json_response.cod!=200){
            return;
        }
        weather = json_response.weather[0].main.toLowerCase();
        wind_speed = json_response.wind.speed;
        weather_description = json_response.weather[0].description
        humidity = json_response.main.humidity;
        temperature = json_response.main.temp;
        country = json_response.sys.country;
        image_location = weather_conditions[weather];
    }).catch((e)=>{
        console.log(e)
    });
}


function loading(){
    document.querySelector(".results").innerHTML = "";
    if(isSearching){
        return
    }
    isSearching = true;
    p_element = document.createElement('p');
    p_element.setAttribute('id','loading');
    document.body.appendChild(p_element);
    let n = 1;
    let secondsElapsed = 0;
    const intervalId = setInterval(() => {
        p_element.innerHTML = n === 0 ? 'LOADING' : 'LOADING' + '.'.repeat(n);
        n = n < 3 ? n + 1 : 0;
        secondsElapsed++;

        // To stop the interval after a certain number of seconds (e.g., 5 seconds)
        if (secondsElapsed === 10) {
            clearInterval(intervalId);
            document.querySelector("#loading").remove()
            if(server_response.cod!=200){ 
                document.querySelector(".results").innerHTML = `<p style="color:navy; font-size:40px;">result: Sorry ${city_name==="\"\" can't be a valid city name"?"":"city called \""+city_name+"\" does not exist."}</p>`;
                wind_speed_div = document.querySelector('.wind');
                wind_speed_div.innerHTML ="<h1>Wind speed</h1>";
                humidity_div = document.querySelector('.humidity');
                humidity_div.innerHTML = "<h1>Humidity</h1>";
                weather_div = document.querySelector('.weather');
                weather_div.innerHTML = "<h1>Weather</h1>";
                isSearching = false;
                return;
            }
            handleWeather(Math.round(temperature),image_location,city_name,weather_description);
            handleHumidity(humidity);
            handleWind(wind_speed);
            isSearching = false;
        }
    }, 1000);
    
    }

button.addEventListener('click',()=>{
    loading();
    fetchData();
});