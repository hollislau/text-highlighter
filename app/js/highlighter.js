module.exports = function (div, wordList) {
  const highlighter = {
    highlight: function (str) {
      var foundArr = [];
      var endStrIndex;
      var endStr;
      var endPText;

      for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < wordList[i].words.length; j++) {
          let currentWord = wordList[i].words[j];
          let foundIndex = str.indexOf(currentWord);

          if (foundIndex > -1) {
            foundArr.push({
              word: currentWord,
              startIndex: foundIndex,
              endIndex: foundIndex + currentWord.length,
              color: wordList[i].color,
              priority: wordList[i]
            });
          }
        }
      }

      for (let i = 0; i < foundArr.length; i++) {
        let leadStrIndex = foundArr[i - 1] ? foundArr[i - 1].endIndex : 0;
        let leadStr = str.slice(leadStrIndex, foundArr[i].startIndex);
        let newPText = document.createTextNode(leadStr);
        let newSpanText = document.createTextNode(foundArr[i].word);
        let newP = document.createElement('p');
        let newSpan = document.createElement('span');

        newP.appendChild(newPText);
        newSpan.appendChild(newSpanText);
        newSpan.className = foundArr[i].color;
        div.appendChild(newP);
        newP.appendChild(newSpan);
      }

      endStrIndex = foundArr[foundArr.length - 1].endIndex;
      endStr = str.slice(endStrIndex);
      endPText = document.createTextNode(endStr);
      div.firstChild.appendChild(endPText);
    }
  };

  return Object.create(highlighter);
};
