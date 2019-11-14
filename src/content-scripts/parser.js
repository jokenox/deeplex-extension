// Deeplex Parser
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz
// github.com/jokenox

const elementsBlacklist = ['SCRIPT', 'STYLE', 'CODE', 'I'];

let originalPageBody;
let originalPageHead;
let originalPageElements = [];
let currentPageElements = [];

function hasTextChildren(element) {
  let containsTextChild = false;

  element.childNodes.forEach(child => {
    if (child.nodeName === '#text' && child.textContent.trim()) {
      containsTextChild = true;
    }
  });

  return containsTextChild;
}

function isTranslatable(element) {
  let inBlacklist = elementsBlacklist.includes(element.nodeName);
  let translatable;

  try {
    translatable = !(element.classList.contains('notranslate') || element.attributes.translate === 'no');
  } catch (e) {
    translatable = true;
  }

  return !(inBlacklist || !translatable);
}

function getElementsWithText(element) {
  let elementsWithText = [];

  if (isTranslatable(element)) {
    if (hasTextChildren(element)) {
      elementsWithText.push(element);
    } else {
      element.childNodes.forEach(childElement => {
        elementsWithText = elementsWithText.concat(getElementsWithText(childElement));
      });
    }
  }

  return elementsWithText;
}

// Message Listener
(chrome.runtime || browser.runtime).onMessage.addListener((message, sender, sendResponse) => {
  if (message.subject == 'parse-page') {
    originalPageBody = document.body.innerHTML;
    originalPageHead = document.head.innerHTML;
    currentPageElements = getElementsWithText(document);
    originalPageElements = currentPageElements.map(paragraph => paragraph.outerHTML);

    sendResponse({
      'text': originalPageElements,
      'targetLang': message.data.targetLang,
      'sourceLang': message.data.sourceLang
    });
  }
});
