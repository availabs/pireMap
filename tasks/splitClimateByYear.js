// var d3 = require("d3");
var fs = require("fs");

function sortFlat(ob1,ob2) {
  if (ob1.lat < ob2.lat) {
    return 1;
  } else if (ob1.lat > ob2.lat) {
    return -1;
  }
// Else go to the 2nd item
  if (ob1.lon < ob2.lon) {
    return -1;
  } else if (ob1.lon > ob2.lon) {
    return 1
  } else { // nothing to split them
    return 0;
  }
}


var sample = "./allyears_pdsi.json"
         
fs.readFile(sample, "utf8", function(error, rawData) {
    let fullData = JSON.parse(rawData)
    
    let sortable = Object.keys(fullData).forEach(year => {
        //let year = 1
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
            let data = thisYear.filter(d => Math.round(d.lat) === Math.round(latb) && d.lon === lonb)[0] || {}
            
            data.d ? fullYear.push(data.d) : fullYear.push(-9)
          }
        }

        //console.log(fullYear)

        try {
          fs.writeFileSync(`./pdsi/${year}.json`, JSON.stringify(fullYear))
        } catch (err) {
          console.error(err)
        }
    })
});