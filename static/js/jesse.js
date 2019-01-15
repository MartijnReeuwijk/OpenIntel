async function jesse() {
let newData;

let current;

await d3.json("http://localhost:3000/data").then(data => {
  newData = data;
  // console.log(data)
});

let flattened = newData.map(d => {
  return d[Object.keys(d)]
}).flat();

let chronologicalData = d3.nest()
  .key(d => d.date).sortKeys(d3.ascending)
  .entries(flattened);

function clock() {
  let i = 0;
  let iteration = true;

  let timer = setInterval(() => {
    let testi = chronologicalData[i].values.find(xx => xx.country == "se");

    i++;

    if (i == chronologicalData.length - 1) {
      clearInterval(timer)
    }

    if (testi && iteration) {

      iteration = false;
      drawPies(testi.all);
      // console.log(testi.all)
    } else if (testi && !iteration) {
      updatePies(testi.all)
      // console.log(testi.all)
    }

    // drawPies(testi.all)
  }, 250)


}

clock()

const width = 500,
      height = 500,
      radius = Math.min(width, height) / 2;



const color = d3.scaleOrdinal(d3.schemeCategory10);

const arc = d3.arc()
  .innerRadius(radius - 75)
  .outerRadius(radius);

  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "solid 1px black")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  const pie = d3.pie()
    .value(d => d.percentage)
    .sort(null);

  // svg.selectAll("path")
  //   .data(pie(data))
  //   .enter()
  //   .append("path")
  //   .attr("d", arc)
  //   .attr("fill", (d, i) => color(i));

  function drawPies(data) {
    // console.log("hello",pie(data))
  // let testingData = pie(data)
    // current = data;

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));
  }

  function updatePies(data) {

    // console.log(pie(data))
    // svg.selectAll('path')
    //   .data(pie(data));



    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);

    svg.selectAll("path")
      .data(pie(data))
      .exit()
      .remove();

    svg.selectAll("path")
      .data(pie(data))
      .transition()
      .attrTween("d", arcTween)
      // .attr("d", arcTween)
      .attr("fill", (d, i) => color(i))

    function arcTween(a) {


      var i = d3.interpolate(this._current, a);
      this._current = i(0);

      return function(t) {
        return arc(i(t));
      };
    }

      //
      // svg.selectAll("path")
      //   .data(pie(data))
      //   .exit()
      //   .remove();


    // svg.selectAll('path')
      // .data(pie(data))
      // .transition()
      // .attr("fill", (d, i) => color(i))
      // .attr("d", arc)

      // svg.selectAll('path')
        // .data(pie(data))
        // .exit()
        // .remove();
  }
}
