function createMap(earthquakeSites) {
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightmap
  };

  var overlayMaps = {
    "Earthquake Locations": earthquakeSites
  };

  var map = L.map("map-id", {
    center: [37.0902, -95.7129],
    zoom: 3,
    layers: [lightmap, earthquakeSites]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML = [
      "<table class='legend'>",
      "<tr><th>Color</th><th>Magnitude</th></tr>",
      "<tr> <td class='light'></td> <td class='key'><1.0</td></tr>",
      "<tr> <td class='low'></td> <td class='key'>1.0-2.0</td></tr>",
      "<tr> <td class='mild'></td> <td class='key'>2.0-3.0</td></tr>",
      "<tr> <td class='mod'></td> <td class='key'>3.0-4.0</td></tr>",
      "<tr> <td class='high'></td> <td class='key'>4.0-5.0</td></tr>",
      "<tr> <td class='severe'></td> <td class='key'>>5.0</td></tr>",
      "</table>"
    ].join("");
    return div;
  };

  info.addTo(map)
}

function createMarkers(response) {

  var earthquakes = response.features;

  var quakeMarkers = [];
  var colors = ["red", "darkorange", "orange", "yellow", "yellowgreen", "lightgreen"];

  for (var index = 0; index < earthquakes.length; index++) {
    var earthquake = earthquakes[index];

    var color = "";
    if (earthquake.properties.mag >= 5) {
      color = colors[0];
    }
    else if (earthquake.properties.mag >= 4) {
      color = colors[1];
    }
    else if (earthquake.properties.mag >= 3) {
      color = colors[2];
    }
    else if (earthquake.properties.mag >= 2) {
      color = colors[3];
    }
    else if (earthquake.properties.mag >= 1) {
      color = colors[4];
    }
    else {
      color = colors[5];
    }

    var quakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: (earthquake.properties.mag * 15000),
      color: color
    })
      .bindPopup("<h3>" + earthquake.properties.place + "<h3><h3>Magnitude: " + earthquake.properties.mag + "<h3>");

    quakeMarkers.push(quakeMarker);
  }

  createMap(L.layerGroup(quakeMarkers));
}

//createMap()

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", createMarkers);