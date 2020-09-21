import React, { Component } from 'react';
import UndraftedAll from './UndraftedAll'
import UndraftedPositions from './UndraftedPositions'
import Drafted from './Drafted'
const yahoo = require('./yahoo.json')
const sleeper = require('./sleeper.json')


class DraftBoard extends Component {
    constructor() {
      super();

      this.state = {
          players: [],
          filteredPlayers: [],
          isLoading: true,
          currentDraft: 0,
          fetchError: null,
          format: 'yahoo',
          query: '',
      };
    }

    componentDidMount() {
      this.getPlayers(this.state.format)
    }

    getPlayers(format) {
      const self = this;
      self.setState({
        players: (format === 'yahoo')? yahoo:sleeper,
        filteredPlayers: (format === 'yahoo')? yahoo:sleeper,
        isLoading: false,
        format: format,
        query: '',
      });
    }

    searchPlayers(query) {
      let players = this.state.players.filter(player =>
        player.player.toUpperCase().includes(query.toUpperCase())
      );

      this.setState({
        filteredPlayers: players,
        query: query,
      });
    }

    draft(player) {
      const players = this.state.players.slice();
      const index = players.indexOf(player);
      if (~index) {
          players[index].drafted = this.state.currentDraft + 1;
      }

      this.setState({
          currentDraft: this.state.currentDraft + 1,
          players: players,
          filteredPlayers: players,
          query: '',
      });
    }

    undo(currentDraft) {
      if(currentDraft === 0) {
        return
      }

      const players = this.state.players.slice();
      const index = players.findIndex(p => p.drafted === currentDraft);
      if (~index) {
          players[index].drafted = null;
      }

      this.setState({
          currentDraft: this.state.currentDraft - 1,
          players: players,
      });
    }

    reset() {
      const players = this.state.players.slice();
      players.map((player, i) => {
          return player.drafted = null;
      });

      this.setState({
          currentDraft: 0,
          players: players,
      });
    }

    render() {
      if (this.state.isLoading) {
        return (<div className='row'>Loading...</div>)
      }

      if (this.state.fetchError) {
        return (<div className='row'>error fetching rankings...</div>)
      }
      
      return (
        <div className='row'>
          <UndraftedAll
            players={ this.state.filteredPlayers }
            draft={ (p) => this.draft(p) }
            fetch={ (e) => this.getPlayers(e.target.value) }
            search={ (e) => this.searchPlayers(e.target.value) }
            format={ this.state.format }
            query={ this.state.query }
          />
          <Drafted
            currentDraft={ this.state.currentDraft }
            players={ this.state.players }
            undo={ (c) => this.undo(c) }
            reset={ () => this.reset() }
          /> 
          <UndraftedPositions
            players={ this.state.players }
            draft={(p) => this.draft(p)}
          />                  
        </div>
        
      );
    }
}

export default DraftBoard;
