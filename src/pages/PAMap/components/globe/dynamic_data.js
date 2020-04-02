let data = {
	"header": {
            "lo1": 0,
            "la1": 90,
            "dx": 2.5,
            "dy": 1.9,
            "nx": 144,
            "ny": 73
     },

      "data": []
              
}

let sizeOfArray = 13824
for(let i = 0; i < sizeOfArray; i++) {
	data.data.push(i)
}

console.log('dynamic data', data)
module.exports =  data