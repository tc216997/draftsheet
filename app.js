
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs')
const fuzzy = require('fuzzy-string-matching');
const request = require('request');
let url = 'https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr'
let fileName = ['sleeper.csv', 'yahoo.csv']
let sleeperAdp = require('./sleeperadp.json')
let yahooAdp = require('./yahooadp.json')
let rbDropoff = 93, wrDropoff = 94, teDropoff = 75, qbDropoff = 75
let vona = 11.4;

request.get(url, (error, response, html) => {
  let object = JSON.parse(html);
  const boris = object.rankings;

  fileName.map((file,index) => {
    let rankings = []
      fs.createReadStream(path.join(__dirname, file))
      .pipe(csv())
      .on('data', (data)=> {
        let obj = {}
        obj.position = data.Position;
        obj.name = data.Name
        obj.rank = data.Rank
        obj.tier = data['ECR Tier']
        obj.adp = "N/A"
        // find boris tier
        boris.map(player => {
          let v = fuzzy(player.name, obj.name)*100
          if (v > 75) {
            // set new tier
            obj.tier = player.tier
          }
        })
        // find adp
        if (file === 'sleeper.csv') {
          sleeperAdp.map(player => {
            let v = fuzzy(player.name, obj.name)*100;
            if (v > 75) {
              obj.adp = parseInt(player.rank);
            }  
          });
        } else {
          yahooAdp.map(player => {
            let v = fuzzy(player.name, obj.name)*100;
            if (v > 75) {
              obj.adp = parseInt(player.rank);
            }
          });
        }
        obj.team = data['Team']
        obj.bye = data.Bye
        obj.erc = data['ECR']
        obj.valueTier = data['Value Tier']
        obj.top12 = data.Elite
        obj.top24 = data.Start
        obj.played = data.Played
        obj.lowValue = data['Low Value']
        obj.meanValue = data['Mean Value']
        obj.highValue = data['High Value']
        obj.ps = parseFloat(data['PS']*100).toFixed(2)
        if (obj.position === 'RB') {
          obj.dropoff = (parseFloat(obj.meanValue) - rbDropoff).toFixed(0);
          rbDropoff = parseFloat(data['PS']*100)
        }
        if (obj.position === 'WR') {
          obj.dropoff = (parseFloat(obj.ps) - wrDropoff).toFixed(0);
          wrDropoff = parseFloat(data['PS']*100)          
        }
        if (obj.position === 'TE') {
          obj.dropoff = (parseFloat(obj.ps) - teDropoff).toFixed(0);
          teDropoff = parseFloat(data['PS']*100)          
        }
        if (obj.position === 'QB') {
          obj.dropoff = (parseFloat(obj.ps) - qbDropoff).toFixed(0);
          qbDropoff = parseFloat(data['PS']*100)          
        }
        rankings.push(obj)
      })
      .on('end', () => {
        rankings.sort((a, b) => {
          return a.adp - b.adp || a.tier - b.tier || b.meanValue - a.meanValue || a.vona - b.vona 
          //return a.tier - b.tier || b.meanValue - a.meanValue || a.vona - b.vona
        })
        
        let count = 1;
        rankings.map(obj => {
          obj.rank = count;
          obj.vona = (obj.meanValue - vona).toFixed(2);
          vona = obj.meanValue;
          count++;
        })

        fs.writeFile(`./src/${file.split('.')[0]}.json`, JSON.stringify(rankings, null, 2), (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log('done!')
          }
        })
        
        
      });  
    })
  

});
