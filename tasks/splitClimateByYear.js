// var d3 = require("d3");
var fs = require("fs");

function sortFlat(ob1,ob2) {
  // sort by lat
  if (ob1.lat < ob2.lat) {
    return 1;
  } else if (ob1.lat > ob2.lat) {
    return -1;
  }
  // if lat is === sort by lon
  if (ob1.lon < ob2.lon) {
    return -1;
  } else if (ob1.lon > ob2.lon) {
    return 1
  } else { // nothing to split them
    return 0;
  }
}

function between(x, min, max) {
  return x >= min && x <= max;
}

var sample = "./allyears_pdsi.json"
         
fs.readFile(sample, "utf8", function(error, rawData) {
    let fullData = JSON.parse(rawData)
    
    let sortable = Object.keys(fullData).forEach(year => {
        //let year = 2
        let thisYear =  fullData[year].map((d,i) => {
          return {
            lat: d.lat,
            lon: d.lon,
            d: d.d
          }
        })
        .sort(sortFlat)
        // .map(d => {
        //   //xconsole.log(d.lat,d.lon)
        //   return +(d.d.toFixed(2))
        // })

        let fullYear = []
        for(let latb = 90; latb >= -90; latb -= 1.8947) {
          for(let lonb = 0; lonb < 360; lonb += 2.5){
            let data = thisYear.filter(d => between(d.lat,latb-0.1, latb+0.1) && between(d.lon,lonb-0.1, lonb+0.1))[0] || {}
            data.d !== undefined ? fullYear.push(data.d) :  fullYear.push(-9)
          }
        }

        //console.log(year, fullYear.length, thisYear.length)

        try {
          fs.writeFileSync(`./pdsi/${year}.json`, JSON.stringify(fullYear))
        } catch (err) {
          console.error(err)
        }
    })
});
