loadChart('0','0')

function getDropDownValueText(name){
    var selected = document.getElementById(name).selectedOptions[0].text;
    console.log(selected)
    return selected
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

function dataSum(data, selectedX, selectedY){
    temp = d3.group(data, d => d.State)
    var preData ={};
    var newData=[];
    for (const [key, value] of temp) {
        //console.log(key, value);
        var State = temp.get(key)[0].State
        //console.log("Key Value:" + value)
        preData[value] = temp.get(key)
        numToAdd = 0;
        numToAdd2 = 0;
        count = 0;
        for (const [key2, value2] of value.entries()){
            count +=1;
            //console.log("Inner Data: "+ value2.People_Queried_About_Sleep)
            switch (selectedX){
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
            switch (selectedY){
                case('0'):
                    numToAdd2 += Number(value2.Avg_Sleepiness.substring(0,5))
                    break;
                case('1'):
                    numToAdd2 += Number(value2.People_Queried_About_Sleep)
                case('2'):
                    numToAdd2 += Number(value2.Crashes_per_Year)
                    break;
                case('3'):
                    numToAdd2 += Number(value2.Avg_Crash_Severity)
                case('4'):
                    numToAdd2 += Number(value2.Percent_Morning_Crashes.substring(0,5))
                case('5'):
                    numToAdd2 += Number(value2.Percent_Evening_Crashes.substring(0,5))
                    break;
                case('default'):
                    numToAdd2 += Number(value2.Avg_Sleepiness.substring(0,5))
            }
        }
        if(selectedX == '0' || selectedX == '3' || selectedX == '5' || selectedX == '4'){
            numToAdd = numToAdd/count
        }
        if(selectedY == '0' || selectedY == '3' || selectedY == '5' || selectedY == '4'){
            numToAdd2 = numToAdd2/count
        }
        newData.sort((a,b)=>a.value-b.value)
        //newData[State] = numToAdd
        if( numToAdd > 0 && numToAdd2 >0){
        newData.push({State: State, value: numToAdd, value2: numToAdd2})
        }
        console.log("added \n"+ selectedX + ": " + numToAdd+ "\n" + selectedY + ": " + numToAdd2+ " to " + State)
        }
    return newData
}

function loadChart(selectedX, selectedY){
    var svg = d3.select("body")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 1000);
    // bar chart
    d3.csv("Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv").then(function(data){
        console.log(data)
        //aggregate data
        data = dataSum(data, selectedX, selectedY)
        console.log(data)
        //TODO: Parse data here
        var svg = d3.select("svg"),
        margin = 200,
        width = 2000,
        height = svg.attr("height") - margin,

        xScale = d3.scaleLinear().range([0,width]).domain([0, d3.max(data,function(d){return d.value})]),
        yScale = d3.scaleLinear().range([height,0]).domain([0, d3.max(data,function(d){return d.value2})]),
        g = svg.append("g").attr("transform", "translate("+100+","+100+")");

        g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale).tickFormat(function(d){
            return d + ((selectedX =='0' || selectedX == '4' || selectedX =='5') ? "%" : "");
        }).ticks(20))
        g.append("g").call(d3.axisLeft(yScale).tickFormat(function(d){
            return d + ((selectedY =='0' || selectedY == '4' || selectedY =='5') ? "%" : "");
        }).ticks(20))


        g.append("text")
        .attr("class","x label")
        .attr("text-anchor","end")
        .attr("x", width/2 )
        .attr("y",  height+50 )
        .text(getDropDownValueText('element_selector2'));

        g.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90), translate(-200,-50)")
        .text(getDropDownValueText('element_selector'));

        var color = d3.scaleOrdinal()
        .domain(data.map(d => d.State))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

          
        var circles =  svg.selectAll("g.dot")
            .data(data)
            .enter().append('g');

        
        circles.append("circle")
        .attr("class", "dot")
        .attr("r", 10)
        .attr("cx", function (d) {
            return 100 +xScale(d.value);
        })
        .attr("cy", function (d) {
            console.log(d.State+" belongs at Y: "+d.value2)
            return yScale(d.value2) + 100;
        })
        .style("fill", function (d) {
            return color(d.State);
        });

        circles.append("text").text(function(d){
            return d.State;
        })
        .attr("x", function (d) {
            return 100 +xScale(d.value);
        })
        .attr("y", function (d) {
            return yScale(d.value2) + 100 ;
        });

        


    });

    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

