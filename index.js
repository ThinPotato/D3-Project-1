loadChart(1)
function getDropDownValueText(){
    var selected = document.getElementById('element_selector').selectedOptions[0].text;
    console.log(selected)
    return selected
}


var data;
document.getElementById("element_selector").onchange = function() {selectElement()};

function selectElement(){
    var selected = document.getElementById('element_selector').selectedOptions[0].value;
    console.log('changing to ' + selected)
    d3.select("svg").remove()
    loadChart(selected)
}

function dataSelector(element, selected){
    console.log('updating data to ' + selected)
    switch (selected) {
        case "0":
            return element.Avg_Sleepiness.substring(0,5)
            break;
        case "1":
            return element.People_Queried_About_Sleep
            break;
        case "2":
            return element.Crashes_per_Year
            break;
        case "3":
            return element.Avg_Crash_Severity
            break;
        case "4":
            return element.Percent_Morning_Crashes.substring(0,5)
            break;
        case "5":
            return element.Percent_Evening_Crashes.substring(0,5)
            break;
        default:
            return element.Avg_Sleepiness.substring(0,5)
    }
}

function loadChart(selected){
    var svg = d3.select("body")
    .append("svg")
    .attr("width", 30000)
    .attr("height", 800);
    // bar chart
    d3.csv("Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv").then(function(data){
        console.log(data)
        //TODO: Parse data here
        var svg = d3.select("svg"),
        margin = 300,
        width = 2000 - margin,
        height = svg.attr("height") - margin,
        xScale = d3.scaleBand().range([0,width]).padding(0.5),
        yScale = d3.scaleLinear().range([height,0]),
        g = svg.append("g").attr("transform", "translate("+100+","+100+")");

        xScale.domain(data.map(function(d){return d.State;}));
        yScale.domain([0, d3.max(data,function(d){return Number(dataSelector(d,selected));})])
        g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale))
        g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
            return d + ((selected ==0 || selected == 4 || selected ==5) ? "%" : "");
        }).ticks(10))


             //axis labels
        g.append("text")
        .attr("class","x label")
        .attr("text-anchor","end")
        .attr("x", width/2 )
        .attr("y",  height+50 )
        .text("States");

        g.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90), translate(-200,-40)")
        .text(getDropDownValueText);

        var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.9 + 0.1), data.length).reverse())

        g
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", function(d){return xScale(d.State);})
        .attr("y", function(d) {return yScale(Number(dataSelector(d,selected)));})
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){return height - yScale(Number(dataSelector(d,selected)));})
        .attr('fill',function(d){
			return color(d.State);
		})
    });



    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

