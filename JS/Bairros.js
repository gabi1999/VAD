function Buttton_Preco_Medio(){
    map.setPaintProperty("Paris_Layer", "fill-color",   ["step",
                                                        ["get","preco_medio"],
                                                        "#d7e1ee",70,
                                                        "#949698",95,
                                                        "#727171",120,
                                                        "#c86558",155,
                                                        "#991f17"
                                                        ]
    );
    const Legenda_preco = document.getElementById('Legenda_preco');
    const Legenda_N_quartos = document.getElementById('Legenda_N_Quartos');
    const Legenda_P_quartos = document.getElementById('Legenda_P_Quartos');
    Legenda_preco.style.display = 'block';
    Legenda_N_quartos.style.display = 'none';
    Legenda_P_quartos.style.display = 'none';


}

function Buttton_N_Airbnbs(){
    map.setPaintProperty("Paris_Layer", "fill-color",
                                                        ["step",
                                                        ["get","N_quartos"],
                                                        "#d7e1ee",1600,
                                                        "#949698",2200,
                                                        "#727171",2800,
                                                        "#c86558",3400,
                                                        "#991f17"
                                                        ]
    );
    const Legenda_preco = document.getElementById('Legenda_preco');
    const Legenda_N_quartos = document.getElementById('Legenda_N_Quartos');
    const Legenda_P_quartos = document.getElementById('Legenda_P_Quartos');
    Legenda_preco.style.display = 'none';
    Legenda_N_quartos.style.display = 'block';
    Legenda_P_quartos.style.display = 'none';
}

function Buttton_P_Airbnbs(){
    map.setPaintProperty("Paris_Layer", "fill-color",
                                                        ["step",
                                                        ["get","Per_quartos"],
                                                        "#d7e1ee",3.1,
                                                        "#949698",4.35,
                                                        "#727171",5.6,
                                                        "#c86558",6.85,
                                                        "#991f17"
                                                        ]
    );
    const Legenda_preco = document.getElementById('Legenda_preco');
    const Legenda_N_quartos = document.getElementById('Legenda_N_Quartos');
    const Legenda_P_quartos = document.getElementById('Legenda_P_Quartos');
    Legenda_preco.style.display = 'none';
    Legenda_N_quartos.style.display = 'none';
    Legenda_P_quartos.style.display = 'block';
}

//'pk.eyJ1IjoiZ2FicmllbG5zMTIiLCJhIjoiY2wyZXloaHBkMDJsYTNrcnowM3h6dzAzayJ9.e7-ramxC2-IfnYuz6F-Vrg';
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhbWVuIiwiYSI6IlpkZEtuS1EifQ.jiH_c9ShtBwtqH9RdG40mw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [2.3449, 48.8593],
    minZoom: 2,
    maxZoom: 12,
    zoom: 11.02
});

var paris = "http://localhost:63342/Projecto/Website/JSON/neighbourhoods.geojson"

let hoveredStateId = null;
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('load', function () {

    d3.json(paris, function(err, paris) {
        map.addSource('Paris', {
            'type': 'geojson',
            'data': paris
        });

        // The feature-state dependent fill-opacity expression will render the hover effect
        // when a feature's hover state is set to true.
        map.addLayer({
            'id': 'Paris_Layer',
            'type': 'fill',
            'source': 'Paris',
            'layout': {},
            'paint': {
                "fill-color": ["step",
                                ["get","preco_medio"],
                                "#d7e1ee",70,
                                "#949698",95,
                                "#727171",120,
                                "#c86558",155,
                                "#991f17"
                                ],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.75,
                    1
                ]
            }
        });

        map.addLayer({
            'id': 'state-borders',
            'type': 'line',
            'source': 'Paris',
            'layout': {},
            'paint': {
                'line-color': '#5c5c5d',
                'line-width': 2
            }
        });

        // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.
        map.on('mousemove', 'Paris_Layer', (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    map.setFeatureState(
                        { source: 'Paris', id: hoveredStateId },
                        { hover: false }
                    );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                    { source: 'Paris', id: hoveredStateId },
                    { hover: true }
                );
            }

            console.log(e.features[0].properties);

            var texto = "<ul>" + "<h3>"  + e.features[0].properties.neighbourhood + "</h3>" +
                "<li>" + "Preço Médio: " + e.features[0].properties.preco_medio.toString(10) + "€" + "</li>" +
                "<li>" + "Nº Airbnbs: " + e.features[0].properties.N_quartos.toString(10) + "</li>" +
                "<li>" + "Precentagem de Airbnbs: " + e.features[0].properties.Per_quartos.toString(10) + "%" + "</li>" + "</ul>" ;
            popup
                .setLngLat(e.lngLat)
                //.setText(texto)
                .setHTML(texto)
                .addTo(map);
        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on('mouseleave', 'Paris_Layer', () => {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'Paris', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = null;
            popup.remove();
        });


        map.addLayer({
            "id": "Lable_Bairros",
            "type": "symbol",
            "source": "Paris",
            "layout": {
                //"symbol-placement": "line-center",
                "text-font": ["Open Sans Regular"],
                "text-field": '{neighbourhood}',
                "text-size": 10,
                "text-rotate": 0,
                "symbol-spacing": 1,
            },
            "paint":{
                "text-color": "black",
            }
        });

        map.on('mouseenter', "Paris_Layer", () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', "Paris_Layer", () => {
            map.getCanvas().style.cursor = '';
        });

        map.on('click', "Paris_Layer", (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.neighbourhood;

            /*
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                { source: 'Paris', id: hoveredStateId },
                { hover: true }
            );*/

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            /*
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }*/


            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });



    });


});


