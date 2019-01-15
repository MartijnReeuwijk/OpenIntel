module.exports = function (rawData) {

  rawData.forEach(chunk => {
    let country = Object.keys(chunk);

    chunk[country].forEach(d => {
      d.country = country[0];
      d.date = new Date(parseInt(d.date));
      d.all = [];

      d.values.forEach(dv => {
        let tld = dv.name.split(".").reverse()[1];
        let exists = d.all.find(x => x.tld == tld);

        if (!exists) {

          d.all.push({tld: tld, cnt: 1, total: dv.value});
        } else {

          exists.cnt++;
          exists.total += dv.value;
        }
      });

      let temp = 0;

      for (let t in d.all) {
        temp += d.all[t].total;
      }

      for (let t in d.all) {
        d.all[t].percentage = Number((d.all[t].total / temp * 100).toFixed(2));
      }
    });

    chunk[country] = chunk[country].filter(c => {
      if (c.date.getDate() == 1) {
        return true;
      }
    });
  });

  return rawData;
};
