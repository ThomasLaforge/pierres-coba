import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Challenge } from './modules/Challenge';
import { DiceFace } from './modules/definitions';

const challenges = require('./data/challenges.json')
const easyChallenges = challenges.slice(0, 15)
console.log('challenges', easyChallenges);
easyChallenges.forEach( (challData : {dices: number[]}) => {
  const chall = new Challenge(challData.dices)
  console.log('chall', chall.getSolution(), chall.getTotal([0,0,0,0,1,5],[0,1]))
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
