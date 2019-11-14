// Deeplex Apply Translation
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

let translatedPageElements = [];
let pageIsTranslated = false;

function applyPageTranslation() {
  currentPageElements.forEach((element, index) => {
    element.outerHTML = translatedPageElements[index];
  });

  pageIsTranslated = true;
}

function revertPageTranslation() {
  // currentPageElements.forEach((element, index) => {
  //   element.outerHTML = originalPageElements[index];
  // });

  document.head.innerHTML = originalPageHead;
  document.body.innerHTML = originalPageBody;

  pageIsTranslated = false;
}

// Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.subject == 'apply-translation') {
    translatedPageElements = message.data.translations;
    applyPageTranslation();
  } else if (message.subject == 'revert-translation') {
    revertPageTranslation();
  } else if (message.subject == 'page-is-translated?') {
    sendResponse(pageIsTranslated);
  }
});
