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
          <tr className="header-row" key={i}>
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
    if (tier === 'N/A') {
      return 'pointer'
    }
    if (tier % 4 === 0) {
      return 'success pointer'
    }
    if (tier % 4 === 1) {
      return 'info pointer'
    }
    if (tier % 4 === 2) {
      return 'warning pointer'
    }
    if (tier % 4 === 3) {
      return 'danger pointer'
    }
  }

  columns(player) {
    //this.props.fields === 8
    //this
    return this.props.fields.map((f, i) => {
      // if (f === 'tier') {
      //   return <td key={i}><strong>{player[f]}</strong></td>
      // }
      // if (f === 'player') {
      //   return <td key={i}><strong>{player[f]}</strong></td>
      // } 
      // if (f === 'short') {
      //   return <td key={i}><strong>{player[f]}</strong></td>
      // } 
      return <td key={i}><strong>{player[f]}</strong></td>
      
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
