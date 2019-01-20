// Deeplex Prepare Text
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

function listToText(list) {
  return list.join('\n-\n');
}

function textToList(text) {
  return text.split('\n-\n');
}

function maskElementTags(element) {
  return element.innerHTML.replace(/</g, '(<').replace(/>/g, '>)');
}

function unmaskElementTags(element) {
  return element.innerHTML.replace(/\(</g, '<').replace(/>\)/g, '>');
}

function maskElementsTags(list) {
  return list.map(element => maskElementTags(element));
}

function unmaskElementsTags(list) {
  return list.map(element => unmaskElementTags(element));
}

function pepareElementsList(list) {
  let partitions = [];
  let charNumber = 0;
  let lastIndex = 0;
  list.forEach((element, index) => {
    let tagsMaskedElement = maskElementTags(element);
    if (charNumber + tagsMaskedElement.length <= 5000) {
      charNumber += tagsMaskedElement.length + 3;
    } else {
      let partition = list.slice(lastIndex, index);
      let partitionInText = listToText(maskElementsTags(partition));
      partitions.push([partition, partitionInText]);
      charNumber = tagsMaskedElement.length;
      lastIndex = index;
    }

    if (index === list.length - 1) {
      let partition = list.slice(lastIndex, index + 1);
      let partitionInText = listToText(maskElementsTags(partition));
      partitions.push([partition, partitionInText]);
    }
  });

  return partitions;
}