/*{
  "type": "FeatureCollection",
  "features": [
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          5.02,
          32.47
        ]
      },
      "properties": {
        "colora": "#CCE9F2",
        "colorc": "#4393C3",
        "code": "morc016",
        "significance": 0.013553728,
        "numSamples": 91,
        "tMann": 21.80575,
        "colorb": "#C9ECF4",
        "alt": 229,
        "synchrony": 0.376756757,
        "pRann": 62.36667568,
        "change": 0.056865554
      }
    },
*/

     
let data = require('./geojson.json')

let properties = data.features.map(d => d.properties)

let coloraArray = {}
  properties.map(d => {
    coloraArray[d.colora] ?
    coloraArray[d.colora].push(d.synchrony) :
    coloraArray[d.colora] = [d.synchrony]})

let synchrony =Object.values(coloraArray).map(d => Math.max(...d))
let colorakey = Object.keys(coloraArray)


let colorbArray = {}

  properties.map(d => {
    colorbArray[d.colorb] ?
    colorbArray[d.colorb].push(d.change) :
    colorbArray[d.colorb] = [d.change]})

let change =Object.values(colorbArray).map(d => Math.max(...d))
let colorbkey = Object.keys(colorbArray)


let colorcArray = {}

  properties.map(d => {
    colorcArray[d.colorc] ?
    colorcArray[d.colorc].push(d.significance) :
    colorcArray[d.colorc] = [d.significance]})

 //Data[properties.colora].push(properties.synchrony)
let significance =Object.values(colorcArray).map(d => Math.max(...d))
let colorckey = Object.keys(colorcArray)

let allColorC = properties.map(d => d.colorc)

/*
console.log('colora:', JSON.stringify(colorakey), JSON.stringify(synchrony), 'colorb:', JSON.stringify(colorbkey), JSON.stringify(change),  'colorc:', JSON.stringify(colorckey), JSON.stringify(significance)  ) */


console.log('allColorC', JSON.stringify(allColorC))




