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
const divOne = document.getElementById('container-one');
const divTwo = document.getElementById('container-two');
const divThree = document.getElementById('container-three');
const divFour = document.getElementById('container-four');
const highlighterOne = highlighter(divOne, wordList);
const highlighterTwo = highlighter(divTwo, wordList);
const highlighterThree = highlighter(divThree, wordList);
const highlighterFour = highlighter(divFour, wordList);

highlighterOne.highlight('Aggressive string with a radio, love, a log file, and another radio is creative!');
highlighterTwo.highlight('I do not want new technology; our team will deliver new, action-oriented candidates. Also, an army of farm animals is alarming but charming, if you have a strong arm?');
highlighterThree.highlight('Nothing to see here.');
highlighterFour.highlight('We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.');
