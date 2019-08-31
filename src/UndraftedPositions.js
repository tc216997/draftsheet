import React from 'react';

import Undrafted from './Undrafted'

function UndraftedPositions(props) {
  const fields = ['meanValue', 'name', 'top12', 'played', 'team', 'total_yards'] ;

  return (
    <div className='col-md-6 col-sm-12 hidden-xs'>
      <div className='aid-title'>
        <i className='fa fa-signal'></i> Top Picks By Position
      </div>

      <div className='col-sm-6'>
        <span className="col-sm-12 position-title">Runningbacks</span>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={20}
          position='RB'
        />
      </div>

      <div className='col-sm-6'>
        <span className="col-sm-12 position-title">Wide Receivers</span>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={20}
          position='WR'
        />
      </div>

      <div className='col-sm-6'>
        <span className="col-sm-12 position-title">Quarterbacks</span>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={10}
          position='QB'
        />
      </div>

      <div className='col-sm-6'>
        <span className="col-sm-12 position-title">Tightends</span>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={10}
          position='TE'
        />
      </div>

    </div>
  )
}

UndraftedPositions.propTypes = {
  draft: React.PropTypes.func.isRequired,
  players: React.PropTypes.array.isRequired,
};

export default UndraftedPositions
