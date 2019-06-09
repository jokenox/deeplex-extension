// Deeplex Apply Translation
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

let translatedPageElements = [];
let nextIndex = 0;

function applyPageTranslation() {
  currentPageElements.forEach((element, index) => {
    element.outerHTML = translatedPageElements[index];
  });
}

function revertPageTranslation(originalElements) {
  let elements = getParagraphs(document);
  translatedPageElements = elements;
  elements.forEach((element, index) => {
    element.innerHTML = originalPageElements[index].innerHTML;
  });
}

// Message Listener
(chrome.runtime || browser.runtime).onMessage.addListener((message, sender, sendResponse) => {
  if (message.subject == 'apply-translation') {
    translatedPageElements = message.data.translations;
    applyPageTranslation();
  }
});
