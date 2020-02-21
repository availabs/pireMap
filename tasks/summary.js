var d3 = require("d3");
var fs = require("fs");



var sample = "./NYS_Counties_Storm_PA_assessment_2019.csv"
         
fs.readFile(sample, "utf8", function(error, rawData) {
  let fixable = 0;
  let data = d3.csvParse(rawData);
  console.log('data-------', data)
  let totals = data.reduce((out, curr) => {
    let county = curr.county.trim()
    if(!out[county]){
       out[county] = {
          county: county,
          reports: 0,
          local_estimate_total: 0,
          fema_validated_total: 0
       }
    }
    //console.log(curr.local_estimate.replace(/,/g, '').replace(/\$/g,''), curr.local_estimate)
    
    let local_estimate = + curr.local_estimate.replace(/,/g, '').replace(/\$/g,'')
    let fema_validated = + curr.fema_validated.replace(/,/g, '').replace(/\$/g,'')

    out[county].reports++;
    out[county].local_estimate_total += isNaN(local_estimate) ? 0 : local_estimate;
    out[county].fema_validated_total += isNaN(fema_validated) ? 0 : fema_validated;
    return out;
  },{})

  console.log(totals)
 });