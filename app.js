// Load data from CSV file
d3.csv("HealthConditions.csv").then(function(data) {
    drawScatterPlot(data);
    drawHeatmapMatrix(data);
    drawCholesterolLineChart(data);
    // drawBarGraph(data);
    drawBarGraphWithYAxis(data, "bloodSugar");

    // Event listener for dropdown change
    document.getElementById("y-axis-select").addEventListener("change", function() {
    const selectedYAxis = this.value;
    drawBarGraphWithYAxis(data, selectedYAxis);
    });
}).catch(function(error) {
    console.error("Error loading the CSV file:", error);
});

function drawScatterPlot(data) {
    // Extracting required data for scatter plot (e.g., age and blood pressure)
    var scatterData = data.map(function(d) {
        return {
            age: +d.Age,
            bloodPressure: d["Blood Pressure"]
        };
    });

    // Set up the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 50, left: 60 };
    var width = 1100 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    var svg = d3.select("#scatter-plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define X scale (age)
    var x = d3.scaleLinear()
        .domain([d3.min(scatterData, function(d) { return d.age; }), d3.max(scatterData, function(d) { return d.age; })])
        .range([0, width]);

    // Define Y scale (blood pressure)
    var y = d3.scaleLinear()
        .domain([0, d3.max(scatterData, function(d) { return +d.bloodPressure.split("/")[0]; })])
        .range([height, 0]);

    // Add X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 100)
        .style("text-anchor", "middle")
        .text("Age (years)");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Blood Pressure");

    // Define blood pressure categories
    var categories = ["Normal", "Elevated", "Hypertension Stage 1", "Hypertension Stage 2", "Hypertensive Crisis"];

    // Define color scale for categories
    var colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(["green", "yellow", "orange", "red", "darkred"]);

    // Add dots for scatter plot
    svg.selectAll("circle")
        .data(scatterData)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d.age); })
        .attr("cy", function(d) { return y(+d.bloodPressure.split("/")[0]); })
        .attr("r", 5)
        .style("fill", function(d) {
            var bp = +d.bloodPressure.split("/")[0];
            if (bp < 120) return colorScale(categories[0]);
            else if (bp < 130) return colorScale(categories[1]);
            else if (bp < 140) return colorScale(categories[2]);
            else if (bp < 160) return colorScale(categories[3]);
            else return colorScale(categories[4]);
        });

    // Add legend
    var legend = svg.selectAll(".legend")
        .data(categories)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("y", 190)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return colorScale(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 200)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

// function drawScatterPlot(data) {
//     // Extracting required data for scatter plot (e.g., age and blood pressure)
//     var scatterData = data.map(function(d) {
//         return {
//             age: +d.Age,
//             bloodPressure: d["Blood Pressure"]
//         };
//     });

//     // Set up the dimensions and margins of the graph
//     var margin = { top: 20, right: 30, bottom: 50, left: 60 };
//     var width = 1100 - margin.left - margin.right;
//     var height = 400 - margin.top - margin.bottom;

//     // Append the SVG object to the designated div
//     var svg = d3.select("#scatter-plot")
//                 .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//                 .append("g")
//                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // Define X scale (age)
//     var x = d3.scaleLinear()
//         .domain([d3.min(scatterData, function(d) { return d.age; }), d3.max(scatterData, function(d) { return d.age; })])
//         .range([0, width]);

//     // Define Y scale (blood pressure)
//     var y = d3.scaleLinear()
//         .domain([0, d3.max(scatterData, function(d) { return +d.bloodPressure.split("/")[0]; })])
//         .range([height, 0]);

//     // Define blood pressure categories
//     var categories = ["Normal", "Elevated", "Hypertension Stage 1", "Hypertension Stage 2", "Hypertensive Crisis"];

//     // Define color scale for categories
//     var colorScale = d3.scaleOrdinal()
//         .domain(categories)
//         .range(["green", "yellow", "orange", "red", "darkred"]);

//     // Add dots for scatter plot
//     svg.selectAll("circle")
//         .data(scatterData)
//         .enter().append("circle")
//         .attr("cx", function(d) { return x(d.age); })
//         .attr("cy", function(d) { return y(+d.bloodPressure.split("/")[0]); })
//         .attr("r", 5)
//         .style("fill", function(d) {
//             var bp = +d.bloodPressure.split("/")[0];
//             if (bp < 120) return colorScale(categories[0]);
//             else if (bp < 130) return colorScale(categories[1]);
//             else if (bp < 140) return colorScale(categories[2]);
//             else if (bp < 160) return colorScale(categories[3]);
//             else return colorScale(categories[4]);
//         })
//         .on("mouseover", function(event, d) {
//             var tooltipText = "Age: " + d.age + "<br>Blood Pressure: " + d.bloodPressure;
//             var bpCategory = "";
//             var bp = +d.bloodPressure.split("/")[0];
//             if (bp < 120) bpCategory = categories[0];
//             else if (bp < 130) bpCategory = categories[1];
//             else if (bp < 140) bpCategory = categories[2];
//             else if (bp < 160) bpCategory = categories[3];
//             else bpCategory = categories[4];
//             tooltipText += "<br>Category: " + bpCategory;
//             showTooltip(tooltipText, event.pageX, event.pageY);
//         })
//         .on("mouseout", function() {
//             hideTooltip();
//         });

