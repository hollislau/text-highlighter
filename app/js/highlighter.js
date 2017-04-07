module.exports = function (div, wordList) {
  const highlighter = {
    highlight: function (str) {
      const formatted = str.replace(/\s\s+/g, ' ');
      const lowerCase = formatted.toLowerCase();
      const newP = document.createElement('p');
      const foundArr = [];

      var newPText;

      div.appendChild(newP);

      for (let i = 0; i < wordList.length; i++) {
        for (let j = 0; j < wordList[i].words.length; j++) {
          let currentWord = wordList[i].words[j];
          let foundIndex = lowerCase.indexOf(currentWord);

          while (foundIndex > -1) {
            let wordEndIndex = foundIndex + currentWord.length - 1;
            let preWordChar = lowerCase[foundIndex - 1];

            if (preWordChar === ' ' || preWordChar === '(' || !preWordChar) {
              let postWordChar = lowerCase[wordEndIndex + 1];

              if (postWordChar && postWordChar.search(/[,.:;!?]/) > -1) {
                wordEndIndex++;
                postWordChar = lowerCase[wordEndIndex + 1];
              }

              if (postWordChar === ' ' || postWordChar === ')' || !postWordChar) {
                foundArr.push({
                  startIndex: foundIndex,
                  endIndex: wordEndIndex,
                  color: wordList[i].color,
                  priority: wordList[i]
                });
              }
            }

            foundIndex = lowerCase.indexOf(currentWord, wordEndIndex + 1);
          }
        }
      }

      foundArr.sort((a, b) => {
        return a.startIndex - b.startIndex;
      });

      for (let i = 0; i < foundArr.length; i++) {
        let leadStrIndex = foundArr[i - 1] ? foundArr[i - 1].endIndex + 1 : 0;
        let leadStr = formatted.slice(leadStrIndex, foundArr[i].startIndex);
        let foundStr = formatted.slice(foundArr[i].startIndex, foundArr[i].endIndex + 1);
        let newPText = document.createTextNode(leadStr);
        let newSpanText = document.createTextNode(foundStr);
        let newSpan = document.createElement('span');

        newP.appendChild(newPText);
        newSpan.appendChild(newSpanText);
        newSpan.className = foundArr[i].color + ' hover';
        newP.appendChild(newSpan);
      }

      if (foundArr.length) {
        let lastStrIndex = foundArr[foundArr.length - 1].endIndex + 1;
        let lastStr = formatted.slice(lastStrIndex);

        newPText = document.createTextNode(lastStr);
      } else {
        newPText = document.createTextNode(formatted);
      }

      newP.appendChild(newPText);
    }
  };

  return Object.create(highlighter);
};
