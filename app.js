const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cleaner = require("./dataCleaner.js");

const port = 5000;

function readAllData() {
  return new Promise((resolveAll, rejectAll) => {
    let promises = [];

    fs.readdir("data", (err, files) => {
      for (let i = 0; i < files.length; i++) {

        if (path.extname(files[i]) === ".json") {

          promises.push(new Promise((resolve, reject) => {

            fs.readFile(`data/${files[i]}`, (err, result) => {
              resolve({[files[i].split("-")[0]]: JSON.parse(result)})
            });
          }));
        }
      }
      Promise.all(promises).then(data => resolveAll(data));
    })
  })



}


const app = express();

app.use(cors());
app.use(express.static("static"));

app.get("/", (req, res) => res.sendFile("/index.html", {root: __dirname }));

app.get("/data", (req, res) => {
  readAllData().then(data => {
    res.send(cleaner(data))
  });
})

app.listen(port, () => {
  console.log("Listening to port" + port);
});
