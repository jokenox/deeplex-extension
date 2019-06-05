// Deeplex Prepare Text
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

var elementsAttributesList = [];

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

function maskElementAttributes(element) {
  if (element.hasAttributes()) {
    elementsAttributesList.push(element.attributes);
    element.setAttribute('dx', elementsAttributesList.length - 1);
  }

  if (element.hasChildNodes()) {
    [].slice.call(element.children).forEach(e => {
      maskElementAttributes(e);
    });
  }
}

function prepareElement(element, innerOnly) {
  let nodeName = element.nodeName.toLowerCase();
  let text = ''; 

  if (nodeName !== '#text' && !innerOnly) {
    text += `(<${nodeName}`;

    if (element.attributes.dx) {
      text += ` dx="${element.attributes.dx.value}"`;
    }

    text += '>)';
  }

  if (element.hasChildNodes()) {
    element.childNodes.forEach(node => {
      text += prepareElement(node);
    });
  } else {
    text += element.textContent;
  }

  if (nodeName !== '#text' && !innerOnly) {
    text += `(</${nodeName}>)`;
  }

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
    maskElementAttributes(element);
    let preparedElement = prepareElement(element, true);
    list[index] = preparedElement;
    
    if (charNumber + preparedElement.length <= 5000) {
      charNumber += preparedElement.length + 3;
    } else {
      let partition = listToText(list.slice(lastIndex, index));
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


// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

let TML_Attributes = [];

function convertToTML(element) {
  let number = TML_Attributes.length;

  TML_Attributes.push(element.attributes);

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
