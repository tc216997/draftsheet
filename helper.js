const path = require('path');
const csv = require('csv-parser');
const fs = require('fs')
const fuzzy = require('fuzzy-string-matching');
let fileName = ['sleeperadp.csv', 'yahooadp.csv']


fileName.map((file,index) => {
  let rankings = []
    fs.createReadStream(path.join(__dirname, file))
    .pipe(csv())
    .on('data', (data)=> {
      let obj = {}
      obj.name = data.name
      obj.rank = data.rank
      obj.adp = data.adp
      rankings.push(obj)
    })
    .on('end', () => {
      fs.writeFile(`${file.split('.')[0]}.json`, JSON.stringify(rankings, null, 2), (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('done!')
        }
      }) 
    });  
})