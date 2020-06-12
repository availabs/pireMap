const fs = require('fs');
const readline = require('readline');

let output = {}
async function processLineByLine() {
  const fileStream = fs.createReadStream('allYearTemp_new_full.ndjson');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    //{"attributes":{"FID":27647993,"lon":340,"lat":90,"time":2000,"tas_mn":-13.638697230625898},"geometry":{"x":340,"y":90.00000000000011}}
    let feature = JSON.parse(line)
    if(!output[feature.attributes.time]) {
      output[feature.attributes.time] = []
    }
    output[feature.attributes.time].push({
      lat: +feature.attributes.lat.toFixed(4),
      lon: +feature.attributes.lon,
      d: +feature.attributes.tas_mn.toFixed(2)
    })
    // console.log({
    //   lat:feature.attributes.lat,
    //   lon: feature.attributes.lon,
    //   d: +feature.attributes.tas_mn.toFixed(2)
    // })
  }

  fileStream.on('close',() => {
      console.log(JSON.stringify(output))
  })
}

processLineByLine();