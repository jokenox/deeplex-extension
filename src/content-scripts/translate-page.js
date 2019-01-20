// Deeplex Translate Page
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

let originalPageElements;
let translatedPageElements;
let nextIndex = 0;

translatePageElements = async (textList, index, targetLang, sourceLang) => {
  await fetchTranslation(textList[index], targetLang, sourceLang).then(async data => {
    let translated = data.translation.translatedText.replace(/%2F/g, '/')
                     .replace(/%23/g, '#').replace(/%26/g, '&')
                     .replace(/\(</g, '<').replace(/>\)/g, '>');

    translated = translated.split(/\n- *\n/);
    
    translated.forEach(element => {
      let pageElement = originalPageElements[nextIndex];
      pageElement.innerHTML = element;
      nextIndex++;
    });

    if (textList[index + 1]) {
      translatePageElements(textList, index + 1, targetLang, sourceLang);
    }
  });
}

function revertPageTranslation() {
  let elements = getParagraphs(document);
  translatedPageElements = elements;
  elements.forEach((element, index) => {
    element.innerHTML = originalPageElements[index].innerHTML;
  });
}

translatePage = async (targetLang, sourceLang) => {
  let toTranslate = listToTextList(maskElementsTags(getParagraphs(document)));
  originalPageElements = getParagraphs(document);
  translatePageElements(toTranslate, 0, targetLang, sourceLang);
}
