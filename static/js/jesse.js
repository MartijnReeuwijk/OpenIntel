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


var colorGen = d3.scaleOrdinal()
  .domain(allTlds)
  .range(allTlds.map((...x) => d3.interpolateMagma(1 / (x[x.length - 1].length - 1) * x[1])));

// console.log(allTlds)

// console.log(colorGen("nl"))
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

function clock() {
  let i = 0;
}

const width = 100,
      height = 100,
      radius = Math.min(width, height) / 2;

const arc = d3.arc()
  .innerRadius(radius - 25)
  .outerRadius(radius);

const pie = d3.pie()
  .value(d => d.percentage)
  .sort(null);

function setup() {
  let pies = d3.select("#pieCharts")
    .selectAll("svg")
    .data(newData)
    .enter()
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "solid 1px black")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // console.log(pies)
  // let pies = d3.select("#pieCharts")
  //   .data(newData)
  //   .enter()
  //   .append("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .style("border", "solid 1px black")
  //   .append("g")
  //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // .append("g")
    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  pies.each((d, i, el) => {
    d3.select(el[i])
      .append("text")
      .text(Object.keys(d));

    d3.select(el[i].parentElement)
      .classed(Object.keys(d), true)
  })

  pies.each((d, i, el) => {

    let country = Object.keys(d);
    let data = d[country][0].all;

    d3.select(el[i]).selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", d => d.data.tld)
      .attr("fill", d => colorGen(d.data.tld))
      .attr("d", arc)
      // .on("mouseover", d => highlightCountry(d, true))
      // .on("mouseout", d => highlightCountry(d, false));
  })

  // d3.selectAll("#pieCharts g path")
  //   .on("mouseover", d => highlightCountry(d, true));
  //
  // d3.selectAll("#pieCharts g path")
  //   .on("mouseout", d => highlightCountry(d, false))
}

setup()

function runTimer() {
  let i = 0;
  let iteration = true;

  let timer = setInterval(() => {

    chronologicalData[i].values.forEach(cdv => {

      d3.selectAll("#pieCharts svg")
        .each((d, i, el) => {

          if (cdv.country == el[i].classList[0]) {
            // console.log("match")
            updatePie(cdv, el[i])
          }
        })
    });


    i++;

    if (i == chronologicalData.length - 1) {
      clearInterval(timer);

      // d3.selectAll("#pieCharts g path")
      //   .on("mouseover", d => highlightCountry(d, true));
      //
      // d3.selectAll("#pieCharts g path")
      //   .on("mouseout", d => highlightCountry(d, false))
    }

    // if (testi && iteration) {
    //
    //   iteration = false;
    //   drawPies(testi.all);
    //   // console.log(testi.all)
    // } else if (testi && !iteration) {
    //   updatePies(testi.all)
    //   // console.log(testi.all)
    // }

    // drawPies(testi.all)
  }, 250)

  // chronologicalData.forEach(cd => cd.values.forEach(cdv => {
  //   d3.selectAll("#pieCharts svg")
  //     .each((d, i, el) => {
  //
  //       if (cdv.country == el[i].classList[0]) {
  //         console.log("match")
  //         updatePie(cdv, el[i])
  //       }
  //     })
  // }))

  // setInterval(() => {
    // console.log(chronologicalData)
  // }, 1000)
}

d3.select("#timerOptions button")
  .on("click", runTimer);

  function arcTween(a) {
    // console.log(a, this._current)
    var i = d3.interpolate(this._current, a);
    this._current = i(0);

    return function(t) {
      return arc(i(t));
    };
  }

function updatePie(data, svg) {
  // console.log(svg)
  let pieSvg = d3.select(svg).select("g");
  // console.log(pieSvg)

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .enter()
    .append("path")
    .attr("class", d => d.data.tld)
    .attr("d", arc)
    .attr("fill", d => colorGen(d.data.tld))
    // .on("mouseover", d => highlightCountry(d, true))
    // .on("mouseout", d => highlightCountry(d, false))

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .exit()
    .remove();

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .transition()
    .attrTween("d", arcTween);

}

// d3.selectAll("#pieCharts g path")
//   .on("mouseover", d => highlightCountry(d, true));
//
// d3.selectAll("#pieCharts g path")
//   .on("mouseout", d => highlightCountry(d, false))

// d3.selectAll("#pieCharts svg")
//   .on("mouseover", testing)

// function highlightCountry(d, condition) {
//   let country = d.data.tld;
//
//   let matchingCountries = d3.selectAll(`#pieCharts g path:not([class=${country}])`);
//
//   if (condition) {
//     matchingCountries.style("opacity", "0.5")
//   } else {
//     matchingCountries.style("opacity", "1")
//   }
// }

// function testing(...arg) {
//   console.log(arg)
// }
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

jesse()
