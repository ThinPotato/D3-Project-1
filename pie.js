
function getDropDownValue(){
    var ddReference = document.getElementsByClassName('dropdown_content');
    selected = ddReference.options[ddReference.selectedIndex].value;
    return selected;
}
var data;
document.getElementById('element_selector').onchange = function() {selectElement()};

function selectElement(){
    var selected = document.getElementById('element_selector').selectedOptions[0].value;
    console.log('changing to ' + selected)
    d3.select('svg').remove()
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
        if(selected == '0' || selected == '4' || selected == '5'){
            numToAdd = numToAdd/count
        }
        //newData[State] = numToAdd
        newData.push({State: State, value: numToAdd})
        console.log("added "+ numToAdd + " to " + State)
        }
    return newData
}

function loadChart(selected){
    
    var svg = d3.select('body')
    .append('svg')
    .attr('width', 800)
    .attr('height', 800);
    // bar chart

    //TODO: Parse data here
    var svg = d3.select('svg'),
    width = 800,
    height = 800,
    radius = Math.min(width, height) / 2 
    g = svg.append('g').attr('transform', 'translate('+ width / 2 + ',' + height / 2 + ')');

    var pie = d3.pie().value(d => d.value)

    //var pie = d3.pie()
    //.value(function(d){
      //  return dataSelector(d, selected)
    //}).sort(null)


    var arc = d3.arc().innerRadius(0).outerRadius(radius)

    var path = d3.arc()
			.outerRadius(radius - 40)
			.innerRadius(100);
	var label = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius - 150);

    d3.csv('Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv').then(function(data){
        console.log(data)
        //bin1 = d3.bin().value(d => d.State)
        //temp = bin1(data)
        
        data = dataSum(data, selected)
        //console.log(data.map(function(d) {return d[0]}))
        console.log(data)
        var arcs = g.selectAll('arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class','arc')
        
        var color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.9 + 0.1), data.length).reverse())
          
        arcs.append('path') 
		.attr('fill',function(d){
			return color(d.data.State);
		})
		.attr('d', arc);
        arcs.append('text')
			.attr('transform', function(d){return 'translate(' + label.centroid(d) + ')';})
			.text(function(d){
                return d.data.State});
    });

    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

loadChart(0)
