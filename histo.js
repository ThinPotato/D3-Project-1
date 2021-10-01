loadChart('0')

function getDropDownValue(){
    var ddReference = document.getElementsByClassName("dropdown_content");
    selected = ddReference.options[ddReference.selectedIndex].value;
    return selected;
}
var data;
document.getElementById("element_selector").onchange = function() {selectElement()};

function selectElement(){
    var selected = document.getElementById('element_selector').selectedOptions[0].value;
    console.log('changing to ' + selected)
    d3.select("svg").remove()
    loadChart(selected)
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
        if(selected == '0' || selected == '3' || selected == '5' || selected == '4'){
            numToAdd = numToAdd/count
        }
        //newData[State] = numToAdd
        if(numToAdd > 0){
            newData.push({State: State, value: numToAdd})
        }
        console.log("added "+ numToAdd + " to " + State)
        }
        newData.sort((a,b)=>b.value-a.value)
    return newData
}

//X-axis is selected variable binned
//Y-axis is number of states in a bin

function loadChart(selected){
    var svg = d3.select("body")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 800);

    // bar chart
    d3.csv("Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv").then(function(data){
        data = dataSum(data,selected)

        console.log(data)
        //TODO: Parse data here
        var svg = d3.select("svg"),
        margin = 200,
        width = 2000 - margin,
        height = svg.attr("height") - margin,
        bin = d3.bin().value(d => d.value).thresholds(40)
        bins = bin(data)
        g = svg.append("g")
        console.log(bins)

        const xScale = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([40, width])

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height, 0])  
        g.append("g")
        .attr("transform", "translate(0," +height +")")
        .call(d3.axisBottom(xScale).ticks(20))
        .call(g => g.append("text")
        .text(data.x))

        g.append("g")
        .attr("transform", `translate(40,0)`)
        .call(d3.axisLeft(yScale).ticks(10))
        .call(g => g.select(".tick")
        .text(data.y));

        //color
        var color = d3.scaleOrdinal()
        .domain(data.map(d => d.State))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.7 + 0.5), data.length).reverse())
        //bars
        svg.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("transform", function(d) { return `translate(${xScale(d.x0)} , ${yScale(d.length)})`})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .style("fill", function(d){
			return color(d.x1);
		})
        .style("opacity", 0.6)
        
    });

    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

