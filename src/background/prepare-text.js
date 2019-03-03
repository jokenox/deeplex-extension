// Deeplex Prepare Text
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

function listToText(list) {
  return list.join('\n-\n');
}

function textToList(text) {
  return text.split('\n-\n');
}

function maskTagsInElement(element) {
  return element.innerHTML.replace(/</g, '(<').replace(/>/g, '>)');
}

function unmaskTagsInElement(element) {
  return element.innerHTML.replace(/\(<+/g, '<').replace(/>+\)/g, '>');
}

function maskTagsInElements(list) {
  return list.map(element => maskElementTags(element));
}

function unmaskTagsInElements(list) {
  return list.map(element => unmaskElementTags(element));
}

function maskTagsInString(string) {
  return string.replace(/</g, '(<').replace(/>/g, '>)');
}

function unmaskTagsInString(string) {
  return string.replace(/\(<+/g, '<').replace(/>+\)/g, '>');
}

function enumerateElementNodes(element, number) {
  number ? 1 : number = 0;

  element.setAttribute('dx', number);
  
  if (element.hasChildNodes()) {
    [].slice.call(element.children).forEach(e => {
      enumerateElementNodes(e, ++number);
    });
  }
}

function disenumerateElementNodes(element) {
  element.removeAttribute('dx');

  if (element.hasChildNodes()) {
    [].slice.call(element.children).forEach(e => {
      disenumerateElementNodes(e);
    });
  }
}

function prepareElement(element) {
  let text = '';

  if (element.nodeName !== '#text') {
    text += `(<${element.nodeName} dx="${element.attributes.dx.value}">)`;
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach(node => {
      text += prepareElement(node);
    });
  } else {
    text += element.textContent;
  }

  text += element.nodeName !== '#text' ? `(</${element.nodeName}>)` : '';

  return text;
}

function revertPreparation(string) {
  textToList(string);
}

function doseTranslation(list) {
  let partitions = [];
  let charNumber = 0;
  let lastIndex = 0;
  list.forEach((element, index) => {
    let preparedElement = prepareElement(element);
    list[index] = preparedElement;
    
    if (charNumber + preparedElement.length <= 5000) {
      charNumber += preparedElement.length + 3;
    } else {
      let partition = listToText(list.slice(lastIndex, index))
      partitions.push(partition);
      charNumber = preparedElement.length;
      lastIndex = index;
    }

    if (index === list.length - 1) {
      let partition = listToText(list.slice(lastIndex, index + 1));
      partitions.push(partition);
    }
  });

  return partitions;
}
