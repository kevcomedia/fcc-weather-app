
(function WeatherApp() {
  "use strict";

  // Interface for manipulating the page.
  const view = (function View() {
    const icon = $("#icon-canvas");
    const location = $(".details-location");
    const weather = $(".details-weather");
    const temperature = $(".details-temperature");

    return {
      renderIcon(value) {
        var skycons = new Skycons({color: "black"});
        skycons.add("icon-canvas", value);
        skycons.play();
      },
      renderLocation(value) { location.text(value); },
      renderWeather(value) { weather.text(value); },
      renderTemperature(value) { temperature.html(value); }
    };
  })();

  let temperature = {
    setF(fahrenheit) { this.temperatureF = fahrenheit; },
    getF() { return `${this.temperatureF.toFixed(2)} &deg;F`; },
    getC() { return `${((this.temperatureF - 32) / 1.8).toFixed(2)} &deg;C`; }
  };

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
      $.ajax({
        url: `https://api.forecast.io/forecast/${apiKey}/${latitude},${longitude}`,
        dataType: "jsonp",
        success: apiSuccess
      });

      function apiSuccess(data) {
        temperature.setF(data.currently.temperature);

        view.renderIcon(data.currently.icon);
        view.renderWeather(data.currently.summary);
        view.renderTemperature(temperature.getC());
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