//     // Define tooltip
//     var tooltip = d3.select("body")
//         .append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     function showTooltip(text, x, y) {
//         tooltip.html(text)
//             .style("left", x + "px")
//             .style("top", y + "px")
//             .style("opacity", 1);
//     }

//     function hideTooltip() {
//         tooltip.style("opacity", 0);
//     }

//     // Add X axis
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .append("text")
//         .attr("x", width / 2)
//         .attr("y", margin.bottom - 100)
//         .style("text-anchor", "middle")
//         .text("Age (years)");

//     // Add Y axis
//     svg.append("g")
//         .call(d3.axisLeft(y))
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left)
//         .attr("x", 0 - (height / 2))
//         .attr("dy", "1em")
//         .style("text-anchor", "middle")
//         .text("Blood Pressure");
// }

function drawHeatmapMatrix(data) {
    // Define the health metrics and age groups
    const healthMetrics = ['Weight (kg)', 'Height (cm)', 'Blood Pressure', 'Cholesterol (mg/dL)', 'Blood Sugar (mg/dL)', 'Exercise (minutes/day)', 'Sleep Duration (hours/day)'];
    const ageGroups = [28,30,31,32,33,34,36,38,39,40,41,42,44,45,46,47,48,49,50,52,55,56,58,59,60];

    // Extract data for the heatmap matrix
    const heatmapMatrixData = healthMetrics.map(metric => {
        return ageGroups.map(age => {
            // Filter data for the current age group
            const ageGroupData = data.filter(d => +d.Age === age);
            // Calculate the average value of the health metric for the current age group
            const metricValues = ageGroupData.map(d => +d[metric]);
            const average = d3.mean(metricValues);
            return average;
        });
    });

    // Set up dimensions and margins
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 1100 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    const svg = d3.select("#heatmap-matrix")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([d3.min(heatmapMatrixData.flat()), d3.max(heatmapMatrixData.flat())]);

    // Create heatmap cells
    svg.selectAll(".heatmap-cell")
        .data(heatmapMatrixData.flat())
        .enter()
        .append("rect")
        .attr("x", (d, i) => (i % ageGroups.length) * (width / ageGroups.length))
        .attr("y", (d, i) => Math.floor(i / ageGroups.length) * (height / healthMetrics.length))
        .attr("width", width / ageGroups.length)
        .attr("height", height / healthMetrics.length)
        .style("fill", d => colorScale(d))
        .style("stroke", "#fff");

    // Add row labels
    svg.selectAll(".row-label")
        .data(healthMetrics)
        .enter()
        .append("text")
        .attr("class", "row-label")
        .attr("x", -margin.left - 10) // Adjust the position for clarity
        .attr("y", (d, i) => i * (height / healthMetrics.length) + (height / healthMetrics.length / 2))
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .text(d => d);

    // Add column labels
    svg.selectAll(".column-label")
        .data(ageGroups)
        .enter()
        .append("text")
        .attr("class", "column-label")
        .attr("x", (d, i) => i * (width / ageGroups.length) + (width / ageGroups.length / 2))
        .attr("y", -margin.top)
        .attr("dy", "-0.35em")
        .attr("text-anchor", "middle")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .text(d => d + " years");

    // Add title for rows
    svg.append("text")
        .attr("class", "row-title")
        .attr("x", -margin.left)
        .attr("y", -margin.top)
        .attr("dy", "1em")
        .attr("text-anchor", "start")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "14px")
        .text("Health Metrics");

    // Add title for columns
    svg.append("text")
        .attr("class", "column-title")
        .attr("x", width + margin.right)
        .attr("y", height + margin.bottom)
        .attr("dy", "-0.5em")
        .attr("text-anchor", "end")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "14px")
        .text("Age (years)");
}

