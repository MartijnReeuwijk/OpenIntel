console.log("Log is voor noobs");
var data = [{
  name: "NL",
  value: 463226
}, {
  name: "DE",
  value: 370038
}, {
  name: "BG",
  value: 326939
}, {
  name: "ES",
  value: 266901
}, {
  name: "BE",
  value: 152024
}];
var text = "";

var width = 300;
var height = 300;
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
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

var pie = d3.pie()
  .value(function(d) {
    return d.value;
  })
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
var mouseover = "#F4EB8A";

var path = g.selectAll('path')
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "text-group")

  // .attr("class", `${d.data.name}`)

  // Add classes based on colour
  // Check based onon the !class
  // Make color muted
  .on("mouseover", function(d) {
    let g = d3.select(this)
      .style("cursor", "pointer")
      .style("fill", function(d, i) {
        return colors[this._current]
      })
      // .style("fill", function(d, i) { return colors[this._current]})
      // d3.selectAll(".mYc")
      .append("g")
      // add the values in middel this can be the map
      .attr("class", "text-group");
    // .attr("class", "value-text")

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

    // select all not selected



  })

  .on("mouseout", function(d) {
    d3.select(this)
      .style("cursor", "none")
      .style("fill", function(d, i) {
        return colors[i]
      })
      .select(".text-group").remove();
  })

  .append('path')
  .attr('d', arc)
  .style("fill", function(d, i) {
    return colors[i]
  })

  .on("mouseover", function(d) {
    d3.select(this)
      .style("cursor", "pointer")
      .style("fill", mouseover)
  })


  .on("mouseout", function(d) {
    d3.select(this)
      .style("cursor", "none")
      .style("fill", function(d, i) {
        return colors[this._current]
      })
  })
  .each(function(d, i) {
    this._current = i;
  });

//
d3.select('g')
  .selectAll('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .text(text);


var text = g.selectAll("text")
  .data(pie(data))
  .enter().append("text")
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .attr("dy", "0.35em");

  // d3.selectAll('text-group').on("mouseover", function(d) {
  //   var circleUnderMouse = this;
  //   d3.selectAll('text-group').transition().style('opacity', function() {
  //     return (this === circleUnderMouse) ? 1.0 : 0.5;
  //   });
  // });

// Text
text.append("tspan")
  .attr("x", 0)
  .attr("y", "-0.7em")
  .style("font-weight", "bold")
  .text(d => d.data.name);

// Number
// text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
//     .attr("x", 0)
//     .attr("y", "0.7em")
//     .attr("fill-opacity", 0.7)
//     .text(d => d.data.value.toLocaleString());
