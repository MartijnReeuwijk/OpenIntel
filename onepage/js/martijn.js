console.log("Log is voor noobs");
var data = [
  {
    name: "at",
    value: 255255
  },
  {
    name: "de",
    value: 197142
  },
  {
    name: "com",
    value: 132524
  },
  {
    name: "eu",
    value: 42368
  },
  {
    name: "net",
    value: 85951
  },
  {
    name: "biz",
    value: 24030
  },
  {
    name: "org",
    value: 9480
  },
  {
    name: "info",
    value: 85951
  }
];
var text = "";

var width = 300;
var height = 300;
var thickness = 75;
var duration = 750;

var radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3
  .selectAll("#chart")
  .append("svg")
  .attr("class", "pie")
  .attr("width", width)
  .attr("height", height);

var g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arc = d3
  .arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

var pie = d3
  .pie()
  .value(function(d) {
    return d.value;
  })
  // .on("load", function(d) {
  //     .attr("class", `${d.data.name}`)
  // })
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
];
var mouseover = "#F4EB8A";

var path = g
  .selectAll("path")
  .data(pie(data))
  .enter()
  .append("g")
  // .attr("class", "text-group")

  // Add classes based on colour
  // Check based onon the !class
  // Make color muted
  .on("mouseover", function(d) {
    let g = d3
      .select(this)
      .style("cursor", "pointer")
      .style("fill", function(d, i) {
        return colors[this._current];
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
      .attr("text-anchor", "middle")
      .attr("dy", "-1.2em");

    g.append("text")
      .attr("class", "value-text")
      .text(`${d.data.value}`)
      .attr("text-anchor", "middle")
      .attr("dy", ".6em");

    // select all not selected
  })

  .on("mouseout", function(d) {
    d3.select(this)
      .style("cursor", "none")
      .style("fill", function(d, i) {
        return colors[i];
      })
      .select(".text-group")
      .remove();
  })

  .append("path")
  .attr("d", arc)
  .style("fill", function(d, i) {
    return colors[i];
  })

  .on("mouseover", function(d) {
    d3.select(this)
      .style("cursor", "pointer")
      .style("fill", mouseover);
  })

  .on("mouseout", function(d) {
    d3.select(this)
      .style("cursor", "none")
      .style("fill", function(d, i) {
        return colors[this._current];
      });
  })
  .each(function(d, i) {
    this._current = i;
  });

//
d3.select("g")
  .selectAll("text")
  .attr("text-anchor", "middle")
  .attr("dy", ".35em")
  .text(text);

var text = g
  .selectAll("text")
  .data(pie(data))
  .enter()
  .append("text")
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .attr("dy", "0.35em");

// Text
text
  .append("tspan")
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

async function drawcircle() {
  await d3.json("http://localhost:3000/data").then(data => {
    newData = data;
    // console.log(newData);
  });

  // .then(results => JSON.parse(results))
  var width = 700,
    height = 700;

  var svg = d3
    .select("#bubble")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)");
  // make sure the .domain is bigger or equal to the average value
  // mess with these values to change the shapes
  var radiusScale = d3
    .scaleSqrt()
    .domain([10000, 6500000])
    .range([10, 100]);

  // Simulate force so stuff goes to the center
  var forceX = d3
    .forceX(forcex => {
      return width / 2;
    })
    .strength(0.05);

  var forceY = d3
    .forceY(forcey => {
      return height / 2;
    })
    .strength(0.05);

  // possisions
  var sim = d3
    .forceSimulation()
    .force("x", forceX)
    .force("y", forceY)
    // collide staat aan de radius
    .force(
      "collide",
      d3.forceCollide(d => {
        return radiusScale(d[Object.keys(d)[0]][0].total);
      })
    );

  var circles = svg
    .selectAll("g")
    .data(newData)
    .enter()
    .append("g")
    .append("circle")
    .attr("class", "TLD")
    .attr("r", d => {
      return radiusScale(d[Object.keys(d)][0].total);
    })
    // change circles colours
    .style("fill", function(d, i) {
      return colors[i];
    })

    // .attr("cx", 100)
    // .attr("cy", 300)
    // click function
    .on("click", d => {
      console.log(d);
    })

    // mouse events
    // Select hover is a bit of a bitch fix this maybe?
    // .on("mouseover", function(d) {
    //   d3.select(this).style("fill", mouseover);
    // })
    // .on("mouseout", function(d) {
    //   d3.select(this).style("fill", function(d, i) {
    //     return colors[this._current];
    //   });
    // });

  // Show label van de data Number
  // refactor this so its just positioning on a G instead of 2x on a text
  var circlesValue = svg
    .selectAll("g")
    .append("text")
    .attr("fill", "White")
    .attr("text-anchor", "middle")
    .style("font-weight", "thin")
    .style("pointer-events", "none")
    .text(d => {
      console.log(d);
      return d[Object.keys(d)[0]][0].total;
    });

  // Show label van de data Name
  var circlesName = svg
    .selectAll("g")
    .append("text")
    .attr("fill", "White")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("pointer-events", "none")
    .text(d => {
      console.log(d);
      return "." + d[Object.keys(d)[0]][0].country;
    });

  sim.nodes(newData).on("tick", ticked);

  d3.select("#global").on("click", click => {
    console.log("Werkt");
  });

  // putting shit in the circles
  // maak dit beter
  function ticked() {
    circles
      .attr("cx", d => {
        return d.x;
      })
      .attr("cy", d => {
        return d.y;
      });

    circlesValue
      .attr("dx", d => {
        return d.x;
      })
      .attr("dy", d => {
        return d.y;
      });

    // hier even me fucken voor position
    circlesName
      .attr("dx", d => {
        return d.x;
      })
      .attr("dy", d => {
        return d.y - 15;
      });
  }

  // });
}
drawcircle();