function drawCholesterolLineChart(data) {
    // Extracting required data for line chart (e.g., cholesterol levels over time)
    var cholesterolData = data.map(function(d) {
        return {
            age: +d.Age,
            gender: d.Gender,
            cholesterol: +d["Cholesterol (mg/dL)"]
        };
    });

    // Filter data for males and females separately
    var maleData = cholesterolData.filter(function(d) { return d.gender === "Male"; });
    var femaleData = cholesterolData.filter(function(d) { return d.gender === "Female"; });

    // Set up the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 50, left: 60 };
    var width = 1100 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the designated div
    var svg = d3.select("#cholesterol-line-chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define X scale (age)
    var x = d3.scaleLinear()
        .domain([Math.min(28, d3.min(cholesterolData, function(d) { return d.age; })), d3.max(cholesterolData, function(d) { return d.age; })])
        .range([0, width]);

    // Define Y scale (cholesterol)
    var y = d3.scaleLinear()
        .domain([Math.min(150, d3.min(cholesterolData, function(d) { return d.cholesterol; })), d3.max(cholesterolData, function(d) { return d.cholesterol; })])
        .range([height, 0]);

    // Append dots for male data with tooltips
    svg.selectAll(".male-dot")
        .data(maleData)
        .enter().append("circle")
        .attr("class", "dot male-dot")
        .attr("cx", function(d) { return x(d.age); })
        .attr("cy", function(d) { return y(d.cholesterol); })
        .attr("r", 5)
        .style("fill", "blue")
        .on("mouseover", function(event, d) {
            showPopup(d.age, d.gender, d.cholesterol, event.pageX, event.pageY);
        })
        .on("mouseout", function() {
            hidePopup();
        });

    // Append dots for female data with tooltips
    svg.selectAll(".female-dot")
        .data(femaleData)
        .enter().append("circle")
        .attr("class", "dot female-dot")
        .attr("cx", function(d) { return x(d.age); })
        .attr("cy", function(d) { return y(d.cholesterol); })
        .attr("r", 5)
        .style("fill", "red")
        .on("mouseover", function(event, d) {
            showPopup(d.age, d.gender, d.cholesterol, event.pageX, event.pageY);
        })
        .on("mouseout", function() {
            hidePopup();
        });

    // Define line function for males
    var maleLine = d3.line()
        .x(function(d) { return x(d.age); })
        .y(function(d) { return y(d.cholesterol); });

    // Append male line
    svg.append("path")
        .datum(maleData)
        .attr("class", "line")
        .attr("d", maleLine)
        .style("stroke", "blue")
        .style("fill", "none");

    // Define line function for females
    var femaleLine = d3.line()
        .x(function(d) { return x(d.age); })
        .y(function(d) { return y(d.cholesterol); });

    // Append female line
    svg.append("path")
        .datum(femaleData)
        .attr("class", "line")
        .attr("d", femaleLine)
        .style("stroke", "red")
        .style("fill", "none");

    // Add X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Age (years)");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Cholesterol (mg/dL)");

    // Popup functions
    var popup = d3.select("#cholesterol-line-chart").append("div")
        .attr("class", "popup")
        .style("display", "none");

    function showPopup(age, gender, cholesterol, x, y) {
        popup.html("Age: " + age + "<br/>Gender: " + gender + "<br/>Cholesterol: " + cholesterol)
            .style("left", (x + 10) + "px")
            .style("top", (y - 30) + "px")
            .style("display", "block");
    }

    function hidePopup() {
        popup.style("display", "none");
    }
}

// Function to draw the bar graph with the selected y-axis
function drawBarGraphWithYAxis(data, yAxis) {
    const ageGroups = [20, 30, 40, 50, 60]; // Divide age groups into 4 categories
    const ageGroupLabels = ["20-30", "31-40", "41-50", "51-60"];

    const yAccessor = (d) => {
        switch (yAxis) {
            case "bloodSugar":
                return +d["Blood Sugar (mg/dL)"];
            case "exerciseDuration":
                return +d["Exercise (minutes/day)"];
            case "sleepDuration":
                return +d["Sleep Duration (hours/day)"];
            default:
                return 0;
        }
    };

    const bloodSugarData = ageGroups.map((age, index) => {
        const ageData = data.filter(d => +d.Age >= age && +d.Age < ageGroups[index + 1]);
        const averageYValue = d3.mean(ageData, yAccessor);
        return { ageGroup: ageGroupLabels[index], averageYValue };
    });

    // Set up dimensions and margins
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 1100 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG to avoid duplication
    d3.select("#bar-chart").select("svg").remove();

    // Create SVG element
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleBand()
        .domain(ageGroupLabels)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bloodSugarData, d => d.averageYValue)])
        .nice()
        .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
        .data(bloodSugarData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.ageGroup))
        .attr("y", d => y(d.averageYValue))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.averageYValue))
        .attr("fill", "#8fd8b2") // Set the initial fill color
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "orange"); // Change fill color on mouseover
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "#8fd8b2"); // Revert to original fill color on mouseout
        });

    // Add x-axis
    svg.append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
        .attr("class", "axis-y")
        .call(d3.axisLeft(y));

    // Add axis labels
    svg.append("text")
        .attr("class", "axis-x-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .attr("text-anchor", "middle")
        .text("Age Groups");

    svg.append("text")
        .attr("class", "axis-y-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text(yAxis === "bloodSugar" ? "Average Blood Sugar (mg/dL)" : yAxis === "exerciseDuration" ? "Average Exercise Duration (minutes/day)" : "Average Sleep Duration (hours/day)");
}