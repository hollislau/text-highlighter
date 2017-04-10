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

// function regLayerListeners (primaryParent, primaryChild, secondaryParent, primaryParentColor) {
//
// }

module.exports = function (div, wordList) {
  const highlighter = {
    createInput: function () {
      const form = document.createElement('form');
      const textArea = document.createElement('textarea');
      const input = document.createElement('input');

      form.setAttribute('action', '');
      form.className = 'highlighter-input';
      textArea.setAttribute('placeholder', 'Enter text to highlight here....');
      input.setAttribute('type', 'submit');
      input.setAttribute('value', 'Highlight');
      form.appendChild(textArea);
      form.appendChild(input);
      div.appendChild(form);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.highlight(textArea.value);
        textArea.value = '';
      });
    },
    highlight: function (str) {
      const formatted = str.replace(/\s\s+/g, ' ');
      const lowerCase = formatted.toLowerCase();
      const newP = document.createElement('p');
      const foundArr = [];

      var newPText;
      var lastNestedEndIndex;

      // remove previously rendered text and highlights
      if (div.lastChild.className === 'output') {
        div.removeChild(div.lastChild);
      }

      newP.className = 'output';
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

      // render text and highlights
      for (let i = 0; i < foundArr.length; i++) {
        let normalStartIndex;
        let normalText;
        let highlight;

        // render normal text
        if (foundArr[i - 1]) {
          normalStartIndex = lastNestedEndIndex > foundArr[i - 1].endIndex
            ? lastNestedEndIndex + 1
            : foundArr[i - 1].endIndex + 1;
        } else {
          normalStartIndex = 0;
        }

        normalText = createText(formatted, normalStartIndex, foundArr[i].startIndex);
        newP.appendChild(normalText);

        // render overlapping highlights
        if (foundArr[i + 1] && foundArr[i + 1].startIndex < foundArr[i].endIndex) {
          let parentHl = document.createElement('span');

          if (foundArr[i].startIndex < foundArr[i + 1].startIndex) {
            let parentHlStartText = createText(formatted, foundArr[i].startIndex, foundArr[i + 1].startIndex);

            parentHl.appendChild(parentHlStartText);
          }

          newP.appendChild(parentHl);

          // render overlapping (stacked) highlights
          if (foundArr[i + 1].endIndex <= foundArr[i].endIndex) {
            let parentHlColor = foundArr[i].color;
            let childHlArr = [];
            let j = 0;

            parentHl.className = parentHlColor;

            while (foundArr[i + j + 1] && foundArr[i + j + 1].endIndex <= foundArr[i].endIndex) {
              let previous = foundArr[i + j];
              let child = foundArr[i + j + 1];
              let parentHlText = createText(formatted, previous.endIndex + 1, child.startIndex);
              let childHl = createSpan(formatted, child);
              let initChildColor = child.priority < foundArr[i].priority
                ? child.color
                : parentHlColor;

              parentHl.appendChild(parentHlText);
              childHl.className = initChildColor;
              parentHl.appendChild(childHl);

              childHl.addEventListener('mouseover', () => {
                childHl.className = child.color + ' hover';
              });

              childHl.addEventListener('mouseout', () => {
                childHl.className = initChildColor;
              });

              childHlArr.push([childHl, initChildColor]);
              j++;
            }

            if (foundArr[i + j].endIndex < foundArr[i].endIndex) {
              let parentHlEndText = createText(formatted, foundArr[i + j].endIndex + 1, foundArr[i].endIndex + 1);

              parentHl.appendChild(parentHlEndText);
            }

            parentHl.addEventListener('mouseover', (e) => {
              if (e.target === parentHl) {
                parentHl.className = parentHlColor + ' hover';
                childHlArr.forEach((child) => {
                  child[0].removeAttribute('class');
                });
              } else {
                parentHl.removeAttribute('class');
              }
            });

            parentHl.addEventListener('mouseout', (e) => {
              if (e.target === parentHl) {
                parentHl.className = parentHlColor;
                childHlArr.forEach((child) => {
                  child[0].className = child[1] + ' hover';
                });
              } else {
                parentHl.className = parentHlColor;
              }
            });

            lastNestedEndIndex = foundArr[i].endIndex;
            i += j;
          // render overlapping (layered) highlights
          } else {
            let childHl = createSpan(formatted, foundArr[i + 1]);
            let altParentHl = document.createElement('span');
            let altChildHl = createSpan(formatted, foundArr[i]);
            let altParentHlText = createText(formatted, foundArr[i].endIndex + 1, foundArr[i + 1].endIndex + 1);
            let primaryParent;
            let primaryChild;
            let secondaryParent;
            let primaryParentColor;

            parentHl.className = foundArr[i].color;
            childHl.className = foundArr[i + 1].color + ' hover';
            altParentHl.className = foundArr[i + 1].color;
            altChildHl.className = foundArr[i].color + ' hover';

            parentHl.appendChild(childHl);
            altParentHl.appendChild(altChildHl);
            altParentHl.appendChild(altParentHlText);
            newP.appendChild(altParentHl);

            if (foundArr[i].priority < foundArr[i + 1].priority) {
              primaryParent = altParentHl;
              primaryChild = altChildHl;
              secondaryParent = parentHl;
              primaryParentColor = foundArr[i + 1].color;
            } else {
              primaryParent = parentHl;
              primaryChild = childHl;
              secondaryParent = altParentHl;
              primaryParentColor = foundArr[i].color;
            }

            secondaryParent.className = 'hidden';

            primaryParent.addEventListener('mouseover', (e) => {
              if (e.target === primaryParent) {
                primaryParent.className = 'hidden';
                secondaryParent.removeAttribute('class');
              } else {
                primaryParent.removeAttribute('class');
              }
            });

            primaryChild.addEventListener('mouseout', () => {
              primaryParent.className = primaryParentColor;
            });

            secondaryParent.addEventListener('mouseout', () => {
              secondaryParent.className = 'hidden';
              primaryParent.className = primaryParentColor;
            });

            i++;
          }
        // render non-overlapping highlights
        } else {
          highlight = createSpan(formatted, foundArr[i]);
          highlight.className = foundArr[i].color + ' hover';
          highlight.setAttribute('onclick', 'void(0)');
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
      // render text if no highlights found
      } else {
        newPText = document.createTextNode(formatted);
      }

      newP.appendChild(newPText);
    }
  };

  return Object.create(highlighter);
};
