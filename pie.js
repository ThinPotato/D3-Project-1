loadChart(0)

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

function dataSelector(element, selected){
    console.log('updating data to ' + selected)
    switch (selected) {
        case '0':
            return element.Avg_Sleepiness.substring(0,5)
            break;
        case '1':
            return element.People_Queried_About_Sleep
            break;
        case '2':
            return element.Crashes_per_Year
            break;
        case '3':
            return element.Avg_Crash_Severity
            break;
        case '4':
            return element.Percent_Morning_Crashes.substring(0,5)
            break;
        case '5':
            return element.Percent_Evening_Crashes.substring(0,5)
            break;
        default:
            return element.Avg_Sleepiness.substring(0,5)
    }
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
    var pie = d3.pie()

    var arc = d3.arc().innerRadius(0).outerRadius(radius)

    var path = d3.arc()
			.outerRadius(radius - 40)
			.innerRadius(100);
	var label = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius - 150);

    d3.csv('Access Assignment 1 Proposal - Bryce Stoker-Schaeffer (11199983).csv').then(function(data){
        console.log(data)
        var arcs = g.selectAll('arc')
        .data(pie(data.map(function(d){return Number(dataSelector(d,selected));}).slice(0,7)))
        .enter().append('g')
        .attr('class','arc')
        var color = d3.scaleOrdinal(['#e40303','#ff8c00', '#ffed00', '#008026','#004dff','#750787'])
        console.log(data)
        arcs.append('path') 
		.attr('fill',function(d){
			return color(data.map(function(d){return d.State}));
		})
		.attr('d', arc);
        arcs.append('text')
			.attr('transform', function(d){return 'translate(' + label.centroid(d) + ')';})
			.text(function(d){
                console.log(d)
                console.log("name "+d.data)
                return d.data});
    });

    d3.select('h3').style('color', 'darkblue');
    d3.select('h3').style('font-size', '24px');
}

