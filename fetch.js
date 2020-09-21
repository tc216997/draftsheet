const fs = require('fs');
const request = require('request');

getSleeperAdp()

function getSleeperAdp() {
  request('https://fantasydata.com/NFL_Adp/ADP_Read', function (error, response, body) {
    let returned_json = JSON.parse(body);
    let adp = returned_json.Data;
    let filename = 'fantasy_data.json'    
    fs.writeFile(filename, JSON.stringify(adp, null, 4), () => {
      console.log(`finish writing ${filename}`);
    })
  })
}

