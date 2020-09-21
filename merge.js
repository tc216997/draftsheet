const fuzzy = require('fuzzy-string-matching');
const fs = require('fs');
const boris_rankings = require('./boris.json');
const sleeper_rankings = require('./sleeper_beersheet.json');
const yahoo_rankings = require('./yahoo_beersheet.json');
const projections = require('./projections.json')
const previous_stats = require('./2019_stats.json');
const yahoo_adp = require('./yahoo_adp.json');
const sleeper_adp = require('./sleeper_adp.json');

mergeJson(sleeper_rankings, 'sleeper')
mergeJson(yahoo_rankings, 'yahoo')

function mergeJson(array, league){

  //merging boris into projections
  projections.map(x => {
    boris_rankings.map(y => {
      if (fuzzy(x.player, y.name) >= 0.75) {
        x.tier = y.tier;
        x.position = y.position;
        x.rank = y.rank;
      }
    })
  });

  //merging beersheets into projections
  projections.map(x => {
    array.map(y => {
      if (fuzzy(x.player, y.player) >= 0.75) {
        x.value = parseFloat(y.value);
      }
      if (y.player === 'Michael Evans' && x.player === 'Mike Evans') {
        x.adp = parseFloat(y.adp);
        x.value = parseFloat(y.value);
      }
    })
  });

  //2019 stats into projections
  projections.map(x => {
    previous_stats.map(y => {
      if (fuzzy(x.player, y.player) >= 0.75) {
        if(x.player === 'Matt Ryan' && y.player === 'Matt Bryant') {
          return;
        }
        x['2019'] = y.stats;
        if (x.ppg - y.stats > 0) {
          x.diff = `+${(x.ppg - y.stats).toFixed(2)}`;
        } else {
          x.diff = `${(x.ppg - y.stats).toFixed(2)}`;
        }
      }
    })
  });

  //merge yahoo adp into projections
  projections.map(x => {
    yahoo_adp.map(y => {
      if (fuzzy(x.player, y.player) >= 0.75) {
        if (league === 'yahoo') {
          x.adp = y.y_adp;
          if (y.y_adp - x.rank < 0) {
            x.rank_diff = (y.y_adp - x.rank).toFixed(1);
          } else {
            x.rank_diff = `+${(y.y_adp - x.rank).toFixed(1)}`;
          }
        }
      }
    })
  });

  //merge sleeper_adp into projections
  
  projections.map(x => {
    sleeper_adp.map(y => {
      if (fuzzy(x.player, y.player) >= 0.75) {
        x.s_ppg = y.s_ppg;
        x.bye = y.bye;
        x.age = y.age;
        x.short = y.short;
        if (league === 'sleeper') {
          x.adp = y.s_adp;
          if (y.s_adp - x.rank < 0) {
            x.rank_diff = (y.s_adp - x.rank).toFixed(1);
          } else {
            x.rank_diff = `+${(y.s_adp - x.rank).toFixed(1)}`;
          }
        }
      }
    })
  });

  let sorted = projections.sort((a, b) => {
    // return  a.s_adp - b.s_adp || a.tier - b.tier ||  b.value - a.value || b.points - a.points
    return b.value - a.value;
  });

  sorted.map((data, index) => {
    //current position and value
    const current_position = data.position;
    const current_value = data.value;
    let dropoff = 0;
    for(let j = index+1; j < sorted.length-1; j++) {
      //sorted.length-1
      // find the next position value and dropoff
      // break when found or end of item
      if (current_position ===  sorted[j].position) {
        dropoff = Number((current_value - sorted[j].value).toFixed(2));
        data.dropoff = dropoff;
        break;
      }
    }
  })
  if (league === 'sleeper') {  
    fs.writeFile(`./src/sleeper.json`, JSON.stringify(sorted, null, 4), () => {
      console.log(`finish writing sleeper.json`);
    });
  } else {
    fs.writeFile(`./src/yahoo.json`, JSON.stringify(sorted, null, 4), () => {
      console.log(`finish writing yahoo.json`);
    });
  }
}