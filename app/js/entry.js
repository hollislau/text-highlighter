const highlighter = require('./highlighter');

const wordList = [
  {
    color: 'red',
    words: ['action-oriented', 'alarming', 'candidates', 'leave', 'do not want']
  },
  {
    color: 'green',
    words: ['adorable', 'creative', 'love', 'new technology', 'groundbreaking']
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

const divList = document.getElementsByClassName('highlighter');
const divArr = [...divList];

const highlighters = divArr.map((div) => {
  return highlighter(div, wordList);
});

highlighters.forEach((highlighter) => {
  highlighter.createInput();
});
