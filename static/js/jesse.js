async function jesse() {
let newData;

let current;
let allTlds = [];

await d3.json("http://localhost:3000/data").then(data => {
  newData = data;
  console.log(data)
});

let flattened = newData.map(d => {
  return d[Object.keys(d)]
}).flat();

let chronologicalData = d3.nest()
  .key(d => d.date).sortKeys(d3.ascending)
  .entries(flattened);

flattened.forEach(d => d.all.forEach(d1 => {
  if (!allTlds.includes(d1.tld)) {
    allTlds.push(d1.tld)
  }
}))


var testingShit = d3.scaleOrdinal()
  .domain(allTlds)
  .range(allTlds.map((d, i, a) => {
    console.log(a.length, 1 / (a.length - 1), i)
    return d3.interpolateRainbow(1 / a.length * i)
  }));



// console.log(testingShit("nl"))
// function clock() {
//   let i = 0;
//   let iteration = true;
//
//   let timer = setInterval(() => {
//     let testi = chronologicalData[i].values.find(xx => xx.country == "se");
//
//     i++;
//
//     if (i == chronologicalData.length - 1) {
//       clearInterval(timer)
//     }
//
//     if (testi && iteration) {
//
//       iteration = false;
//       drawPies(testi.all);
//       // console.log(testi.all)
//     } else if (testi && !iteration) {
//       updatePies(testi.all)
//       // console.log(testi.all)
//     }
//
//     // drawPies(testi.all)
//   }, 250)
//
//
// }
//
// clock()
// console.log(flattened)
const width = 100,
      height = 100,
      radius = Math.min(width, height) / 2;

const arc = d3.arc()
  .innerRadius(radius - 25)
  .outerRadius(radius);

const pie = d3.pie()
  .value(d => d.percentage)
  .sort(null);

// const color = d3.scaleOrdinal(d3.schemeCategory10);

function setup() {
  // console.log(newData);

  let pies = d3.select("#pieCharts")
    .data(newData)
    .enter()
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "solid 1px black")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  pies.each((d, i, el) => {
    d3.select(el[i]).append("text").text(Object.keys(d))
  })
  pies.each((d, i, el) => {
    let country = Object.keys(d);
    let data = d[country][0].all;

    // console.log(pie(data))
    // console.log(d[country][0].all, i, el)

    d3.select(el[i]).selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", d => d.data.tld)
      .attr("fill", d => testingShit(d.data.tld))
      .attr("d", arc);
  })
}

setup()

// const color = d3.scaleOrdinal(d3.schemeCategory10);
//
// const arc = d3.arc()
//   .innerRadius(radius - 75)
//   .outerRadius(radius);
//
//   const svg = d3.select("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .style("border", "solid 1px black")
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//
//   const pie = d3.pie()
//     .value(d => d.percentage)
//     .sort(null);
//
//   // svg.selectAll("path")
//   //   .data(pie(data))
//   //   .enter()
//   //   .append("path")
//   //   .attr("d", arc)
//   //   .attr("fill", (d, i) => color(i));
//
//   function drawPies(data) {
//     // console.log("hello",pie(data))
//   // let testingData = pie(data)
//     // current = data;
//
//     svg.selectAll("path")
//       .data(pie(data))
//       .enter()
//       .append("path")
//       .attr("d", arc)
//       .attr("fill", (d, i) => color(i));
//   }
//
//   function updatePies(data) {
//
//     // console.log(pie(data))
//     // svg.selectAll('path')
//     //   .data(pie(data));
//
//
//
//     svg.selectAll("path")
//       .data(pie(data))
//       .enter()
//       .append("path")
//       .attr("fill", (d, i) => color(i))
//       .attr("d", arc);
//
//     svg.selectAll("path")
//       .data(pie(data))
//       .exit()
//       .remove();
//
//     svg.selectAll("path")
//       .data(pie(data))
//       .transition()
//       .attrTween("d", arcTween)
      // .attr("d", arcTween)
//       .attr("fill", (d, i) => color(i))
//
//     function arcTween(a) {
//
//
//       var i = d3.interpolate(this._current, a);
//       this._current = i(0);
//
//       return function(t) {
//         return arc(i(t));
//       };
//     }
//
//       //
//       // svg.selectAll("path")
//       //   .data(pie(data))
//       //   .exit()
//       //   .remove();
//
//
//     // svg.selectAll('path')
//       // .data(pie(data))
//       // .transition()
//       // .attr("fill", (d, i) => color(i))
//       // .attr("d", arc)
//
//       // svg.selectAll('path')
//         // .data(pie(data))
//         // .exit()
//         // .remove();
//   }
}
