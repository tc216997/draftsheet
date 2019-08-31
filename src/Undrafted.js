import React from 'react';

import PlayerTable from './PlayerTable'

function Undrafted(props) {
  let players = props.players.slice().filter(p => !p.drafted);

  if (props.position) {
    players = players.filter(p => p.position.includes(props.position));
  }

  players = players.sort((a, b) => {
    //return a.adp - b.adp || a.tier - b.tier || b.meanValue - a.meanValue || a.vona - b.vona 
    //return a.tier - b.tier || b.teamFp - a.teamFp || b.meanValue - a.meanValue || b.top12 - a.top12 || b.top24 - a.top24 || b.played - a.played
    //return b.meanValue - a.meanValue || b.ps - a.ps
    //return a.adp - b.adp || a.tier - b.tier || b.meanValue - a.meanValue || b.ps - a.ps
    //return (a.tier - b.tier || a.position_value - b.position_value || b.top12 - a.top12 || b.top24 - a.top24 || b.played - a.played || b.yds_per_week - a.yds_per_week)
    return  a.tier - b.tier ||  b.meanValue - a.meanValue || b.top12 - a.top12 || b.top24 - a.top24 || b.played - a.played || b.yds_per_week - a.yds_per_week
  });

  for (let i = 0; i < players.length; i++) {
    if (players[i].position === 'RB') { 
      for (let j = 0; j < players.length; j++) {
        if (players[j].position === 'RB' && j > i) {
          players[i].vona = ((players[i].meanValue - players[j].meanValue)*-1).toFixed(2);
          players[i].position_value = 1;
          break;
        }
      }
    }
    if (players[i].position === 'WR') {
      for (let j = 0; j < players.length; j++) {
        if (players[j].position === 'WR' && j > i) {
          players[i].vona = ((players[i].meanValue- players[j].meanValue)*-1).toFixed(2);
          players[i].position_value = 2;
          break;
        }
      }      
    }
    if (players[i].position === 'TE') {
      for (let j = 0; j < players.length; j++) {
        if (players[j].position === 'TE' && j > i) {
          players[i].vona = ((players[i].meanValue - players[j].meanValue)*-1).toFixed(2);
          players[i].position_value = 3;
          break;
        }
      }       
    }
    if (players[i].position === 'QB') {
      for (let j = 0; j < players.length; j++) {
        if (players[j].position === 'QB' && j > i) {
          players[i].vona = ((players[i].meanValue - players[j].meanValue)*-1).toFixed(2);
          players[i].position_value = 3;
          break;
        }
      }       
    }
  }


  return (
    <PlayerTable
      size={props.size}
      fields={props.fields}
      players={players}
      onClick={(p) => props.draft(p)}
    />
  );
}


Undrafted.propTypes = {
  draft: React.PropTypes.func.isRequired,
  players: React.PropTypes.array.isRequired,
  fields: React.PropTypes.array.isRequired,

  size: React.PropTypes.number,
  position: React.PropTypes.string,
};

export default Undrafted
