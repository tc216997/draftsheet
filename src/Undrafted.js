import React from 'react';

import PlayerTable from './PlayerTable'

function Undrafted(props) {
  let players = props.players.slice().filter(p => !p.drafted);

  if (props.position) {
    players = players.filter(p => p.position.includes(props.position));
  }
  players = players.sort((a, b) => {
    //return  a.tier - b.tier ||  b.value - a.value || b.ppg - a.ppg
    //return a.tier - b.tier || a.adp - b.adp || b.value - a.value || b.ppg - a.ppg
    //return b.value - a.value || b.dropoff - a.dropoff || a.tier - b.tier || b.ppg - a.ppg
    return a.tier - b.tier || b.floor - a.floor || b.ceil -a.ceil
  });

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
