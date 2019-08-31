
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs')
const fuzzy = require('fuzzy-string-matching');
const request = require('request');
let url = 'https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr'
let fileName = ['sleeper.csv', 'yahoo.csv']
let sleeperAdp = require('./sleeperadp.json')
let yahooAdp = require('./yahooadp.json')
const teamRanking = require('./team.json')


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
        obj.team = data['Team']
        // find boris tier
        boris.map(player => {
          let a = player.name.replace(/[^a-zA-Z]+/g, '')
          let b = obj.name.replace(/[^a-zA-Z]+/g, '')
          let v = fuzzy(a, b)*100
          if (v > 75) {
            // set new tier
            obj.tier = parseInt(player.tier)
            obj.rank = player.rank
          }
        })
        // attach team ranking
        teamRanking.map(fo => {
          if (fo.team === obj.team) {
            if (obj.position === 'RB') {
              obj.line_rank = fo.rush_rank
              obj.yds_per_drive = fo.yds_per_drive;
              obj.pts_per_drive = fo.pts_per_drive;
              obj.drives = fo.drives
              obj.nflAverage = ((32.31 * 174 / 10 + 2.04 * 174)/16).toFixed(2)
              obj.teamFp = fo.yds_per_drive * fo.drives / 10 + fo.pts_per_drive * fo.drives
              obj.team_fp_per_week =  `${((fo.yds_per_drive * fo.drives / 10 + fo.pts_per_drive * fo.drives)/16).toFixed(2)}(${obj.nflAverage})`
            } else {
              obj.line_rank = fo.pass_rank
              obj.yds_per_drive = fo.yds_per_drive;
              obj.pts_per_drive = fo.pts_per_drive;
              obj.drives = fo.drives
              obj.nflAverage = ((32.31 * 174 / 10 + 2.04 * 174)/16).toFixed(2)
              obj.teamFp = fo.yds_per_drive * fo.drives / 10 + fo.pts_per_drive * fo.drives
              obj.team_fp_per_week = `${((fo.yds_per_drive * fo.drives / 10 + fo.pts_per_drive * fo.drives)/16).toFixed(2)}(${obj.nflAverage})`     
            }
          }
        });
        if (obj.line_rank === 1) {
          obj.line_rank = obj.line_rank + 'st'
        } else if (obj.line_rank === 2) {
          obj.line_rank = obj.line_rank + 'nd'
        } else if (obj.line_rank === 3) {
          obj.line_rank = obj.line_rank + 'rd'
        } else {
          obj.line_rank = obj.line_rank + 'th'
        }
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
        rankings.map(obj => {
          if (obj.tier === '#N/A') {
            obj.tier = 29;
          }
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
