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
function checkbox_eiffel(){

    var checkBox = document.getElementById(("check_eiffel"));

    if(checkBox.checked == true){
        show_eiffel = true;
        mySlider.destroy();
        mySlider.init();
    }
    else{
        show_eiffel = false;
        mySlider.destroy();
        mySlider.init();
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function check_animation(){
    document.getElementById("check_animation").disabled = true;
    const values = mySlider.getValue();
    const myArray = values.split(",");
    // Realiza Animacao
    for (let i = 9000; i >= parseInt(myArray[0]);) {
        mySlider.setValues(parseInt(myArray[0]), i);
        await sleep(1000);
        if (i > 4000){
            i = i - 500;
        }
        else if( i > 2000){
            i = i - 250;
        }
        else if( i > 1000){
            i = i - 100;
        }
        else{
            i = i - 50;
        }
    }

    mySlider.setValues(parseInt(myArray[0]), parseInt(myArray[1]));
    document.getElementById("check_animation").disabled = false;

}


var paris = "https://student.dei.uc.pt/~gabriel/JSON/Paris.geojson"
var airbnbs_file = "https://student.dei.uc.pt/~gabriel/Website/JSON/airbnbs.geojson"
var poi_file = "https://student.dei.uc.pt/~gabriel/JSON/poi.geojson"
var show_eiffel = false;

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhbWVuIiwiYSI6IlpkZEtuS1EifQ.jiH_c9ShtBwtqH9RdG40mw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [2.3449, 48.8593],
    minZoom: 2,
    maxZoom: 20,
    zoom: 11.02
});

map.on('load', function () {
    d3.json(airbnbs_file, function(err, paris) {
        console.log(paris);
        map.addSource('paris', {
            'type': 'geojson',
            'data': paris
        });

        // heatmap
        map.addLayer({
                'id': 'heatmap_layer',
                'type': 'heatmap',
                'source': 'paris',
                'maxzoom': 20,
                'filter':["all",["<", "Preco", 8000]],
                'paint': {
                    // increase weight as diameter breast height increases
                    "heatmap-weight": ["interpolate",
                        ["linear"],
                        ["get", "Preco"],
                        0, 0,
                        8000, 1
                    ],
                    'heatmap-radius': 10,
                    // increase intensity as zoom level increases
                    'heatmap-intensity': {
                        'stops': [
                            [10, 1],
                            [15, 3]
                        ]
                    },
                    // use sequential color palette to use exponentially as the weight increases
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        '#d7e1ee',
                        0.4,
                        '#949698',
                        0.6,
                        '#727171',
                        0.8,
                        '#c86558',
                        1,
                        '#991f17',
                    ],
                }
            },
            'waterway-label'
        );

        // pontos por tipo de quarto
        map.addLayer({
            'id': 'airbnbs_by_T_room',
            'type': "circle",
            'source': 'paris',
            'layout': {},
            'paint': {
                // Make circles larger as the user zooms from z12 to z22.
                'circle-radius': 0,
                // Color circles by ethnicity, using a `match` expression.
                'circle-color': [
                    'match',
                    ['get', 'Preco'],
                    "Entire home/apt",
                    '#d7e1ee',
                    'Hotel room',
                    '#727171',
                    'Private room',
                    '#c86558',
                    'Shared room',
                    '#991f17',
                    /* other */ '#ccc'
                ]
            }
        });

        // pontos por tipo de quarto
        map.addLayer({
            'id': 'airbnbs_by_N_room',
            'type': "circle",
            'source': 'paris',
            'layout': {},
            'paint': {
                // Make circles larger as the user zooms from z12 to z22.
                'circle-radius': 0,
                // Color circles by ethnicity, using a `match` expression.
                'circle-color': [
                    'match',
                    ['get', 'N_bedrooms'],
                    0.0,
                    '#d7e1ee',
                    1.0,
                    "#949698",
                    2.0,
                    '#727171',
                    3.0,
                    '#c86558',
                    4.0,
                    '#991f17',
                    /* other */ '#3d0101'
                ]
            }
        });

    });

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

var mySlider = new rSlider({
    target: '#sampleSlider',
    values: {min: 0, max:9000},
    step: 10,
    range: true,
    tooltip: true,
    scale: true,
    labels: false,
    set: [50, 8000],
    onChange: function (vals) {
        const myArray = vals.split(",");
        if( show_eiffel == true ){
            map.setFilter("heatmap_layer", ["all",["<", "Preco", parseInt(myArray[1])],
                                                  ["==","Vista_Eiffel_Tower", 1]]);
        }
        else{
            map.setFilter("heatmap_layer", ["all",["<", "Preco", parseInt(myArray[1])]]);
        }


        map.setPaintProperty("heatmap_layer", "heatmap-weight",
            [   "interpolate",
                ["linear"],
                ["get", "Preco"],
                parseInt(myArray[0]), 0,
                parseInt(myArray[1]), 1
            ]);



        document.getElementById("l1").innerHTML = "<span   style='background-color: #2166AC00; opacity: 1'></span>";
        document.getElementById("l2").innerHTML = "<span   style='background-color: #d7e1ee; opacity: 1'></span>";
        document.getElementById("l3").innerHTML = "<span   style='background-color: #949698; opacity: 1'></span>";
        document.getElementById("l4").innerHTML = "<span   style='background-color: #727171; opacity: 1'></span>";
        document.getElementById("l5").innerHTML = "<span   style='background-color: #c86558; opacity: 1'></span>";
        document.getElementById("l6").innerHTML = "<span   style='background-color: #991f17; opacity: 1'></span>";

        let num_1 = (parseInt(myArray[1]) - parseInt(myArray[0]) ) * 0.2 + parseInt(myArray[0]);
        let num_2 = (parseInt(myArray[1]) - parseInt(myArray[0]) ) * 0.4 + parseInt(myArray[0]);
        let num_3 = (parseInt(myArray[1]) - parseInt(myArray[0]) ) * 0.6 + parseInt(myArray[0]);
        let num_4 = (parseInt(myArray[1]) - parseInt(myArray[0]) ) * 0.8 + parseInt(myArray[0]);


        document.getElementById("l1").innerHTML += myArray[0].toString(10) + " €";
        document.getElementById("l2").innerHTML += ( num_1 ).toString(10) + " €";
        document.getElementById("l3").innerHTML += ( num_2 ).toString(10) + " €";
        document.getElementById("l4").innerHTML += ( num_3 ).toString(10) + " €";
        document.getElementById("l5").innerHTML += ( num_4 ).toString(10) + " €";
        document.getElementById("l6").innerHTML += myArray[1].toString(10) + " €";

    }
});


