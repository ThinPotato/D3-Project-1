loadChart(0,0)

function getDropDownValue(){
    var ddReference = document.getElementsByClassName("dropdown_content");
    selected = ddReference.options[ddReference.selectedIndex].value;
    return selected;
}
var data;
document.getElementById("element_selector").onchange = function() {selectElement()};
document.getElementById("element_selector2").onchange = function() {selectElement()};

function selectElement(){
    var selectedY = document.getElementById('element_selector').selectedOptions[0].value;
    var selectedX = document.getElementById('element_selector2').selectedOptions[0].value;
    d3.select("svg").remove()
    loadChart(selectedX, selectedY)
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

function dataSum(data, selected){
    temp = d3.group(data, d => d.State)
    var preData ={};
    var newData=[];
    for (const [key, value] of temp) {
        //console.log(key, value);
        var State = temp.get(key)[0].State
        //console.log("Key Value:" + value)
        preData[value] = temp.get(key)
        numToAdd = 0;
        count = 0;
        for (const [key2, value2] of value.entries()){
            count +=1;
            //console.log("Inner Data: "+ value2.People_Queried_About_Sleep)
            switch (selected){
                case('0'):
                    numToAdd += Number(value2.Avg_Sleepiness.substring(0,5))
                    break;
                case('1'):
                    numToAdd += Number(value2.People_Queried_About_Sleep)
                case('2'):
                    numToAdd += Number(value2.Crashes_per_Year)
                    break;
                case('3'):
                    numToAdd += Number(value2.Avg_Crash_Severity)
                case('4'):
                    numToAdd += Number(value2.Percent_Morning_Crashes.substring(0,5))
                case('5'):
                    numToAdd += Number(value2.Percent_Evening_Crashes.substring(0,5))
                    break;
                case('default'):
                    numToAdd += Number(value2.Avg_Sleepiness.substring(0,5))
            }
        }
        if(selected == '0' || selected == '4' || selected == '5'){
            numToAdd = numToAdd/count
        }
        //newData[State] = numToAdd
        newData.push({State: State, value: numToAdd})
        console.log("added "+ numToAdd + " to " + State)
        }
    return newData
}

function loadChart(selectedX, selectedY){
    var svg = d3.select("body")
    .append("svg")
    .attr("width", 60000)
    .attr("height", 800);
    // bar chart
    d3.csv("Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv").then(function(data){
        console.log(data)
        //aggregate data
        dataX = dataSum(data, selectedX)
        dataY = dataSum(data, selectedY)

        //TODO: Parse data here
        var svg = d3.select("svg"),
        margin = 300,
        width = 5000 - margin,
        height = svg.attr("height") - margin,
        xScale = d3.scaleBand().range([0,width]).padding(0.5),
        yScale = d3.scaleLinear().range([height,0]),
        g = svg.append("g").attr("transform", "translate("+100+","+100+")");

        xScale.domain(data.map(function(d){return Number(dataSelector(d,selectedX))}));
        yScale.domain([0, d3.max(data,function(d){return Number(dataSelector(d,selectedX));})])
        g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale))
        g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
            return d + ((selectedX ==0 || selectedX == 4 || selectedX ==5) ? "%" : "");
        }).ticks(10))

        var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
          

        g
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){return xScale(Number(dataSelector(d,selectedX)));})
        .attr("cy", function(d) {return yScale(Number(dataSelector(d,selectedY)));})
        .attr("r", xScale.bandwidth()/2)
        .style("fill", function (d) { return color(d.City) } )

        // Add one dot in the legend for each name.
        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return color(d.State)})

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d.State})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    });

    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

