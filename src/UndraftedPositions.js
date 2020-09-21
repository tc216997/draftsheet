import React from 'react';

import Undrafted from './Undrafted'

function UndraftedPositions(props) {
  const fields = ['short', 'floor'] ;

  return (
    <div className='col-md-12 col-sm-8 hidden-xs'>
      <div className='aid-title'>
        <i className='fa fa-signal'></i> Top Picks By Position
      </div>

      <div className='col-sm-3'>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={12}
          position='RB'
        />
      </div>

      <div className='col-sm-3'>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={12}
          position='WR'
        />
      </div>
      <div className='col-sm-3'>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={12}
          position='QB'
        />
      </div>
      
      <div className='col-sm-3'>
        <Undrafted
          fields={fields}
          players={props.players}
          draft={(p) => props.draft(p)}
          size={12}
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
