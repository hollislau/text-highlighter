const highlighter = require('./highlighter');

const wordList = [
  {
    color: 'red',
    words: ['action-oriented', 'alarming', 'candidates', 'leave', 'do not want']
  },
  {
    color: 'green',
    words: ['adorable', 'creative', 'love', 'new technology']
  },
  {
    color: 'blue',
    words: ['an adorable puppy', 'aggressive', 'arm', 'very unlikely']
  },
  {
    color: 'purple',
    words: ['do not cross', 'log file', 'our team', 'radio']
  },
  {
    color: 'grey',
    words: ['very unlikely to leave', 'will deliver new']
  }
];
const divOne = document.getElementById('container-one');
const divTwo = document.getElementById('container-two');
const divThree = document.getElementById('container-three');
const highlighterOne = highlighter(divOne, wordList);
const highlighterTwo = highlighter(divTwo, wordList);
const highlighterThree = highlighter(divThree, wordList);

highlighterOne.highlight('First string with candidates, love, and candidates in the middle.');
highlighterTwo.highlight('Second string with an arm, radio, radio, and will deliver new in the middle.');
highlighterThree.highlight('No matches here.');
