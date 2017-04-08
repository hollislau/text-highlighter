function createText(formatted, start, end) {
  var str = formatted.slice(start, end);
  var newText = document.createTextNode(str);

  return newText;
}

function createSpan(formatted, found) {
  var foundStr = formatted.slice(found.startIndex, found.endIndex + 1);
  var newSpanText = document.createTextNode(foundStr);
  var newSpan = document.createElement('span');

  newSpan.appendChild(newSpanText);
  return newSpan;
}

module.exports = function (div, wordList) {
  const highlighter = {
    highlight: function (str) {
      const formatted = str.replace(/\s\s+/g, ' ');
      const lowerCase = formatted.toLowerCase();
      const newP = document.createElement('p');
      const foundArr = [];

      var newPText;
      var lastNestedEndIndex;

      div.appendChild(newP);

      // search formatted string for words in word list
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
                  priority: i
                });
              }
            }

            foundIndex = lowerCase.indexOf(currentWord, wordEndIndex + 1);
          }
        }
      }

      // sort found words by order of appearance
      foundArr.sort((a, b) => {
        if (a.startIndex === b.startIndex) {
          return b.endIndex - a.endIndex;
        }

        return a.startIndex - b.startIndex;
      });

      // render normal text and highlights
      for (let i = 0; i < foundArr.length; i++) {
        let normalStartIndex;
        let normalText;
        let highlight;

        // render any text preceding highlights
        if (foundArr[i - 1]) {
          normalStartIndex = lastNestedEndIndex > foundArr[i - 1].endIndex
            ? lastNestedEndIndex + 1
            : foundArr[i - 1].endIndex + 1;
        } else {
          normalStartIndex = 0;
        }

        normalText = createText(formatted, normalStartIndex, foundArr[i].startIndex);
        newP.appendChild(normalText);

        // render layered highlights
        if (foundArr[i + 1] && foundArr[i + 1].startIndex < foundArr[i].endIndex) {
          let parentHl = document.createElement('span');
          let parentHlStartText = createText(formatted, foundArr[i].startIndex, foundArr[i + 1].startIndex);

          parentHl.appendChild(parentHlStartText);
          newP.appendChild(parentHl);
          // render nested highlights
          if (foundArr[i + 1].endIndex <= foundArr[i].endIndex) {
            let parentHlColor = foundArr[i].color;
            let childHlArr = [];
            let j = 0;
            let parentHlEndText;

            parentHl.className = foundArr[i].color;

            while (foundArr[i + j + 1] && foundArr[i + j + 1].endIndex <= foundArr[i].endIndex) {
              let previous = foundArr[i + j];
              let child = foundArr[i + j + 1];
              let parentHlText = createText(formatted, previous.endIndex + 1, child.startIndex);
              let childHl = createSpan(formatted, child);
              let initChildColor = child.priority < foundArr[i].priority
                ? child.color
                : foundArr[i].color;

              parentHl.appendChild(parentHlText);
              childHl.className = initChildColor;
              parentHl.appendChild(childHl);

              childHl.addEventListener('mouseover', (e) => {
                e.stopPropagation();
                parentHl.removeAttribute('class');
                childHl.className = child.color + ' hover';
              });
              childHl.addEventListener('mouseout', () => {
                parentHl.className = parentHlColor;
                childHl.className = initChildColor;
              });

              childHlArr.push([childHl, initChildColor]);
              j++;
            }

            parentHlEndText = createText(formatted, foundArr[i + j].endIndex + 1, foundArr[i].endIndex + 1);
            parentHl.appendChild(parentHlEndText);

            parentHl.addEventListener('mouseover', () => {
              parentHl.className = parentHlColor + ' hover';
              childHlArr.forEach((child) => {
                child[0].className = parentHlColor + ' hover';
              });
            });
            parentHl.addEventListener('mouseout', () => {
              parentHl.className = parentHlColor;
              childHlArr.forEach((child) => {
                child[0].className = child[1] + ' hover';
              });
            });

            lastNestedEndIndex = foundArr[i].endIndex;
            i += j;
          // render overlapping highlights
          } else {

          }
        // render non-layered highlights
        } else {
          highlight = createSpan(formatted, foundArr[i]);
          highlight.className = foundArr[i].color + ' hover';
          newP.appendChild(highlight);
        }
      }

      // render any remaining text after all highlights
      if (foundArr.length) {
        let lastStrIndex = lastNestedEndIndex > foundArr[foundArr.length - 1].endIndex + 1
          ? lastNestedEndIndex + 1
          : foundArr[foundArr.length - 1].endIndex + 1;
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
