module.exports = function (div, wordList) {
  const highlighter = {
    highlight: function (str) {
      const newP = document.createElement('p');
      const lowerCase = str.toLowerCase();
      const foundArr = [];

      var newPText;

      div.appendChild(newP);

      for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < wordList[i].words.length; j++) {
          let currentWord = wordList[i].words[j];
          let foundIndex = lowerCase.indexOf(currentWord);

          while (foundIndex > -1) {
            let endIndex = foundIndex + currentWord.length - 1;

            if (lowerCase[foundIndex - 1] === ' ' || !lowerCase[foundIndex - 1]) {
              if (lowerCase[endIndex + 1] && lowerCase[endIndex + 1].search(/[,.:;!?]/) > -1) {
                endIndex++;
              }

              if (lowerCase[endIndex + 1] === ' ' || !lowerCase[endIndex + 1]) {
                foundArr.push({
                  startIndex: foundIndex,
                  endIndex: endIndex,
                  color: wordList[i].color,
                  priority: wordList[i]
                });
              }
            }

            foundIndex = lowerCase.indexOf(currentWord, endIndex);
          }
        }
      }

      foundArr.sort((a, b) => {
        return a.startIndex - b.startIndex;
      });

      for (let i = 0; i < foundArr.length; i++) {
        let leadStrIndex = foundArr[i - 1] ? foundArr[i - 1].endIndex + 1 : 0;
        let leadStr = str.slice(leadStrIndex, foundArr[i].startIndex);
        let foundStr = str.slice(foundArr[i].startIndex, foundArr[i].endIndex + 1);
        let newPText = document.createTextNode(leadStr);
        let newSpanText = document.createTextNode(foundStr);
        let newSpan = document.createElement('span');

        newP.appendChild(newPText);
        newSpan.appendChild(newSpanText);
        newSpan.className = foundArr[i].color;
        newP.appendChild(newSpan);
      }

      if (foundArr.length) {
        let lastStrIndex = foundArr[foundArr.length - 1].endIndex + 1;
        let lastStr = str.slice(lastStrIndex);

        newPText = document.createTextNode(lastStr);
      } else {
        newPText = document.createTextNode(str);
      }

      newP.appendChild(newPText);
    }
  };

  return Object.create(highlighter);
};
