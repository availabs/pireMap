let data = {
	"header": {
            "lo1": 90,
            "la1": 90,
            "dx": 2.5,
            "dy": 2.5,
            "nx": 144,
            "ny": 73
     },
      "data": []
}
let sizeOfArray = 13824
/*for(let i = sizeOfArray-1; i >= 0; i--)*/
for(let i = 0; i < sizeOfArray; i++) {
	data.data.push(i)
}
console.log('dynamic data', data)
module.exports =  data