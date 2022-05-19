function checkbox_airbnbs(){

    var checkBox = document.getElementById(("check_airbnb"));

    if(checkBox.checked == true){
        map.setPaintProperty("airbnbs", "circle-opacity", 1);
    }
    else {
        map.setPaintProperty("airbnbs", "circle-opacity", 0);
    }
}

function checkbox_poi(){

    var checkBox = document.getElementById(("check_poi"));

    if(checkBox.checked == true){

        map.setPaintProperty("Pois", "circle-opacity", 1);
        map.setLayoutProperty("Lable_Poi", "text-size", 10);

    }
    else{

        map.setPaintProperty("Pois", "circle-opacity", 0);
        map.setLayoutProperty("Lable_Poi", "text-size", 0);


    }
}

var airbnbs_source = 0;
var poi_source = 0;

var paris = "http://localhost:63342/Projecto/Website/JSON/Paris.geojson"
var airbnbs_file = "http://localhost:63342/Projecto/Website/JSON/airbnbs.geojson"
var poi_file = "http://localhost:63342/Projecto/Website/JSON/poi.geojson"

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhbWVuIiwiYSI6IlpkZEtuS1EifQ.jiH_c9ShtBwtqH9RdG40mw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [2.3449, 48.8593],
    minZoom: 2,
    maxZoom: 12,
    zoom: 11.02
});

map.on('load', function () {
    var url = paris
    d3.json(url, function(err, paris) {
        console.log(paris);
        map.addSource('paris', {
            'type': 'geojson',
            'data': paris
        });

        map.addLayer({
            'id': 'paris',
            'type': 'fill',
            'source': 'paris',
            'layout': {},
            'paint': {
                'fill-color': '#8a8b8c',
                'fill-opacity': 0.5
            }
        });

        map.addLayer({
            'id': 'paris-borders',
            'type': 'line',
            'source': 'paris',
            'layout': {},
            'paint': {
                'line-color': '#706f6f',
                'line-width': 2
            }
        });
    })

    d3.json(airbnbs_file, function(err, airbnbs) {

        map.addSource('airbnbs' , {
            'type': 'geojson',
            'data': airbnbs
        });

        map.addLayer({
            'id': 'airbnbs',
            'type': "circle",
            'source': 'airbnbs',
            'layout': {},
            'paint': {
                "circle-radius": 1,
                "circle-color": "red",
                "circle-opacity": 0,
            }
        });

    })

    d3.json(poi_file, function(err, pois) {

        map.addSource('Pois' , {
            'type': 'geojson',
            'data': pois
        });

        map.addLayer({
            'id': 'Pois',
            'type': "circle",
            'source': 'Pois',
            'layout': {},
            'paint': {
                "circle-radius": 3,
                "circle-color": "yellow",
                "circle-opacity": 0,
            }
        });

        map.addLayer({
            "id": "Lable_Poi",
            "type": "symbol",
            "source": "Pois",
            "layout": {
                //"symbol-placement": "line-center",
                "text-font": ["Open Sans Regular"],
                "text-field": '{Nome}',
                "text-size": 0,
                "text-rotate": 0,
                "symbol-spacing": 1,
            },
            "paint":{
                "text-color": "black",
            }
        });

        map.on('mouseenter', "Lable_Poi", () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', "Lable_Poi", () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('click', "Lable_Poi", (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.Nome;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

    })


});


