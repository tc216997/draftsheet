import React from 'react';

import Undrafted from './Undrafted'

function UndraftedAll(props) {
  return (
    <div className='col-md-10 col-sm-12 col-xs-12'>

      <div className="aid-title hidden-xs">
        <i className="fa fa-sort-amount-asc"></i> Overall Rankings
      </div>

      <div className="row form-group">
        
        <div className="form-group col-md-4">
          <select value={ props.format } onChange={ props.fetch } >
            <option value="sleeper">sleeper adp</option>
            <option value="yahoo">yahoo adp</option>
          </select>
        </div>
        <div className="col-md-8">
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
          fields={['tier', 'value', 'name', 'top 12', 'top 24', 'gp', 'touches', 'tgt', 'yards', 'floor', 'proj yds', 'proj tds', 'proj fl']}
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
