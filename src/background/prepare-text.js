// Deeplex Prepare Text
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

let tmlAttributes = [];

function listToText(list) {
  return list.join('\n-\n');
}

function textToList(text) {
  return text.split('\n-\n');
}

function maskTags(string) {
  return string.replace(/<(?=[a-z]|[A-Z])/g, '(<')
               .replace(/<\/(?=[a-z]|[A-Z])/g, '(</')
               .replace(/>/g, '>)');
}

function unmaskTags(string) {
  return string.replace(/\(<+/g, '<').replace(/>+\)/g, '>');
}

function maskTML(tml) {
  let masked = maskTags(tml);
  masked = masked.replace(/\(<t/g, '(<').replace(/\(<\/t/g, '(</');

  return masked;
}

function unmaskTML(maskedTML) {
  let unmasked = maskedTML.replace(/\(<+(?!\/)/g, '(<t').replace(/\(<+\//g, '(</t');
  unmasked = unmaskTags(unmasked);

  return unmasked;
}

function doseTranslation(list) {
  let partitions = [];
  let charNumber = 0;
  let lastIndex = 0;

  list.forEach((element, index) => {
    if (charNumber + element.length <= 5000) {
      charNumber += element.length + 3;
    } else {
      let partition = listToText(list.slice(lastIndex, index));
      partitions.push(partition);
      charNumber = element.length;
      lastIndex = index;
    }

    if (index === list.length - 1) {
      let partition = listToText(list.slice(lastIndex, index + 1));
      partitions.push(partition);
    }
  });

  return partitions;
}

function undoseTranslation(list) {
  let translations = list.map(element => textToList(element));
  translations = translations.reduce((left, right) => left.concat(right));

  return translations;
}

function convertToTML(element) {
  let number = tmlAttributes.length;

  let elementAttributes = {
    'tagName': element.tagName,
    'attributes': element.attributes
  }

  tmlAttributes.push(elementAttributes);

  let newElement = document.createElement(`t${number}`);
  newElement.innerHTML = element.innerHTML;

  if (newElement.hasChildNodes()) {
    newElement.childNodes.forEach(child => {
      if (child.nodeName !== '#text') {
        child.outerHTML = convertToTML(child).outerHTML;
      }
    });
  }

  return newElement;
}

function htmlToTML(html) {
  let element = document.createElement('div');
  element.innerHTML = html;

  return convertToTML(element.firstChild).outerHTML;
}

function tmlToHTML(tml) {
  let element = document.createElement('div');
  element.innerHTML = tml;

  let tmlElement = element.firstChild;
  let tmlTagNumber = Number(tmlElement.tagName.substring(1));
  let elementAttributes = [... tmlAttributes[tmlTagNumber].attributes];

  element = document.createElement(tmlAttributes[tmlTagNumber].tagName);
  element.innerHTML = tmlElement.innerHTML;

  elementAttributes.forEach(attribute => {
    element.setAttribute(attribute.name, attribute.value);
  });

  if (element.hasChildNodes()) {
    element.childNodes.forEach(child => {
      if (child.nodeName !== '#text') {
        child.outerHTML = tmlToHTML(child.outerHTML);
      }
    });
  }

  return element.outerHTML;
}

function emptyTmlAttributesList() {
  tmlAttributes = [];
}
