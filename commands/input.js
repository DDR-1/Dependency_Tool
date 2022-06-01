const fs = require("fs");
const { parse } = require("csv-parse");
const { versions } = require("process");
const fetch = require("node-fetch");
var semver = require("semver");

function input(file, dependency) {
  names = [];
  repos = [];
  vers = [];
  depe = [];
  satisfy = [];
  const temp = dependency.split("@");
  let depen = temp[0];
  let ver = temp[1];
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      names.push(row[0]);
      repos.push(row[1]);
    })
    .on("end", function () {
      const run = async (repository) => {
        try {
          const names = await fetch(
            "https://raw.githubusercontent.com/" +
              repository +
              "/main/package.json"
          );
          const textData = await names.text();
          return textData;
        } catch (err) {
          console.log("fetch error", err);
        }
      };
      (async () => {
        for (let i = 0; i < 3; i++) {
          const getText = await run(repos[i].substring(19));
          let packagejson = JSON.parse(getText);
          let de = packagejson.dependencies;
          depe.push(de[depen].substring(1));
          if (semver.gte(de[depen].substring(1), ver)) {
            satisfy.push(true);
          } else {
            satisfy.push(false);
          }
        }
        var values = [];
        for (let i = 0; i < names.length; i++) {
          values.push({
            Names: names[i],
            Repositories: repos[i],
            version: depe[i],
            version_satisfied: satisfy[i],
          });
        }
        console.table(values);
      })();
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}

module.exports = input;
