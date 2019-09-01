import React, { PureComponent } from 'react';

class PlayerTable extends PureComponent {
  rows() {
    let players = this.props.players.slice();
    if (this.props.size) {
      players = players.slice(0, this.props.size);
    }
    return players.map((player, i) => {
      return (
        <tr key={i}
            className={this.trClassName(player.tier, this.props.disableColor, player.position)}
            onClick={() => this.onClick(player)}>
          {this.columns(player)}
        </tr>
      )
    });
  }

  headers() {
    let players = this.props.players.slice();
    if (this.props.size) {
      players = players.slice(0, this.props.size);
    }
    return players.map((player, i) => {
      if (i === 0) {
        return (
          <tr key={i}>
              {this.tableHeader(player)}
          </tr>
        )
      }
    });
  }

  tableHeader(player, fields) {
    return this.props.fields.map((f, i) => {
      return <td key={i}><strong>{f.toUpperCase()}</strong></td>     
    });
  }

  onClick(player) {
    if (this.props.onClick) {
      return this.props.onClick(player);
    }
  }

  trClassName(tier, disable, position) {
    if (disable) {
      return 'pointer'
    }
    if (position === 'RB') {
      return 'success pointer runningback'
    }
    if (position === 'WR') {
      return 'info pointer wide-receiver'
    }
    if (position === 'TE') {
      return 'warning pointer tightend'
    }
    return 'danger pointer quarterback'
  }

  columns(player) {
    //this.props.fields === 8
    //this
    return this.props.fields.map((f, i) => {
      if (f === 'tier') {
        return <td key={i}>Tier {player[f]}</td>
      } else if (f === 'name') {
        return <td key={i}><strong>{player[f]}</strong></td>
      } else if (f === 'total_yards') {
        if (Number(player.total_yards)) {
          return <td key={i}>{player[f]} yds</td>
        } else {
          return <td key={i}>{player[f]}</td>
        }
      } else if (f === 'floor_per_week') {
        if (Number(player.floor_per_week)) {
          return <td key={i}>{player[f]} pts</td>
        } else {
          return <td key={i}>{player[f]}</td>
        }
      }
      else {
        return <td key={i}>{player[f]}</td>
      }        
    });
  }

  render() {
    return (
      <table className='table table-condensed table-hover table-striped'>
        <tbody>
          {this.headers()}
          {this.rows()}
        </tbody>
      </table>
    );
  }
}

PlayerTable.propTypes = {
  players: React.PropTypes.array.isRequired,
  fields: React.PropTypes.array.isRequired,

  onClick: React.PropTypes.func,
  size: React.PropTypes.number,
  disableColor: React.PropTypes.bool,
};

export default PlayerTable
