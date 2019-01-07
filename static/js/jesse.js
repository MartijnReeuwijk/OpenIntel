async function jesse() {
let newData;

await d3.json("http://localhost:3000/data").then(data => {
  newData = data;
});

const width = 500,
      height = 500,
      radius = Math.min(width, height) / 2;

const pie = d3.pie()
  .value(d => d.total);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);

let testingData = pie(newData[0]["at"][0].all);

  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "solid 1px black")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.selectAll("path")
      .data(testingData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
}
