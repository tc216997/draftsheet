import React from 'react';

import PlayerTable from './PlayerTable'

function Drafted(props) {
  let players = props.players.slice().filter(p => p.drafted);
  players = players.sort((a, b) => b.drafted - a.drafted);

  return (
    <div className='col-md-4 col-sm-4 col-xs-4 scrollable overall-rankings'>
      <div className='aid-title hidden-xs'>
        <i className='fa fa-history'></i> Draft History
      </div>

      <div className="row form-group">
        <div className="col-md-12">
          <button
            className='btn btn-sm btn-info btn-responsive'
            onClick={()=>props.undo(props.currentDraft)}>
            <i className='fa fa-backward'></i> Undo
          </button>

          <button
            className='pull-right btn btn-sm btn-warning btn-responsive'
            onClick={()=>props.reset()}>
            <i className='fa fa-eject'></i> Reset
          </button>
        </div>
      </div>

      <PlayerTable
        fields={['drafted', 'short', 'floor']}
        players={players}
        disableColor={true}
      />
    </div>
  );
}

Drafted.propTypes = {
  currentDraft: React.PropTypes.number.isRequired,
  reset: React.PropTypes.func.isRequired,
  undo: React.PropTypes.func.isRequired,
  players: React.PropTypes.array.isRequired,
};

export default Drafted
