


//Width and height
var w = innerWidth;
var h = innerHeight;

// projection
var scale = 8000;
var offset = [w / 2, h / 2.1];
var center = [4,52];
var projection = d3.geoMercator()
  .scale(scale)
  .center(center)
  .translate(offset);

//Define path generator
var path = d3.geoPath()
	.projection(projection);

//Create SVG
var svg = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

// create a new SVG group element
var layerLanden = svg.append('g');

var attributen = [];

var color = d3.scaleLinear()
    .domain([0,10,20,30,40,50,75,100])
    .range(["red","orange", "yellow","green", "blue", "purple", "grey","black"]);


//Create Legend
var legend = d3.select("body")
	.append("ol")
	.attr("width", "10%")
	.attr("height", "300px");

legend.selectAll("li")
	.data(color.domain().reverse())
	.enter()
	.append("li")
	.attr("class", "legend")
	.style("background-color", function(d){
		return color(d)
	})
	.text(function(d){
		return d + "%"
	})
	.style("color", "#fff");

//Load in GeoJSON data
d3.json("csv_edited/1994.json", function(json) {
	console.log(json.features[0].properties.PvdA)
	console.log(json.features[0].properties["geldige stemmen"])
	// Array of parties
	for(var key in json.features[0].properties){
		attributen.push(key);
	}
	var partij_lijst = attributen.slice(15,attributen.length -1);
	// Create buttons per party
	d3.select("body")
		.selectAll("input")
		.data(partij_lijst)
		.enter()
		.append("input")
		.attr("type","button")
		.attr("class","button")
		.attr("value", function (d){return d;} )
		.attr("onclick", function (d){ 
			return "updateData(\"" + d + "\")"
		});

	//Bind data and create one path per GeoJSON feature
	layerLanden.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", "grey")
		.style("stroke", "#3c4044")
		.style("stroke-width", "-1px")
		.style("opacity", 0.1)
		.style("fill", "grey")
		.transition()
		.style("opacity",1)
		.style("fill", function(d){
			return color( (d.properties.PvdA*100)/d.properties["geldige stemmen"])
		})
		.ease(d3.easeLinear)
		.duration(500)
});	

function updateData(partij){
	d3.json("csv_edited/1994.json", function(json) {
	console.log(partij)
	d3.select("g").selectAll("path")
			.data(json.features)
			.transition()
			.style("opacity",1)
			.style("fill", function(d){
				return color((d.properties[partij]*100)/d.properties["geldige stemmen"])
			});
	});
}