const apiKey = "GetYourApiKey: https://openweathermap.org/api";
const apiCountryUrl = "https://www.countryflagicons.com/FLAT/32/";
const iconUrl = "https://openweathermap.org/img/wn/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descriptionElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const addElement = document.querySelector("#add");
const containerList = document.querySelector("#container-list");
const buttonRemove = document.querySelector("#button-remove");

const weatherContainer = document.querySelector("#weather-data");

//função
const getWeatherData = async(city) => {
    const apiWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    const response = await fetch(apiWeatherApi);
    const data = await response.json();

    return data;
}

const showWeatherData = async (city) =>{
    const data = await getWeatherData(city);

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    weatherIconElement.setAttribute("src", `${iconUrl}${data.weather[0].icon}.png`);
    humidityElement.innerText = data.main.humidity + '%';
    windElement.innerText = parseInt(data.wind.speed) + 'km/h';
    countryElement.setAttribute("src", `${apiCountryUrl}${data.sys.country}.png`);
    descriptionElement.innerText = data.weather[0].description;

    weatherContainer.classList.remove("hide");
}

const addList = (weatherIcon ,city, temperature) =>{
    const element = document.createElement("div");
    element.setAttribute("id" , "weather-list");
    const imgEl = document.createElement("img");
    imgEl.src = weatherIcon;
    element.appendChild(imgEl);

    const hEl = document.createElement("h3");
    const spanHel = document.createElement("span");
    spanHel.setAttribute("id", "city");
    spanHel.innerText = city;
    hEl.appendChild(spanHel);
    element.appendChild(hEl);

    const pEl = document.createElement("p");
    pEl.setAttribute("id", "temperature");
    const spanPel = document.createElement("span");
    spanPel.innerHTML = temperature + "&deg;C";
    pEl.appendChild(spanPel);
    element.appendChild(pEl);

    const buttonRemove = document.createElement("button");
    buttonRemove.setAttribute("id", "button-remove");
    const iRemove = document.createElement("i");
    iRemove.classList.add(...["fa-solid", "fa-xmark"]);
    buttonRemove.appendChild(iRemove);

    buttonRemove.addEventListener("click", () => {
        removeCityInList(city);
    });

    element.appendChild(buttonRemove);

    containerList.appendChild(element);
    containerList.classList.remove("hide");
}

const showCityList = async() => {
    cleanCityList();

    const cityList = getCityList();

    if(cityList.length > 0){
        
        cityList.forEach(async element => {
            const data = await getWeatherData(element);
            const weatherIcon = `${iconUrl}${data.weather[0].icon}.png`;
            addList(weatherIcon, data.name, parseInt(data.main.temp));
        });
    }
}

function getCityList(){
    return JSON.parse(localStorage.getItem("city-list") || "[]");
}

function saveCityList(city){
    localStorage.setItem("city-list", JSON.stringify(city));
}

function addCitiesToken(city){
    const cities = getCityList();
    cities.push(city);
    saveCityList(cities);
}

function cleanCityList(){
    const weatherList = document.querySelector("#weather-list");
    weatherList.replaceChildren([]);
}

function removeCityToken(city){
    const cities = getCityList();
    cities.splice(cities.indexOf(city), 1);
    cleanCityList();
    saveCityList(cities);
}

function removeCityInList(city){
    const weatherList = document.querySelectorAll("#weather-list");
    weatherList.forEach((list) => {
        const cityToRemove = list.innerText.includes(city);
        if(cityToRemove){
            list.remove();
            removeCityToken(city);
        }
    });
}

//eventos
searchBtn.addEventListener("click", (e) =>{
    e.preventDefault();

    const city = cityInput.value;

    showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) =>{

    if(e.code === "Enter"){
        const city = e.target.value;
        showWeatherData(city);
    }
});

addElement.addEventListener("click", (e) => {
    e.preventDefault();

    const weatherIcon = weatherIconElement.src;
    const city = cityElement.innerText;
    const temperature = tempElement.innerText;

    addList(weatherIcon, city, temperature);
    addCitiesToken(city);
});

showCityList();