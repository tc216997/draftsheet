
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
        obj.rank = ''
        obj.tier = data['ECR Tier']
        obj.adp = "N/A"
        obj.pickNumber = 'N/A'
        // find boris tier
        boris.map(player => {
          let a = player.name.replace(/[^a-zA-Z]+/g, '')
          let b = obj.name.replace(/[^a-zA-Z]+/g, '')
          let v = fuzzy(a, b)*100
          if (v > 75) {
            // set new tier
            obj.tier = player.tier
          }
        })
        // find adp
        if (file === 'sleeper.csv') {
          sleeperAdp.map(player => {
            let a = player.name.replace(/[^a-zA-Z]+/g, '')
            let b = obj.name.replace(/[^a-zA-Z]+/g, '')
            let v = fuzzy(a, b)*100
            if (v > 75) {
              obj.adp = parseInt(player.rank);
            }         
          });
        } else {
          yahooAdp.map(player => {
            let a = player.name.replace(/[^a-zA-Z]+/g, '')
            let b = obj.name.replace(/[^a-zA-Z]+/g, '')
            let v = fuzzy(a, b)*100
            if (v > 75) {
              obj.adp = parseInt(player.rank);
            }
          });
        }
        obj.team = data['Team']
        obj.bye = data.Bye
        obj.ecr = data['ECR']
        obj.valueTier = data['Value Tier']
        obj.top12 = data.Elite
        obj.top24 = data.Start
        obj.played = data.Played
        obj.lowValue = data['Low Value']
        obj.meanValue = data['Mean Value']
        obj.highValue = data['High Value']
        obj.stddev = parseFloat(data['StdDev']).toFixed(2)
        obj.ps = parseFloat(data['PS']*100).toFixed(2)
        if (obj.adp !== "N/A") {
          const adp = obj.adp
          const draftRound = Math.floor((adp - 1) / 12) + 1;
          // Get the number of picks at the start of the round
          const numberOfPicksSoFar = (draftRound - 1) * 12;
          // Subtract to get how far along in the round is the pick
          const roundPick = adp - numberOfPicksSoFar;
          obj.pickNumber = `${draftRound}.${roundPick}`
        }        
        rankings.push(obj)
      })
      .on('end', () => {
        /*
        let sorted = rankings.sort((a, b) => {
          //return a.adp - b.adp || a.tier - b.tier || b.meanValue - a.meanValue || a.vona - b.vona 
          //return a.tier - b.tier || b.meanValue - a.meanValue || b.ps - a.ps 
          //return b.meanValue - a.meanValue || b.ps - a.ps
          //return a.adp - b.adp || a.tier - b.tier || b.meanValue - a.meanValue || b.ps - a.ps
          //return  b.meanValue - a.meanValue || a.tier - b.tier || b.played - a.played  || b.top12 - a.top12 || b.top24 - a.top24 
        })
        
        let count = 1;
        let newRankings = []
        sorted.map((obj, index) => {
          let newObj = obj;
          newObj.rank = count;
          newObj.vona = (obj.meanValue - vona).toFixed(2);
          vona = obj.meanValue;
          count++;
          newRankings.push(newObj)
        })
        */

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
