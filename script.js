class ВиджетПогоды extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.fetchWeatherData();
  }

  render() {
    this.shadowRoot.innerHTML = `
<style>
:host {
  display: block;
  --bgc: 	#20B2AA;
  --clrText: #000080;
  --txtSize: 18px;
  --primaryColor: #000080;
  --secondaryColor: #ffc107;
}

#инфо-погоды {
  background-color: var(--bgc);
  color: var(--clrText);
  font-size: var(--txtSize);
  padding: 10px;
  border-radius: 5px;
  font-family: Gill Sans, sans-serif;
  text-align: center;

}

#инфо-погоды h1 {
  color: var(--primaryColor);
  font-size: 30px;
  margin-bottom: 30px;
}

.weather-info-item {
  margin: 10px 0;
}

.weather-info-label {
  font-weight: bold;
}

.weather-info-value {
  color: var(--secondaryColor);
}
     
</style>
<div id="инфо-погоды">
<h1>Погода</h1>
<p id="температура"></p>
<p id="ощущается-как"></p>
<p id="условия"></p>
<p id="восход"></p>
<p id="заход"></p>
<p id="осадки"></p>
<p id="ветер"></p>
<p id="давление"></p>
<p id="влажность"></p>
<p id="видимость"></p>
<p id="облачность"></p>
<p id="снег"></p>
<p id="направление-ветра"></p>
</div>
        `;
  }

  fetchWeatherData() {
    const apiKey = "dd5f3a82b623c4a7d261ad991ba50c73";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=${apiKey}`;

    const realApiUrl = apiUrl
      .replace("{lat}", "55.7522")
      .replace("{lon}", "37.6156");

    fetch(realApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Сетевой ответ не был успешным");
        }
        return response.json();
      })
      .then((data) => {
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const conditions = data.weather[0].description;
        const windSpeed = data.wind.speed;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const visibility = data.visibility;
        const cloudiness = data.clouds.all;
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        const precipitation =
          data.weather[0].main === "Rain" || data.weather[0].main === "Snow"
            ? "Да"
            : "Нет";
        const rainVolume = data.rain ? `${data.rain["1h"]} мм` : "N/A";
        const snowVolume = data.snow ? `${data.snow["1h"]} мм` : "N/A";
        const uvIndex = data.uvi;
        const dewPoint = data.main.dew_point;
        const windDirection = data.wind.deg;

        this.shadowRoot.getElementById(
          "температура"
        ).innerText = `Температура: ${temperature}°F`;
        this.shadowRoot.getElementById(
          "ощущается-как"
        ).innerText = `Ощущается как: ${feelsLike}°F`;
        this.shadowRoot.getElementById(
          "условия"
        ).innerText = `Условия: ${conditions}`;
        this.shadowRoot.getElementById(
          "ветер"
        ).innerText = `Скорость ветра: ${windSpeed} м/с`;
        this.shadowRoot.getElementById(
          "давление"
        ).innerText = `Давление: ${pressure} гПа`;
        this.shadowRoot.getElementById(
          "влажность"
        ).innerText = `Влажность: ${humidity}%`;
        this.shadowRoot.getElementById(
          "видимость"
        ).innerText = `Видимость: ${visibility} метров`;
        this.shadowRoot.getElementById(
          "облачность"
        ).innerText = `Облачность: ${cloudiness}%`;
        this.shadowRoot.getElementById(
          "восход"
        ).innerText = `Восход солнца: ${sunrise}`;
        this.shadowRoot.getElementById(
          "заход"
        ).innerText = `Заход солнца: ${sunset}`;
        this.shadowRoot.getElementById(
          "осадки"
        ).innerText = `Осадки: ${precipitation}`;
        this.shadowRoot.getElementById(
          "дождь"
        ).innerText = `Дождь: ${rainVolume}`;
        this.shadowRoot.getElementById(
          "снег"
        ).innerText = `Снег: ${snowVolume}`;
        this.shadowRoot.getElementById(
          "уф-индекс"
        ).innerText = `УФ-индекс: ${uvIndex}`;
        this.shadowRoot.getElementById(
          "точка-росы"
        ).innerText = `Точка росы: ${dewPoint}°F`;
        this.shadowRoot.getElementById(
          "направление-ветра"
        ).innerText = `Направление ветра: ${windDirection}°`;
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о погоде:", error);
      });
  }
}

customElements.define("weather-widget", ВиджетПогоды);
