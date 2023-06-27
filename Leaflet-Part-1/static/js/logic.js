// Create the map tiles.
let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

// Set the map attribute.
let myMap = L.map("map", {
  center: [
    17.09, 105.71
  ],
  zoom: 3,

});

// Add attributes to the map.
map.addTo(myMap);

// set USGS url and retrive data using D3.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function(data) {

  // Create function for the map style to display the magnitude
  function Style(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: Color(feature.properties.mag),
      radius: Radius(feature.properties.mag),
      stroke: true,
      weight: 0.75
    };
  }

  // Set the colour of the marker based on the magnitude figures.
  function Color(mag) {
    switch (true) {
      case mag > 5:
        return "#4F3A7D";
      case mag > 4:
        return "#784680";
      case mag > 3:
        return "#B6547D";
      case mag > 2:
        return "#CF6B7C";
      case mag > 1:
        return "#E2837B";
      default:
        return "#FCC085";
    }
  }

  // Create the marker radius based on the magnitude figures.
  function Radius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 3;
  }
  
// Create the maker of each country based and add to the map.
  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: Style,

    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }
  }).addTo(myMap);

  // Set the legend attribute.
  let legend = L.control({
    position: "bottomright"
  });

  // Add the magnitude information level to the legend.
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    let magnitude = [0, 1, 2, 3, 4, 5];
    let colors = ["#FCC085", "#E2837B", "#CF6B7C", "#B6547D","#784680", "#4F3A7D"];


  // loop through the magnitude level and set the colour in the legend.
    for (i = 0; i<magnitude.length; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
    }
    return div;

  };

  // Add legend to the map.
  legend.addTo(myMap)
  
});