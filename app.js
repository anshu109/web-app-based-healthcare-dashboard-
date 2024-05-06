// // Sample data for visualization
// const data = [10, 20, 30, 40, 50];

// // Create SVG container
// const svg = d3.select("#visualization-container")
//     .append("svg")
//     .attr("width", 400)
//     .attr("height", 200);

// // Create rectangles for each data point
// svg.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", (d, i) => i * 80)
//     .attr("y", (d) => 200 - d * 2) // Adjusted to fit within SVG height
//     .attr("width", 50)
//     .attr("height", (d) => d * 2) // Scaled for visualization
//     .attr("fill", "teal")

//     // Interactivity: hover effect
//     .on("mouseover", function() {
//         d3.select(this)
//             .attr("fill", "orange");
//     })
//     .on("mouseout", function() {
//         d3.select(this)
//             .attr("fill", "teal");
//     });

// // Optional: Add labels to the bars
// svg.selectAll("text")
//     .data(data)
//     .enter()
//     .append("text")
//     .text((d) => d)
//     .attr("x", (d, i) => i * 80 + 20) // Adjusted position for text
//     .attr("y", (d) => 200 - d * 2 - 5) // Adjusted position for text
//     .attr("fill", "white")
//     .attr("text-anchor", "middle");

// Load data from CSV file
d3.csv("HealthConditions.csv").then(function(data) {
    drawLineChart(data);
    drawScatterPlot(data);
    drawHeatmap(data);
}).catch(function(error) {
    console.log("Error loading the CSV file: " + error);
});

// Function to draw line chart
// function drawLineChart(data) {
//     // Extracting required data for line chart (e.g., cholesterol levels over time)
//     var cholesterolData = data.map(function(d) {
//         return {
//             age: +d.Age,
//             cholesterol: +d["Cholesterol (mg/dL)"]
//         };
//     });

//     // Set up the dimensions and margins of the graph
//     var margin = {top: 20, right: 30, bottom: 50, left: 60},
//         width = 600 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;

//     // Append the SVG object to the designated div
//     var svg = d3.select("#line-chart")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform",
//                       "translate(" + margin.left + "," + margin.top + ")");

//     // Add X axis
//     var x = d3.scaleLinear()
//               .domain(d3.extent(cholesterolData, function(d) { return d.age; }))
//               .range([0, width]);
//     svg.append("g")
//        .attr("transform", "translate(0," + height + ")")
//        .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear()
//               .domain([0, d3.max(cholesterolData, function(d) { return d.cholesterol; })])
//               .range([height, 0]);
//     svg.append("g")
//        .call(d3.axisLeft(y));

//     // Add line
//     svg.append("path")
//        .datum(cholesterolData)
//        .attr("fill", "none")
//        .attr("stroke", "steelblue")
//        .attr("stroke-width", 1.5)
//        .attr("d", d3.line()
//                     .x(function(d) { return x(d.age); })
//                     .y(function(d) { return y(d.cholesterol); })
//                 );
// }
function drawLineChart(data) {
    // Extracting required data for line chart (e.g., cholesterol levels over time)
    var cholesterolData = data.map(function(d) {
        return {
            age: +d.Age,
            cholesterol: +d["Cholesterol (mg/dL)"]
        };
    });

    // Set up the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 50, left: 60},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    var svg = d3.select("#line-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
              .domain(d3.extent(cholesterolData, function(d) { return d.age; }))
              .range([0, width]);
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x))
       .append("text")
       .attr("x", width / 2)
       .attr("y", margin.bottom - 10)
       .style("text-anchor", "middle")
       .text("Age");

    // Add Y axis
    var y = d3.scaleLinear()
              .domain([0, d3.max(cholesterolData, function(d) { return d.cholesterol; })])
              .range([height, 0]);
    svg.append("g")
       .call(d3.axisLeft(y))
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Cholesterol (mg/dL)");

    // Add line
    svg.append("path")
       .datum(cholesterolData)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", d3.line()
                    .x(function(d) { return x(d.age); })
                    .y(function(d) { return y(d.cholesterol); })
                );
}
// Function to draw scatter plot
function drawScatterPlot(data) {
    // Extracting required data for scatter plot (e.g., age and blood pressure)
    var scatterData = data.map(function(d) {
        return {
            age: +d.Age,
            bloodPressure: d["Blood Pressure"]
        };
    });

    // Set up the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 50, left: 60},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    var svg = d3.select("#scatter-plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
              .domain(d3.extent(scatterData, function(d) { return d.age; }))
              .range([0, width]);
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
              .domain([0, d3.max(scatterData, function(d) { return +d.bloodPressure.split("/")[0]; })])
              .range([height, 0]);
    svg.append("g")
       .call(d3.axisLeft(y));

    // Add dots
    svg.selectAll("circle")
       .data(scatterData)
       .enter()
       .append("circle")
       .attr("cx", function(d) { return x(d.age); })
       .attr("cy", function(d) { return y(+d.bloodPressure.split("/")[0]); })
       .attr("r", 5)
       .style("fill", "steelblue");
}

// Function to draw heatmap
function drawHeatmap(data) {
    // Extracting required data for heatmap (e.g., blood pressure, cholesterol levels)
    var heatmapData = data.map(function(d) {
        return {
            bloodPressure: d["Blood Pressure"],
            cholesterol: +d["Cholesterol (mg/dL)"]
        };
    });

    // Set up the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    var svg = d3.select("#heatmap-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var x = d3.scaleBand()
              .range([0, width])
              .domain(heatmapData.map(function(d) { return d.bloodPressure; }))
              .padding(0.1);

    var y = d3.scaleLinear()
              .domain([0, d3.max(heatmapData, function(d) { return d.cholesterol; })])
              .range([height, 0]);

    // Add X axis
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

    // Add Y axis
    svg.append("g")
       .call(d3.axisLeft(y));

    // Add rectangles
    svg.selectAll()
       .data(heatmapData)
       .enter()
       .append("rect")
       .attr("x", function(d) { return x(d.bloodPressure); })
       .attr("y", function(d) { return y(d.cholesterol); })
       .attr("width", x.bandwidth())
       .attr("height", function(d) { return height - y(d.cholesterol); })
       .style("fill", "steelblue");
}



