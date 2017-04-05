module.exports = function (div, wordList) {
  const highlighter = {
    highlight: function (str) {
      var newP = document.createElement('p');
      var foundArr = [];
      var endStrIndex;
      var endStr;
      var endPText;

      div.appendChild(newP);

      for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < wordList[i].words.length; j++) {
          let currentWord = wordList[i].words[j];
          let foundIndex = str.indexOf(currentWord);

          while (foundIndex > -1) {
            let endIndex = foundIndex + currentWord.length;

            foundArr.push({
              word: currentWord,
              startIndex: foundIndex,
              endIndex: endIndex,
              color: wordList[i].color,
              priority: wordList[i]
            });

            foundIndex = str.indexOf(currentWord, endIndex);
          }
        }
      }

      foundArr.sort((a, b) => {
        return a.startIndex - b.startIndex;
      });

      for (let i = 0; i < foundArr.length; i++) {
        let leadStrIndex = foundArr[i - 1] ? foundArr[i - 1].endIndex : 0;
        let leadStr = str.slice(leadStrIndex, foundArr[i].startIndex);
        let newPText = document.createTextNode(leadStr);
        let newSpanText = document.createTextNode(foundArr[i].word);
        let newSpan = document.createElement('span');

        newP.appendChild(newPText);
        newSpan.appendChild(newSpanText);
        newSpan.className = foundArr[i].color;
        newP.appendChild(newSpan);
      }

      endStrIndex = foundArr.length ? foundArr[foundArr.length - 1].endIndex : 0;
      endStr = str.slice(endStrIndex);
      endPText = document.createTextNode(endStr);
      div.firstChild.appendChild(endPText);
    }
  };

  return Object.create(highlighter);
};
