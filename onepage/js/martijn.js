console.log("Log is voor noobs");
var data = [{
    name: "hostnet.nl.",
    value: 463226
  }, {
    name: "metaregistrar.nl.",
    value: 370038
  }, {
    name: "transip.net.",
    value: 326939
  }, {
    name: "firstfind.nl.",
    value: 266901
  },{
    name: "rzone.de.",
    value: 152024
  }];
var text = "";

var width = 400;
var height = 400;
var thickness = 75;
var duration = 750;

var radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.selectAll("#chart")
.append('svg')
.attr('class', 'pie')
.attr('width', width)
.attr('height', height);

var g = svg.append('g')
.attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

var arc = d3.arc()
.innerRadius(radius - thickness)
.outerRadius(radius);

var pie = d3.pie()
.value(function(d) { return d.value; })
.sort(null);

var colors = [
"62eff5",
"62a5f5",
"627af5",
"5252db",

"f462bd",
"f562ee",
"c962f4",
"9362f5",

"f5627a",
"ff7155",
"f28e4f",
"fc8b8b"
]

var path = g.selectAll('path')
.data(pie(data))
.enter()
.append("g")

// Add classes based on colour
// Check based onon the !class
// Make color muted
.on("mouseover", function(d) {
      let g = d3.select(this)
        .style("cursor", "pointer")
        .style("fill", function(d, i) { return colors[this._current]})
        .attr("class", `${d.data.name}`)
        .append("g")
        .attr("class", "text-group");

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em');

      g.append("text")
        .attr("class", "value-text")
        .text(`${d.data.value}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.6em');
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", function(d, i) { return colors[i]})
        .select(".text-group").remove();
    })
  .append('path')
  .attr('d', arc)
  .style("fill", function(d, i) { return colors[i]})

  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .style("fill","#F4EB8A")
    })


  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .style("fill", function(d, i) { return colors[this._current]})
    })
  .each(function(d, i) { this._current = i; });


g.append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(text);
