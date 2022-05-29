var file_by_data = "https://student.dei.uc.pt/~gabriel/JSON/price_by_data.csv";
var file_by_season = "https://student.dei.uc.pt/~gabriel/JSON/price_by_season.csv";



// set the dimensions and margins of the graph
var margin = {top: 30, right: 20, bottom: 70, left: 30},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#plot_esquerda")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Preço por Estação do Ano");

// Parse the Data
d3.csv(file_by_season, function(data) {

// X axis
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.season; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

// Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 150])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

// Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.season); })
        .attr("y", function(d) { return y(d.preco); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.preco); })
        .attr("fill", "#888c88")

})
//======================================================================================================================
// set the dimensions and margins of the graph
var margin_1 = {top: 30, right: 30, bottom: 30, left: 40},
    width_1 = 860 - margin_1.left - margin_1.right,
    height_1 = 400 - margin_1.top - margin_1.bottom;

// append the svg object to the body of the page
var svg_1 = d3.select("#plot_direita")
    .append("svg")
    .attr("width", width_1 + margin_1.left + margin_1.right)
    .attr("height", height_1 + margin_1.top + margin_1.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_1.left + "," + margin_1.top + ")");

svg_1.append("text")
    .attr("x", (width_1 / 2))
    .attr("y", 0 - (margin_1.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Preço por data");

//Read the data
d3.csv(file_by_data,
    // When reading the csv, I must format variables:
    function(d){
        return { data_Mes_Ano : d3.timeParse("%Y-%m")(d.data_Mes_Ano), preco : d.preco }
    },
    // Now I can use this dataset:
    function(data) {
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.data_Mes_Ano; }))
            .range([ 0, width_1 ]);
        svg_1.append("g")
            .attr("transform", "translate(0," + height_1 + ")")
            .call(d3.axisBottom(x));
        // Add Y axis
        var y = d3.scaleLinear()
            .domain( [0, 200])
            .range([ height_1, 0 ]);
        svg_1.append("g")
            .call(d3.axisLeft(y));
        // Add the line
        svg_1.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#888c88")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.data_Mes_Ano) })
                .y(function(d) { return y(d.preco) })
            )

        // Add the points
        svg_1.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.data_Mes_Ano) } )
            .attr("cy", function(d) { return y(d.preco) } )
            .attr("r", 5)
            .attr("fill", "#888c88")
    })
