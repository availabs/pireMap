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


var sample = "./YearsAll_3.json"
         
fs.readFile(sample, "utf8", function(error, rawData) {
    let fullData = JSON.parse(rawData)
    
    let sortable = Object.keys(fullData).map(year => {
        return fullData[year].temp.map((d,i) => {
          return {
            lat: fullData[year].lat[i],
            lon: fullData[year].lon[i],
            d
          }
        })
        .sort(sortFlat)
        .map(d => +(d.d.toFixed(2)) )
    })

    console.log(JSON.stringify(sortable))
  
});