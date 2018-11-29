mapboxgl.accessToken = 'pk.eyJ1IjoibWluaWthcm1hIiwiYSI6IkRjTUFYdGsifQ.30RhErOKbQvLJ1kOnAl73A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [37.621852,55.753282], // starting position [lng, lat]
    zoom: 11.5 // starting zoom
});

var modes = ["avg","median","karma","sonya","lena","artem","stepan","kristina","andrey_tyu","andrey_ba","taya","anna"],
    currentMode = "median";

currentFillColor = {
    "property": currentMode,
    "type": "interval",
    "stops": [
      [0, "#32d898"],
      [30,"#32aed7"],
      [40,"#3275d7"],
      [50,"#3244d7"],
      [60,"#151875"]
    ]
  };

menu = d3.select("#menu");

modes.forEach(m=> {
  menu.append("div")
    .attr("class", "menu-item")
    .attr("id", m)
    .text(m)
    .on("click", ()=>{
      setMode(m);
    })
});


setMode = (mode) => {
  modes.forEach(m=>{
    d3.select("#"+m).attr("class", m === mode ? "menu-item-selected" : "menu-item")
  });
  currentMode = mode;
  currentFillColor.property = mode;
  map.setPaintProperty("hex", "fill-color", currentFillColor);
}

map.on("load", ()=>{
 map.addSource("hex", { type: "geojson", data: "./data/hex_all.geojson"});
 map.addSource("people", { type: "geojson", data: "./data/people.geojson"});
 map.addLayer({
   id: "hex",
   source: "hex",
   type: "fill",
   paint: {
     "fill-color": currentFillColor,
     "fill-antialias": false,
     "fill-opacity": 0.5
    }
  });
  map.addLayer({
    id: "people_points_stroke",
    source: "people",
    type: "circle",
    paint: {
      "circle-color": "#fff",
      "circle-radius": 5,
      "circle-opacity": 0.9
    }
  });
  map.addLayer({
    id: "people_points",
    source: "people",
    type: "circle",
    paint: {
      "circle-color": "#7a1ad2",
      "circle-radius": 3.5
    }
  });
  map.addLayer({
    id: "people_points_names",
    source: "people",
    type: "symbol",
    paint: {
      "text-color": "#7a1ad2"
    },
    layout: {
        "text-offset": [0.5,0],
        "text-field": "{name}",
        "text-justify": "left",
        "text-anchor": "left",
        "text-size": 11
    }
  });

  // Create a popup, but don't add it to the map yet.
   var popup = new mapboxgl.Popup({
       closeButton: false,
       closeOnClick: false
   });

   map.on('mousemove', 'hex', function(e) {
       // Change the cursor style as a UI indicator.
       if(e.features.length>0) {
         map.getCanvas().style.cursor = 'pointer';

         var coordinates = {lng: e.features[0].properties.lon, lat: e.features[0].properties.lat};
  //       console.log(e.lngLat);
         //e.lngLat;
         //[e.features[0].properties.lat,e.features[0].properties.lat];
         var description = e.features[0].properties[currentMode];

         // Populate the popup and set its coordinates
         // based on the feature found.
         popup.setLngLat(coordinates)
             .setHTML(description)
             .addTo(map);
       } else {
         map.getCanvas().style.cursor = '';
         popup.remove();
       }

   });

   map.on('mouseleave', 'hex', function() {
       map.getCanvas().style.cursor = '';
       popup.remove();
   });


  //set initial mode
  setMode("median");

});
