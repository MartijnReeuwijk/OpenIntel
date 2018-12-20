async function jesse() {
  let newData = [];

  await d3.json("http://localhost:3000/data").then(rawData => {
    rawData.forEach(d => {
      d.date = new Date(parseInt(d.date));
      d.all = {}

      d.values.forEach(dv => {
        let tld = dv.name.split(".").reverse()[1]

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
        d.all[t].percentage = Number(( d.all[t].total / temp * 100 ).toFixed(2));
      }

      if (d.date.getDate() == 1) {
        newData.push(d)
      }

    });
  });

  // New Data can be used from here
  console.log(newData)
}
