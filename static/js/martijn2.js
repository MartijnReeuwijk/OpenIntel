<<<<<<< HEAD
console.log("test");

console.log("martijn");

function loadData() {
  d3.json("http://localhost:3000/data").then(data => {


    data.forEach(d => {
      let topleveldomein = {}

      // console.log(data.values)
      d.values.forEach(dVal => {
       var tld = dVal.name.split('.')
       var tld = tld[1];
       // console.log(tld)
       if (!topleveldomein[tld]) {
         topleveldomein[tld] = {
           count: 1,
           tldTotal: dVal.value
         }
       } else {
         topleveldomein[tld].count++;
         topleveldomein.total += dVal.value;
       }
      })
      // topleveldomein.forEach(datatdl => {
      //
      //
      // })

      console.log(topleveldomein);
    })
  })
}
=======
// console.log("test");
//
// console.log("martijn");
//
// function loadData() {
//   d3.json("http://localhost:3000/data").then(data => {
//
//
//     data.forEach(d => {
//       let topleveldomein = {}
//
//       // console.log(data.values)
//       d.values.forEach(dVal => {
//        var tld = dVal.name.split('.')
//        var tld = tld[1];
//        // console.log(tld)
//        if (!topleveldomein[tld]) {
//          topleveldomein[tld] = {
//            count: 1,
//            tldTotal: dVal.value
//          }
//        } else {
//          topleveldomein[tld].count++;
//          topleveldomein.total += dVal.value;
//        }
//       })
//       topleveldomein.forEach(datatdl => {
//
//
//       })
//
//       console.log(topleveldomein);
//     })
//   })
// }
>>>>>>> 0b5fec5e02cd8acc0b3b273f433cd4e0c04dde7e
// loadData()
