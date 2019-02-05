// Deeplex Parser
// Licensed under the MIT License
// Copyright (c) 2018 Kenny Cruz

const elementsBlacklist = ['SCRIPT', 'STYLE', 'CODE', 'I'];

function hasTextChildren(container) {
  let containsText = false;
  container.childNodes.forEach(element => {
    if (element.nodeName === '#text' && element.textContent.trim()) {
      containsText = true;
    }
  });
  return containsText;
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

function getParagraphs(element) {
  let paragraphs = [];
  if (isTranslatable(element)) {
    if (hasTextChildren(element)) {
      paragraphs = paragraphs.concat(element);
    } else {
      element.childNodes.forEach(element => {
        let paragraphs2 = getParagraphs(element);
        if (paragraphs2.length) paragraphs = paragraphs.concat(paragraphs2);
      });
    }
  }
  return paragraphs;
}

function getParagraphsText(element) {
  let paragraphs = getParagraphs(element);
  paragraphs = paragraphs.map(paragraph => paragraph.outerHTML);

  return paragraphs;
}

// Message Listener
const runtime = chrome ? chrome.runtime : browser.runtime;
runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.targetLang) sendResponse({
    'tabId': sender,
    'text': getParagraphsText(document),
    'targetLang': message.targetLang,
    'sourceLang': message.sourceLang
  });
});
