// Deeplex Apply Translation
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

let translatedPageElements = [];

function applyPageTranslation() {
  currentPageElements.forEach((element, index) => {
    element.outerHTML = translatedPageElements[index];
  });
}

function revertPageTranslation() {
  currentPageElements.forEach((element, index) => {
    element.outerHTML = originalPageElements[index];
  });
}

// Message Listener
(chrome.runtime || browser.runtime).onMessage.addListener((message, sender, sendResponse) => {
  if (message.subject == 'apply-translation') {
    translatedPageElements = message.data.translations;
    applyPageTranslation();
  }
});
