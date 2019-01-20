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


d3.shuffle(allTlds)

var colorGen = d3.scaleOrdinal()
  .domain(allTlds)
  .range(allTlds.map((...x) =>  {

    if (((x[x.length - 1].length - 1) / 2) > x[1]) {

      return d3.interpolateCool(1 / ((x[x.length - 1].length - 1) / 2) * x[1])
    } else {

      return d3.interpolateWarm(1 / ((x[x.length - 1].length - 1) / 2) * x[1] - 1)
    }
  }))

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
    .style("position", "absolute")
    .style("bottom", 0)
    .style("left", (d, i) => i * width)
    .style("top", (...arg) => {
      return `${arg[2][0].parentElement.clientHeight - height}px`
    })
    .style("border", "solid 1px black")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  pies.each((d, i, el) => {
    console.log(d)
    d3.select(el[i])
      .append("text")
      .attr("fill", "white")
      .text(Object.keys(d));

    d3.select(el[i].parentElement)
      .classed(Object.keys(d), true)
      .attr("data-firstDate", d[Object.keys(d)][0].date)
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

          timerSection()
      }
    }

  d3.select("#pieCharts svg.nl")
    .classed("mainPie", true)
    .style("top", 0)

  d3.selectAll("svg.mainPie ~ svg")
    .style("left", (...arg) => {
      return `${parseInt(arg[2][arg[1]].style.left) - width}px`
    })
}

setup()

// function runTimer(condition) {
//   let index = 0;
//   let iteration = true;
//
//   let timer = setInterval(() => {
//
//     d3.select("#timerOptions footer span")
//       .style("left", `${(index + 1) * (100 / chronologicalData.length)}%`)
//
//     chronologicalData[index].values.forEach(cdv => {
//
//
//       d3.selectAll("#pieCharts svg")
//         .each((d, i, el) => {
//
//           if (cdv.country == el[i].classList[0]) {
//             if (!el[i].classList.contains("mainPie")) {
//               d3.select(el[i]).classed("animationStarted", true)
//
//               setTimeout(() => d3.select(el[i]).classed("animationStarted", false), 1000)
//
//             }
//
//             updatePie(cdv, el[i])
//           }
//         })
//     });
//
//     index++;
//
//     if (index == chronologicalData.length - 1) {
//       clearInterval(timer);
//     }
//   }, 250)
// }





function matcher(index) {

  chronologicalData[index].values.forEach(cdv => {
    console.log(cdv)
    d3.selectAll("#pieCharts svg")
      .each((d, i, el) => {

        if (cdv.country == el[i].classList[0]) {
          d3.select(el[i]).attr("data-currentDate", cdv.date);

          if (!el[i].classList.contains("mainPie") && el[i].getAttribute("data-firstDate") == cdv.date) {

            d3.select(el[i]).classed("animationStarted", true)

            setTimeout(() => d3.select(el[i]).classed("animationStarted", false), 1000)
          }

          updatePie(cdv, el[i])
        }
      })
  });
}





function timerSection() {
  const sliderPin = d3.select("#timerOptions footer span"),
        sliderBar = d3.select("#timerOptions footer");

  let pinWidth = parseInt(sliderPin.style("width")),
      firstMouseX,
      firstPinX,
      leftBoundary = 0,
      rightBoundary = parseInt(sliderBar.style("width")),
      stepSize = rightBoundary / chronologicalData.length,
      steps = chronologicalData.map((d, i) => Number((i * stepSize).toFixed(3)))

    sliderBar.selectAll("div")
      .data(chronologicalData)
      .enter()
      .append("div")
      .style("left", (d, i) => `${i * stepSize}px`);

    let timer;

    function playTimer() {
      let playBtn = d3.event.currentTarget;
      let index = parseInt(sliderPin.attr("data-index"));

      if (index < chronologicalData.length - 1) {

        if (!playBtn.classList.contains("playing")) {
          timer = setInterval(() => {
            console.log("running");


              index++;

              matcher(index);

              sliderPin
                .style("left", `${steps[index]}px`)
                .attr("data-index", index)

              if (index == chronologicalData.length - 1) {
                clearInterval(timer);
                playBtn.classList.remove("playing")
              }

          }, 1000);
        } else {
          console.log("stopped");
          clearInterval(timer)
        }

        playBtn.classList.toggle("playing")
      }
    }

    d3.select("#timerOptions button").on("click", playTimer);


    sliderPin.on("mousedown", () => {

        firstMouseX = d3.event.clientX;
        firstPinX = d3.event.target.offsetLeft;

        d3.select(window).on("mousemove", dragging)
      })

    d3.select(window).on("mouseup", () => {
      d3.select(window).on("mousemove", null)


      let index = steps.indexOf(Number(sliderPin.style("left").replace("px", "")));
      sliderPin.attr("data-index", index)

      matcher(index)

    });


  function dragging() {
    let distance = d3.event.clientX - firstMouseX,
        pinLeftX = firstPinX + distance,
        pinRightX = pinLeftX + pinWidth;

    if (pinLeftX <= 0) {
      sliderPin.style("left", "0px");

    } else if (pinRightX >= rightBoundary) {
      sliderPin.style("left", `${steps[steps.length - 1]}px`);

    } else {
      sliderPin.style("left", `${pinLeftX}px`);

      steps.forEach((d, i, all) => {

        if (pinLeftX > (d - stepSize / 2) && pinLeftX < (d + stepSize / 2)) {

          if(sliderPin.attr("data-index") != i) {
            matcher(i)
          }

          sliderPin
            .style("left", `${d}px`)
            .attr("data-index", i)
        }
      })
    }
  }
}

// timerSection()




// d3.select("#timerOptions button")
//   .on("click", (...arg) => {
//
//     arg[2][arg[1]].classList.add("playing");
//
//     runTimer()
//   });



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

  // if (clickedPie.classList.contains("animationStarted")) {
  //   d3.select(clickedPie)
  //     .attr("data-started", true)
  //     .classed("animationStarted", false)
  // }


  d3.selectAll("#pieCharts svg.mainPie ~ svg")
    .style("left", (...arg) => {
      return `${parseInt(arg[2][arg[1]].style.left) + width}px`
    })

  d3.select("#pieCharts svg.mainPie")
    .classed("mainPie", false)
    .style("left", (...arg) => {
      if (arg[2][0].parentElement.lastElementChild !== arg[2][0]) {
        return `${parseInt(arg[2][0].nextElementSibling.style.left) - width}px`
      } else {
        return `${parseInt(arg[2][0].previousElementSibling.style.left) + width}px`
      }

    })
    .style("top", (...arg) => {
      // console.log(arg[2][0].parentElement.clientHeight)
      return `${arg[2][0].parentElement.clientHeight - height}px`
    })

  d3.select(clickedPie)
    .classed("mainPie", true)
    .style("top", 0)

  d3.selectAll("svg.mainPie ~ svg")
    .style("left", (...arg) => {
      return `${parseInt(arg[2][arg[1]].style.left) - width}px`
    })
  }
}



jesse()
