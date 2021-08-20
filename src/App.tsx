import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Challenge } from './modules/Challenge';
import { DiceFace } from './modules/definitions';

const challenges = require('./data/challenges.json')
const easyChallenges:  {dices: number[]}[] = challenges.slice(0, 50)
console.log('challenges', easyChallenges);
easyChallenges.forEach( (challData, i) => {
  const chall = new Challenge(challData.dices)
  console.log('chall ' + (i + 1), chall.getSolution())
});

// 47 / 45
// const challenge = new Challenge([], [1, 4, 4], [1, 4, 5, 5, 10, 9])
// const challenge = new Challenge([], [2, 4], [2, 5, 5, 5, 5, 9, 11])
// console.log('my chall', 
//   challenge.leftPart,
//   challenge.rightPart,
//   challenge.leftPartTotal, 
//   challenge.rightPartTotal
// )

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
