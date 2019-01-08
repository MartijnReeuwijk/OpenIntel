async function jesse() {
let newData;

<<<<<<< HEAD

await d3.json("http://localhost:3000/data").then(rawData => {

  rawData.forEach(chunk => {
    let country = Object.keys(chunk);

    chunk[country].forEach(d => {
      d.date = new Date(parseInt(d.date));
      d.all = {};

      d.values.forEach(dv => {
        let tld = dv.name.split(".").reverse()[1];

        if (!d.all[tld]) {

          d.all[tld] = {
            cnt: 1,
            total: dv.value
          }

        } else {

          d.all[tld].cnt++;
          d.all[tld].total += dv.value;

        }
      })

      let temp = 0;

      for (let t in d.all) {
        temp += d.all[t].total;
      }

      for (let t in d.all) {
        d.all[t].percentage = Number((d.all[t].total / temp * 100).toFixed(2));
      }
    })

    chunk[country] = chunk[country].filter(c => {
      if (c.date.getDate() == 1) {
        return true
      }
    })

    // newData.push(chunk);
  })

  newData = rawData;
})
//       d.date = new Date(parseInt(d.date));
//       d.all = {}
//
//       d.values.forEach(dv => {
//         let tld = dv.name.split(".").reverse()[1]
//
//         if (!d.all[tld]) {
//
//           d.all[tld] = {
//             cnt: 1,
//             total: dv.value
//           }
//         } else {
//
//           d.all[tld].cnt++;
//           d.all[tld].total += dv.value;
//         }
//       })
//
//       let temp = 0;
//
//       for (let t in d.all) {
//         temp += d.all[t].total;
//       }
//
//       for (let t in d.all) {
//         d.all[t].percentage = Number((d.all[t].total / temp * 100).toFixed(2));
//       }
//
//       if (d.date.getDate() == 1) {
//         newData.push(d)
//       }
//
//     });
//   })
// })

// New Data can be used from here
console.log(newData)
=======
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
>>>>>>> e3598500c4a8a7eb85a4707cde46687a783a957e
}
