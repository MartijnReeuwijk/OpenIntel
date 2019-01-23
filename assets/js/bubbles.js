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
// var mouseover = "#F4EB8A";
async function drawcircle() {
  await d3.json("https://datavisualfudge.herokuapp.com/data").then(data => {
    newData = data;
  });

  var bubbleContainerWidth = 500,
    bubbleContainerHeight = 500;
  // var compair = #bubble.svg
  var timeline = d3.timeParse('%Y-%m-%d')

  var svg = d3
    .select("#bubble")
    .append("svg")
    .attr("height", bubbleContainerHeight)
    .attr("width", bubbleContainerWidth)
    .append("g")
    .attr("transform", "translate(0,0)");
  // make sure the .domain is bigger or equal to the average value
  // mess with these values to change the shapes
  var radiusScale = d3
    .scaleSqrt()
    .domain([11829, 65040749])
    // change this to change circle size
    .range([0, 200]);

  // Simulate force so stuff goes to the center
  var forceXCombine = d3
    .forceX(bubbleContainerWidth / 2)
    .strength(0.05);
    var forceXSplit = d3
      .forceX(d => {
        if (d[Object.keys(d)[0]][0].country == "com") {
          return bubbleContainerWidth / 4;
        } else {
          return bubbleContainerWidth / 1.5;
        }
      })
      .strength(0.05);

  var forceY = d3
    .forceY(d => {
      return bubbleContainerHeight / 2;
    })
    .strength(0.05);

  // possisions
  var sim = d3
    .forceSimulation()
    .force("x", forceXCombine)
    .force("y", forceY)
    // collide staat aan de radius
    .force(
      "collide",
      d3.forceCollide(d => {
        console.log(d)
        return radiusScale(d[Object.keys(d)[0]][0].total);
      })
    );

function init() {
  var circles = svg
    .selectAll("g")
    .data(newData)
    .enter()
    .append("g")
    .append("circle")
    .attr("data-interact", "toolTip")
    .attr("class", d => {
      return (d[Object.keys(d)][0].country);
    })
    .attr("r", d => {
      console.log(d[Object.keys(d)])
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
      console.log(d)
    });

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
 //  var circlesValue = svg
 //    .selectAll("g")
 //    .append("text")
 //    .attr("fill", "White")
 //    .attr("text-anchor", "middle")
 //    .style("font-weight", "thin")
 //    .style("pointer-events", "none")
 //    .text(d => {
 //      return d3.format(",.2r")(d[Object.keys(d)[0]][0].total)
 // + " TLD's";
 //    });

  // Show label van de data Name
  var circlesName = svg
    .selectAll("g")
    .append("text")
    .attr("fill", "White")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("pointer-events", "none")
    .text(d => {
      return "." + d[Object.keys(d)[0]][0].country;
    });

  sim.nodes(newData).on("tick", ticked);

  d3.select("#global").on("click", click => {
    sim
    .force("x", forceXSplit
    .strength(0.05))
    .alphaTarget(0.5)
    .restart()
  });

  d3.select("#combine").on("click", click => {
    sim
    .force("x", forceXCombine
    .strength(0.05))
    .alphaTarget(0.5)
    .restart()
  });


// some tests
  // var comCircle = svg
  //   .selectAll("#bubble >svg > g > g > circle")
  // d3.select("#compair")
  // .data(newData)
  // // .enter()
  // .on("click", d => {
  //   if ( comCircle.className !== "com") {
  //     // console.log(this);
  //     console.log(comCircle);
  //     console.log(comCircle.className);
  //     console.log("niet .com");
  //  }
  //  else{
  //    console.log("wel.com");
  //  }
  // });



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

    // circlesValue
    //   .attr("dx", d => {
    //     return d.x;
    //   })
    //   .attr("dy", d => {
    //     return d.y;
    //   });

    // hier even me fucken voor position
    circlesName
      .attr("dx", d => {
        return d.x;
      })
      .attr("dy", d => {
        return d.y + 150;
      });
  }
}

init()
  // });
}
drawcircle();
