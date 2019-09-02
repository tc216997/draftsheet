import React from 'react';

import Undrafted from './Undrafted'

function UndraftedAll(props) {
  return (
    <div className='col-md-9 col-sm-12 col-xs-12'>

      <div className="aid-title hidden-xs">
        <i className="fa fa-sort-amount-asc"></i> Overall Rankings
      </div>

      <div className="row form-group">

        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={props.search}
            value={ props.query }
          />
        </div>

      </div>

      <div className='scrollable overall-rankings'>
        <Undrafted
          fields={['tier','value', 'name', 'proj fl', 'gp', 'proj yds', 'proj tds', 'top 12', 'top 24', 'touches', 'tgt', 'yards', 'tds', 'floor']}
          players={props.players}
          draft={(p) => props.draft(p)}
        />
      </div>

    </div>
  )
}

UndraftedAll.propTypes = {
  players: React.PropTypes.array.isRequired,
  format: React.PropTypes.string.isRequired,
  query: React.PropTypes.string.isRequired,
  search: React.PropTypes.func.isRequired,
  fetch: React.PropTypes.func.isRequired,
};

export default UndraftedAll
