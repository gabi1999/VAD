var file = "http://localhost:63342/Projecto/Website/JSON/neighbourhoods.csv"

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 90, left: 60},
    width = 550 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
/*
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
*/

var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")



// Initialize the Y axis
var y = d3.scaleLinear()
    .range([ height, 0]);
var yAxis = svg.append("g")
    .attr("class", "myYaxis")




// A function that create / update the plot for a given variable:
function update(selectedVar) {
    var selectedVar_1 = selectedVar + "_V";
    console.log(selectedVar_1);
    // Parse the Data
    d3.csv(file, function(data) {

        // sort data
        data.sort(function(b, a) {
            return a[selectedVar] - b[selectedVar];
        });

        // X axis
        x.domain(data.map(function(d) { return d.neighbourhood; }))
        xAxis.transition().duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-45)")
                .style("text-anchor", "end")

        // Add Y axis

        y.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
        //y.domain([1, d3.max(data, function(d) { return +d[selectedVar_1] }) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
            .data(data)

        // Media
        var sum = d3.sum(data, function(d) { return d[selectedVar]; });
        var average = sum/data.length;
        console.log(average);

        // update bars
        u.enter().append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d.neighbourhood); })
            .attr("y", function(d) { return y(d[selectedVar]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d[selectedVar]); })
            .attr("fill", "#888c88")


    })

}

// Initialize plot
update('preco_medio')