const csv = require('csv-parser');
const request = require('request');
const fs = require('fs');
const fantasyData = require('./fantasy_data.json');

//temp extraction
let fprosCount = 0;
let beersheetsCount = 0;
const fprosProjections = [];
const beersheetsRankings = [];
const previousStats = [];
const yahooAdp = [];
const sleeperAdp = [];

// 1. get boris rankings
getBorisTiers()

//2. get beersheet rankings
parseBeerSheets('sleeper_beersheet.csv');
parseBeerSheets('yahoo_beersheet.csv');

//3.get projections
parseProjection('FantasyPros_Fantasy_Football_Projections_QB.csv');
parseProjection('FantasyPros_Fantasy_Football_Projections_RB.csv');
parseProjection('FantasyPros_Fantasy_Football_Projections_WR.csv');
parseProjection('FantasyPros_Fantasy_Football_Projections_TE.csv');
parseProjection('FantasyPros_Fantasy_Football_Projections_K.csv');
parseProjection('FantasyPros_Fantasy_Football_Projections_DST.csv');

//get 2019 stats and merge into 
parse2019Stats('2019.csv');

//get yahooAdp
parseYahooAdp('4for4-adp-table.csv');

//clean up fantasy data
parsefantasyData(fantasyData);

function parsefantasyData(json) {
  //bye_week
  json.map(data => {
    if (data.Rank <= 400) {
      const playerObj = {};
      if (data.Name === 'D.J. Chark Jr.') {
        playerObj.player = 'D.J. Chark'
      } else {
        playerObj.player = data.Name;
      }
      playerObj.bye = data.ByeWeek;
      playerObj.short = data.ShortName;
      playerObj.age = data.Age || 'N/A';
      playerObj.s_adp = Number(((data.AverageDraftPosition + data.AverageDraftPositionPPR) / 2).toFixed(1));
      playerObj.s_ppg = Number(((data.FantasyPoints + data.FantasyPointsPPR) / 2 / 15).toFixed(2));
      sleeperAdp.push(playerObj);
    }
  });
    fs.writeFile(`sleeper_adp.json`, JSON.stringify(sleeperAdp, null, 4), () => {
      console.log(`finish writing sleeper_adp.json`);
    });
}

function parseYahooAdp(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => {
    const playerObj = {};
    playerObj.player = data.Player;
    playerObj.y_adp = parseInt(data['Y!']) || 'N/A';
    yahooAdp.push(playerObj)
  })
  .on('end', () => {
    let filename = 'yahoo_adp'
    fs.writeFile(`${filename}.json`, JSON.stringify(yahooAdp, null, 4), () => {
      console.log(`finish writing ${filename}`);
    });    
  });  
}


function parse2019Stats(csvFile) {
  fs.createReadStream(csvFile)
  .pipe(csv())
  .on('data', (data) => {
    const playerObj = {}
    const splitted = data.name.split(' ');
    splitted.pop();
    const name = splitted.join(' ');
    playerObj.player = name;
    playerObj.stats = parseFloat(data.ppg);
    previousStats.push(playerObj)
  })
  .on('end', () => {
    let filename = '2019_stats'
    fs.writeFile(`${filename}.json`, JSON.stringify(previousStats, null, 4), () => {
      console.log(`finish writing ${filename}`);
    });    
  });
}

function parseProjection(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => {
    if (data.FPTS >= 75) {
      const playerObj = {
      };
      playerObj.player = data.Player;
      playerObj.team = data.Team;
      playerObj.ppg = Number((parseFloat(data.FPTS)/15).toFixed(2));
      playerObj.tier = 26;
      playerObj.position = 'N/A'
      playerObj.short = 'N/A'
      playerObj.value = 0;
      playerObj.adp = 'N/A'
      playerObj.rank = 'N/A'
      playerObj.ceil = Number((parseFloat(data.high)/15).toFixed(2));
      playerObj.floor = Number((parseFloat(data.low)/15).toFixed(2));
      playerObj['2019'] = 0;
      playerObj.diff = 0;
      fprosProjections.push(playerObj)
    }
  })
  .on('end', () => {
    fprosCount += 1
    if (fprosCount === 6) {
      // console.log(fprosProjections.length)
      let filename = 'projections'
      let cleaned = []
      fprosProjections.map(x => {
        if (x.player !== '') {
          cleaned.push(x)
        }
      });
      fs.writeFile(`${filename}.json`, JSON.stringify(cleaned, null, 4), () => {
        console.log(`finish writing ${filename}`);
      });

    }
  })  
}



function parseBeerSheets(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => {
    if (data.Name) {
      const playerObj = {
      };
      playerObj.player = data.Name;
      playerObj.adp = data.ADP;
      playerObj.value = data.PS;
      beersheetsRankings.push(playerObj)
    }
  })
  .on('end', () => {
    beersheetsCount += 1
    let filename = file.split('.')[0]
    fs.writeFile(`${filename}.json`, JSON.stringify(beersheetsRankings, null, 4), () => {
      console.log(`finish writing ${filename}`);
    });
  });
}

function getBorisTiers() {
  request('https://jayzheng-ff-api.herokuapp.com/rankings?format=half_ppr', function (error, response, body) {
    const response_json = JSON.parse(body);
    const tier_rankings = response_json.rankings
    let filename = 'boris.json'
    fs.writeFile(filename, JSON.stringify(tier_rankings, null, 4), () => {
      console.log(`finish writing ${filename}`);
    });
  });
}




