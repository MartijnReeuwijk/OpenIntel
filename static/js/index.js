function test() {
  d3.json("http://localhost:3000/data").then(data => {
    console.log(data)
  })
}
