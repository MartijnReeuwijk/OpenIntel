console.log("martijn");

function loadData() {
  d3.json("http://localhost:3000/data").then(data => {

// shit code aan passen
    let newdata = []
    let testvalues = []
    let allValuesDayNederland = []
    let allValuesDayNietNederland = []
    let geenduidelijkeLocatie = []

    // get only first element to test
    for (var i = 0; i < 1; i++) {
      newdata.push(data[i])
    }
 // index checker over
    newdata.forEach(data => {
      console.log(data.values)
      // add check on name
      data.values.forEach(values => {
        // includes is onhanding
        // dit is mega kut kan beter moet later fixen / refactor
        if (values.name.includes(".nl")) {
          console.log(values.name);
          allValuesDayNederland.push(values.value)
        }

        if (values.name.includes(".eu") || values.name.includes(".com") || values.name.includes(".net")){
          allValuesDayNietNederland.push(values.value)
        }

         else {
           console.log(values.name);
           allValuesDayNietNederland.push(values.value)
        }
      })
      // console.log(1);
    })

    // dit function zo dat het 2x kan kan je value aan meegeven and parameter
      // pauper code
      var totalHostsNL = allValuesDayNederland.reduce(function(a,b) {
      return (+a)+(+b);
      });

      var totalHostsnietNL = allValuesDayNietNederland.reduce(function(a,b) {
      return (+a)+(+b);
      });

  // totalHostsnietNL / (totalHostsNL+totalHostsnietNL+geenduidelijkeLocatie) * 100
  // totalHostsNL / (totalHostsNL+totalHostsnietNL+geenduidelijkeLocatie) * 100

      console.log(parseInt(  totalHostsnietNL / (totalHostsNL+totalHostsnietNL+geenduidelijkeLocatie) * 100
) + "% niet .nl host");

      console.log(parseInt(totalHostsNL / (totalHostsNL+totalHostsnietNL+geenduidelijkeLocatie) * 100) + "% wel .nl host");


  })
}
loadData()
