async function jesse() {
  var test;
  d3.json("http://localhost:5000/data").then(data => {
    test = data;
    // setupBubbles()
  })
  await d3.json("http://localhost:5000/data").then(newData => {
    // Selections
    const dateDisplay = d3.select("#timerOptions p"),
      sliderPin = d3.select("#timerOptions footer span"),
      sliderBar = d3.select("#timerOptions footer");

    // Constant Values
    const width = 100,
      height = 100,
      radius = Math.min(width, height) / 2,
      timerSpeed = 250,
      speed1 = 200,
      svgPadding = 25,
      pieTotalSize = width + svgPadding;
      // piesContainerHeight = 500;

    const flattened = newData.map(d => d[Object.keys(d)]).flat();

    const chronologicalData = d3.nest()
      .key(d => d.date).sortKeys(d3.ascending)
      .entries(flattened);

    let allTlds = [];

    flattened.forEach(d => d.all.forEach(d1 => {
      if (!allTlds.includes(d1.tld)) {
        allTlds.push(d1.tld)
      }
    }))

    let allCountries = newData.map(d => Object.keys(d)[0].toUpperCase());

    const countryColorGen = d3.scaleOrdinal()
      .domain(allCountries)
      .range(d3.schemePaired)

    const colorGen = d3.scaleOrdinal()
      .domain(allTlds)
      .range(allTlds.map((...x) => {

        if (((x[x.length - 1].length - 1) / 2) > x[1]) {

          return d3.interpolateCool(1 / ((x[x.length - 1].length - 1) / 2) * x[1]);
        } else {

          return d3.interpolateWarm(1 / ((x[x.length - 1].length - 1) / 2) * x[1] - 1);
        }
      }));

    const formatTime = d3.timeFormat("%B, %Y");

    const arc = d3.arc()
      .innerRadius(radius - 25)
      .outerRadius(radius);

    const pie = d3.pie()
      .value(d => d.percentage)
      .sort(null);

    function arcTween(a) {
      let i = d3.interpolate(this._current, a);
      this._current = i(0);

      return function(t) {
        return arc(i(t));
      };
    }

    function setupLegend() {
      let countriesLegend = d3.select("#countriesLegend").selectAll("li")
        .data(allCountries)
        .enter()
        .append("li");

      countriesLegend
        .append("span")
        .style("background", d => countryColorGen(d))

      countriesLegend
        .append("p")
        .text(d => d)


      let tldsLegend = d3.select("#tldsLegend").selectAll("li")
        .data(allTlds)
        .enter()
        .append("li")

      tldsLegend
        .append("span")
        .style("background", d => colorGen(d))

      tldsLegend
        .append("p")
        .text(d => d)
    }

    var bubbleContainerWidth = 900,
      bubbleContainerHeight = 500;

    var timeline = d3.timeParse('%Y-%m-%d')

    function setupBubbles() {

    var svg = d3
      .select("#bubble")
      .append("svg")
      .attr("height", bubbleContainerHeight)
      .attr("width", bubbleContainerWidth)
      .append("g")
      .attr("transform", `translate(0,0)`);
    // make sure the .domain is bigger or equal to the average value
    // mess with these values to change the shapes
    var radiusScale = d3
      .scaleSqrt()
      .domain([11829, 65040749])
      // change this to change circle size
      .range([0, 100]);

    // Simulate force so stuff goes to the center
    var forceXCombine = d3
      .forceX(bubbleContainerWidth / 2)
      .strength(0.05);

    var forceXSplit = d3.forceX(d => {
      if (d[Object.keys(d)[0]][0].country == "com") {
        return bubbleContainerWidth / 4;
      } else {
        return bubbleContainerWidth / 1.5;
      }
    }).strength(.05);

    var forceY = d3
      .forceY(d => bubbleContainerHeight / 4)
      .strength(0.05);

    var sim = d3
      .forceSimulation()
      .force("x", forceXCombine)
      .force("y", forceY)
      .force("collide", d3.forceCollide(d => radiusScale(d[Object.keys(d)[0]][0].total)));



    var circles = svg
      .selectAll("g")
      .data(test)
      .enter()
      .append("g")
      .append("circle")
      .attr("data-interact", "toolTip")
      .attr("class", d => d[Object.keys(d)][0].country)
      .attr("r", d => radiusScale(d[Object.keys(d)][0].total))
      .style("fill", d => countryColorGen(Object.keys(d)))

    var circlesName = svg
      .selectAll("g")
      .append("text")
      .attr("fill", "White")
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text(d => `.${d[Object.keys(d)[0]][0].country}`);

    sim.nodes(test).on("tick", ticked);

    function ticked() {
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      circlesName
        .attr("dx", d => d.x)
        .attr("dy", d => d.y - 15);
    }

}

setupBubbles()

    function setup() {
      sliderPin.style("left", "0%");
      dateDisplay.text(formatTime(new Date(chronologicalData[0].key)));

      let pies = d3.select("#pieCharts section")
        .selectAll("svg")
        .data(newData)
        .enter()
        .append("svg")
        .attr("class", d => Object.keys(d), true)
        .attr("width", width)
        .attr("height", height)
        .each(convertToAbsolute)
        .style("position", "absolute")
        .style("border", "solid 1px black")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      pies.each((d, i, el) => {
        d3.select(el[i])
          .append("text")
          .attr("fill", "white")
          .text(Object.keys(d));
        d3.select(el[i].parentElement)
          // .classed(Object.keys(d), true)
          .attr("data-firstDate", d[Object.keys(d)][0].date)
      })


      pies.each((d, i, el) => {
        console.log("foaiwje", d)
        let country = Object.keys(d),
          data = d[country][0].all;

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
            let ii = d3.interpolate(d.startAngle + 0.1, d.endAngle);

            return function(t) {
              d.endAngle = ii(t);
              return arc(d);
            }
          })
      })

      let allPaths = d3.selectAll("#pieCharts svg path"),
        count = 0;

        // d3.select("#pieCharts section").style("height", "-webkit-fill-available")

      function loadingCompleted() {
        count++;

        if (allPaths._groups[0].length === count) {
          setTimeout(() => {
            d3.selectAll("#pieCharts svg")
              // .style("position", "absolute")
              .on("mouseover", d => highlightCountry(d, true))
              .on("mouseout", d => highlightCountry(d, false))
              .on("click", switchMainPie)
              // .style("position", "absolute")


            setupLegend()
            timerSection()
          }, 1000)

        }
      }

        // .style("top", 0)

      // d3.selectAll("svg.mainPie ~ svg")
      //   .style("left", (d, i, el) => {
      //     if (parseInt(el[i].style.left) == 0) {
      //       let l = parseInt(el[i].previousElementSibling.style.left);
      //       let b = el[i].previousElementSibling.style.top;
      //
      //       d3.select(el[i]).style("top", b)
      //       return `${l + pieTotalSize}`
      //     }
      //
      //     return `${parseInt(el[i].style.left) - pieTotalSize}px`
      //   })
    }

    setup()

    function convertToAbsolute(d, i, el) {
        // console.log(el[i])
        d3.select("#pieCharts section svg.nl")
          .style("position", "absolute")
          .style("top", `-${pieTotalSize}px`)
          .classed("mainPie", true)
          
        let containerHeight = d3.select("#pieCharts section").style("height");
        d3.select("#pieCharts section").style("height", containerHeight);

        let parentTop = el[0].parentElement.getBoundingClientRect().top;

        let top = el[i].getBoundingClientRect().top - parentTop;
        let left = el[i].getBoundingClientRect().left

        console.log(top, parentTop, top - parentTop)
        if (Object.keys(d)[0] !== "nl") {
          // d3.select(el[i])
          //   .style("position", "absolute")
          //   .style("top", `-${pieTotalSize}px`)
          //   // .style("left", "0")
          //   .classed("mainPie", true)
          d3.select(el[i])
            .style("top", `${top}px`)
            .style("left", `${left}px`)
          }
        // } else {
        //   d3.select(el[i])
        //     .style("top", `${top}px`)
        //     .style("left", `${left}px`)
        //     // .style("position", "absolute")
        // }
    }

    function matcher(index) {

      dateDisplay.text(formatTime(new Date(chronologicalData[index].key)))

      chronologicalData[index].values.forEach(cdv => {
        d3.selectAll("#pieCharts section svg")
          .each((d, i, el) => {
            if (el[i].classList.contains(cdv.country)) {
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
      let firstMouseX,
        firstPinX,
        rightBoundary,
        pinWidth,
        timer,
        leftBoundary = 0,
        stepSize = 100 / chronologicalData.length,
        steps = chronologicalData.map((d, i) => Number((i * stepSize).toFixed(3)));

      sliderBar.selectAll("div")
        .data(chronologicalData)
        .enter()
        .append("div")
        .style("left", (d, i) => `${i * stepSize}%`);

      function playTimer() {
        let playBtn = d3.event.currentTarget,
          index = parseInt(sliderPin.attr("data-index"));

        if (index < chronologicalData.length - 1) {

          if (!playBtn.classList.contains("playing")) {

            timer = setInterval(() => {

              index++;

              matcher(index);

              sliderPin
                .style("left", `${steps[index]}%`)
                .attr("data-index", index)

              if (index == chronologicalData.length - 1) {

                clearInterval(timer);

                playBtn.classList.remove("playing")
              }
            }, timerSpeed);

          } else {

            clearInterval(timer)
          }

          playBtn.classList.toggle("playing")
        }
      }



      d3.select("#timerOptions button").on("click", playTimer);

      sliderPin.on("mousedown", () => {

        firstMouseX = d3.event.clientX;
        firstPinX = d3.event.target.offsetLeft;
        rightBoundary = parseInt(sliderBar.style("width"));
        pinWidth = parseInt(sliderPin.style("width")) / rightBoundary * 100;

        d3.select("html").style("cursor", "grabbing")

        d3.select(window).on("mousemove", dragging)

        d3.select(window).on("mouseup", () => {
          d3.select("html").style("cursor", "default")

          d3.select(window)
            .on("mousemove", null)
            .on("mouseup", null)

          let index = steps.indexOf(Number(sliderPin.style("left").replace("%", "")));

          sliderPin.attr("data-index", index)

          matcher(index)

        });
      })

      function dragging() {
        let distance = d3.event.clientX - firstMouseX,
          pinLeftX = (firstPinX + distance) / rightBoundary * 100,
          pinRightX = pinLeftX + pinWidth;

        if (pinLeftX <= 0) {

          sliderPin.style("left", "0%");
        } else if (pinLeftX >= steps[steps.length - 1]) {

          sliderPin.style("left", `${steps[steps.length - 1]}%`)
        } else {

          sliderPin.style("left", `${pinLeftX}%`)

          steps.forEach((d, i) => {
            if (pinLeftX > (d - stepSize / 2) && pinLeftX < (d + stepSize / 2)) {

              if (sliderPin.attr("data-index") != i) {
                matcher(i)
              }

              sliderPin
                .style("left", `${d}%`)
                .attr("data-index", i)
            }
          })
        }
      }
    }

    function toolTip() {
      d3.selectAll("[data-interact=toolTip]")
        .on("mouseover", (d, i, el) => {

          console.log(d, i, el)
          let container = d3.select("body")
            .append("div")
            .classed("toolTip", true)
            .style("position", "fixed")
            // .style("top", 0)
            // .style("left", 0)

          d3.select(window).on("mousemove", () => {
            let mouseX = d3.event.clientX;
            let mouseY = d3.event.clientY;
            console.log(mouseX, mouseY)
            container
              .style("top", `${mouseY + 10}px`)
              .style("left", `${mouseX + 10}px`)


          })

          for (let key in d.data) {
            if (key !== "cnt") {

              let val;
              if (key == "tld") {

                val = `.${d.data[key]}`;
                key = key.toUpperCase();

              } else {

                val = d.data[key];
                key = key.replace(key[0], key[0].toUpperCase());
              }

              container.append("p").text(`${key} : ${val}`)
            }
          }

        })
        .on("mouseout", () => {
          d3.select(".toolTip").remove();

          d3.select(window).on("mousemove", null);
        })
    }

    toolTip()

    function updatePie(data, svg) {
      // console.log(svg)
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

      // let p = d3.event.target;
      let country = d3.event.target.classList[0];

      if (country && d3.event.target.nodeName === "path") {

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
      d3.select("#pieCharts section svg.mainPie")
        .classed("mainPie", false)
        .style("left", () => d3.select(d3.event.currentTarget).style("left"))
        .style("top", () => d3.select(d3.event.currentTarget).style("top"))

      d3.select(d3.event.currentTarget)
        .style("top", `-${pieTotalSize}px`)
        .style("left", null)
        .classed("mainPie", true)
    }
  });
}



jesse()
