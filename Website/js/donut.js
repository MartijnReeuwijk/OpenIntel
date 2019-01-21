async function jesse() {
let newData;

let current;
let allTlds = [];

await d3.json("https://localhost:5000/data").then(data => {
  newData = data;
  // console.log(data)
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

const width = 100,
      height = 100,
      radius = Math.min(width, height) / 2
      speed1 = 200;

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
      .transition()
        .delay((d, i) => i * speed1)
        .duration((d, i) => speed1)
        .ease(d3.easeLinear)
        .on("end", loadingCompleted)
      .attrTween('d', function(d) {
        let i = d3.interpolate(d.startAngle+0.1, d.endAngle);

        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        }
      })
    })

    let allPaths = d3.selectAll("#pieCharts svg path");
    let count = 0;

    function loadingCompleted() {
      count++;

      if (allPaths._groups[0].length === count) {
        d3.selectAll("#pieCharts svg")
          .on("mouseover", d => highlightCountry(d, true))
          .on("mouseout", d => highlightCountry(d, false))
          .on("click", switchMainPie)
      }
    }

  d3.select("#pieCharts svg.nl").classed("mainPie", true);
}

setup()

function timerAan() {
  console.log("aan");
  d3.select("#timerAan")
  .style("background-color", "aquamarine");
}


function runTimer() {
  console.log("test");
  let i = 0;
  let iteration = true;

  let timer = setInterval(() => {

    chronologicalData[i].values.forEach(cdv => {

      d3.selectAll("#pieCharts svg")
        .each((d, i, el) => {

          if (cdv.country == el[i].classList[0]) {

            updatePie(cdv, el[i])
          }
        })
    });

    i++;

    if (i == chronologicalData.length - 1) {
      clearInterval(timer);
    }
  }, 250)
}
d3.select("#timerOptions")
.on("click", runTimer)
.on("click", timerAan);

  function arcTween(a) {
    let i = d3.interpolate(this._current, a);
    this._current = i(0);

    return function(t) {
      return arc(i(t));
    };
  }

function updatePie(data, svg) {
  let pieSvg = d3.select(svg).select("g");

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .enter()
    .append("path")
    .attr("class", d => d.data.tld)
    .attr("d", arc)
    .attr("fill", d => colorGen(d.data.tld));

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .exit()
    .remove();

  pieSvg.selectAll("path")
    .data(pie(data.all))
    .transition()
    .attrTween("d", arcTween);

}




function highlightCountry(d, condition) {
  let hoverArc = d3.arc()
    .innerRadius(radius - 30)
    .outerRadius(radius - 5)

  let p = d3.event.target;
  let country = p.classList[0];

  if (country && p.nodeName === "path") {

    let notMatchingCountries = d3.selectAll(`#pieCharts g path:not([class="${country}"])`)

    if (condition) {
      notMatchingCountries
        .style("opacity", "0.5")
        .transition()
        .attr("d", hoverArc);

    } else {
      notMatchingCountries
        .style("opacity", "1")
        .transition()
        .attr("d", arc);
    }
  }
}

function switchMainPie() {
  let clickedPie = d3.event.currentTarget;

  d3.select("#pieCharts svg.mainPie")
    .classed("mainPie", false)
    .call(() => console.log())

  d3.select(clickedPie).classed("mainPie", true)
}
}



jesse()
