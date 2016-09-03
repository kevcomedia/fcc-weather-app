
(function WeatherApp() {
  "use strict";

  // Interface for manipulating the page.
  const view = (function View() {
    const location = $(".details-location");
    const weather = $(".details-weather");
    const temperature = $(".details-temperature");

    return {
      renderLocation(value) { location.text(value); },
      renderWeather(value) { weather.text(value); },
      renderTemperature(value) { temperature.text(value); }
    };
  })();

  if (!navigator.geolocation) {
    // Perhaps a message to notify that the browser doesn't support geolocation.
    return;
  }

  navigator.geolocation.getCurrentPosition(geolocationSuccess);

  function geolocationSuccess(position) {
    fetchWeatherData(position.coords);
    fetchLocationName(position.coords);

    function fetchWeatherData({latitude, longitude}) {
      // Yep, this shouldn't really be here.
      const apiKey = "f44f41703dd8e5badaaba8f3b66b590d";
      const forecastUrl = `https://crossorigin.me/https://api.forecast.io/forecast/${apiKey}/${latitude},${longitude}`;
      $.getJSON(forecastUrl, apiSuccess);

      function apiSuccess(data) {
        const {summary: weather, temperature} = data.currently;
        view.renderWeather(weather);
        view.renderTemperature(temperature);
      }
    }

    function fetchLocationName({latitude, longitude}) {
      // Apparently the URL is fine the way it is.
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`;
      $.getJSON(googleMapsUrl, apiSuccess);

      function apiSuccess(data) {
        // Consult
        // https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding
        // for further information regarding the API.

        // `results` are arranged from more specific to less specific address.
        // We want the most specific address of type "locality"; hence [0].
        let {formatted_address: location}
          = data.results.filter(result => result.types.includes("locality"))[0];

        view.renderLocation(location);
      }
    }
  }
})();
