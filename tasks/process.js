var d3 = require("d3");
var fs = require("fs");

function splitLatLong(llString) {
     if(llString.split(',').length === 2) {
        return llString.split(',').map(d => +d).includes(NaN) ? 
          false :
          llString.split(',').map(d => +d).reverse()
      }
      else if(llString.split(' ').length == 2) {
        return llString.split(' ').map(d => +d).includes(NaN) ? 
          false :
          llString.split(' ').map(d => +d).reverse()
      }

      else if(llString.split('/').length == 2) {
        return llString.split('/').map(d => +d).includes(NaN) ? 
          false :
          llString.split('/').map(d => +d).reverse()
      }
      return false

}

var sample = "./edited_csv.csv"
         
fs.readFile(sample, "utf8", function(error, rawData) {
            let fixable = 0;
            let data = d3.csvParse(rawData);
            // console.log('data-------', data)
            let latLonData = data
              //.filter(d => d['damage_location'].split('4')[1])
              //.filter((d,i) => i < 10)
              .map((d,i) => {
                let ll = ('4' + d['damage_location'].split('4')
                  .filter((d,i) => i > 0)
                  .join('4')).replace(' ', '').replace(/\//g, ',')

                  if(splitLatLong(ll)) {
                    d.ll = splitLatLong(ll)
                  } else if (ll.split('to').length == 2) {
                    let multi = ll.split('to')
                    if(splitLatLong(multi[0]) && splitLatLong(multi[1])){
                      d.geomtery = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.ll = splitLatLong(multi[0])
                    }
                  }else if (ll.split('TO').length == 2) {
                    let multi = ll.split('TO')
                    if(splitLatLong(multi[0]) && splitLatLong(multi[1])){
                      d.geomtery = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.ll = splitLatLong(multi[0])
                    }
                  }else if (ll.split('&').length == 2) {
                    let multi = ll.split('&')
                    if(splitLatLong(multi[0]) && splitLatLong(multi[1])){
                      d.ll = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.geomtery = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.ll = splitLatLong(multi[0])

                    }
                  }
                  else if (ll.split('End:').length == 2) {
                    let multi = ll.split('End:')
                    if(splitLatLong(multi[0]) && splitLatLong(multi[1])){
                      d.ll = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.geomtery = [splitLatLong(multi[0]),splitLatLong(multi[1])]
                      d.ll = splitLatLong(multi[0])

                    }
                  }


                  let local_estimate = +d.local_estimate.replace(/,/g, '').replace(/\$/g,'')
                  //console.log(local_estimate, d.local_estimate)
                  let fema_validated = +d.fema_validated.replace(/,/g, '').replace(/\$/g,'')

                  d.local_estimate = isNaN(local_estimate) ? 0 : local_estimate
                  d.fema_validated = isNaN(fema_validated) ? 0 : fema_validated

                  // d['LOCATION DESCRIPTION'] = d['damage_location'].split('4')
                  // .filter((d,i) => i === 0 || d.indexOf('Rd') == -1)
                  // .join('4')

                if(!d.ll && ll !== '4'){
                  fixable++;
                  // console.log('ll',i, d.ll ? '+' : '-', `${d.local_estimate}\n`, d.ll,ll, '\n' ,d.damage_location, '\n---------------------' )
                }
                return d

              })
              .filter(d => !d.ll)

            //console.log('how many?', data.length, fixable) 
            //console.log('how many with location', latLonData.length) 
            
            let totals = latLonData.reduce((out, curr) => {
              let county = curr.county.trim()
              out.local_estimate += isNaN(curr.local_estimate) ? 0 : curr.local_estimate;
              out.fema_validated += isNaN(curr.fema_validated) ? 0 : curr.fema_validated;


              return out;
            },{local_estimate: 0, fema_validated: 0})

            //console.log(totals)
            console.log('county,site_number,applicant,damage_location,local_estimate,fema_validated')
            latLonData.forEach(d => console.log(`${d.county.trim()}, ${d.site_number},${d.applicant},"${d.damage_location}",${d.local_estimate},${d.fema_validated}`))


            //let latLonDataNew = latLonData.reve

            // turn latLonData into geojson
            let damageMap = {
              type:'FeatureCollection',
              features: []
            }

            // damageMap.features = latLonData.map(d => {


            //   return {
            //     type: 'Feature',
            //     properties: d,
            //     geometry: {
            //       type: 'Point',
            //       coordinates: d.ll
            //     }

            //   }
            // })
            // console.log(JSON.stringify(damageMap))

 });