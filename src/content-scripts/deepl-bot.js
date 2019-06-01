// DeepL Bot
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

const selectors = {
  deeplTranslator: '#dl_translator',
  sourceTextarea: '.lmt__source_textarea',
  targetTextarea: '.lmt__target_textarea',
  sourceLangSelect: '.lmt__language_select--source',
  targetLangSelect: '.lmt__language_select--target',
  clearTextButton: '.lmt__clear_text_button',
  busyIndicatorActive: 'lmt--active_translation_request',
  autoLang: 'button[dl-value=auto]',
  esLang: 'button[dl-value=ES]',
  enLang: 'button[dl-value=EN]',
  deLang: 'button[dl-value=DE]',
  frLang: 'button[dl-value=FR]',
  ptLang: 'button[dl-value=PT]',
  itLang: 'button[dl-value=IT]',
  nlLang: 'button[dl-value=NL]',
  plLang: 'button[dl-value=PL]',
  ruLang: 'button[dl-value=RU]'
};

const deeplTranslator = document.querySelector(selectors.deeplTranslator);
const sourceTextarea = document.querySelector(selectors.sourceTextarea);
const targetTextarea = document.querySelector(selectors.targetTextarea);
const sourceLangSelect = document.querySelector(selectors.sourceLangSelect);
const targetLangSelect = document.querySelector(selectors.targetLangSelect);
const clearTextButton = document.querySelector(selectors.clearTextButton);

function timePromise(milliseconds) {
  return new Promise(res => setTimeout(res, milliseconds));
}

function selectLang(language, side) {
  side = side === 1 ? targetLangSelect : sourceLangSelect;

  switch (language) {
    case 'AUTO':
    case 'auto':
      side.querySelector(selectors.autoLang).click();
      break;

    case 'ES':
    case 'es':
      side.querySelector(selectors.esLang).click();
      break;

    case 'EN':
    case 'en':
      side.querySelector(selectors.enLang).click();
      break;

    case 'DE':
    case 'de':
      side.querySelector(selectors.deLang).click();
      break;

    case 'FR':
    case 'fr':
      side.querySelector(selectors.frLang).click();
      break;
    case 'PT':
    case 'pt':
      side.querySelector(selectors.ptLang).click();
      break;
    case 'IT':
    case 'it':
      side.querySelector(selectors.itLang).click();
      break;

    case 'NL':
    case 'nl':
      side.querySelector(selectors.nlLang).click();
      break;

    case 'PL':
    case 'pl':
      side.querySelector(selectors.plLang).click();
      break;

    case 'RU':
    case 'ru':
      side.querySelector(selectors.ruLang).click();
      break;
  }
}

function translationInTarget() {
  return (
    targetTextarea.value.trim()
    && targetTextarea.value.trim().substring(0, 5) !== '[...]'
    && !deeplTranslator.classList.contains(selectors.busyIndicatorActive)
  );
}

async function waitForTranslation() {
  while (!translationInTarget()) await timePromise(300);

  return targetTextarea.value;
}

async function newTranslation(text, targetLang, sourceLang) {
  clearTextButton.click();
  selectLang('auto', 0);

  if (targetLang) selectLang(targetLang, 1);

  sourceTextarea.value = text;

  if (sourceLang) {
    selectLang(sourceLang, 0);
  } else {
    selectLang('EN', 0);
    selectLang('auto', 0);
  }

  return {
    'translation': {
      'translatedText': await waitForTranslation(),
      'sourceLang': sourceTextarea.attributes.lang.value,
      'targetLang': targetTextarea.attributes.lang.value
    }
  }
}

async function translateTextList(list, targetLang, sourceLang) {
  let translationsList = [];

  for (let i = 0; i < list.length; i++) {
    translationsList[i] = await newTranslation(list[i], targetLang, sourceLang);
  }
  
  await Promise.all(translationsList);

  return translationsList;
}

async function translateMessageResponse(response) {
  let textList = response.textList;
  let targetLang = response.targetLang;
  let sourceLang = response.sourceLang;

  return await translateTextList(textList, targetLang, sourceLang);
}

function checkForNewTranslations(callback) {
  const runtime = chrome.runtime || browser.runtime;
  
  runtime.sendMessage(
    runtime.id,
    { 'translator': true },
    callback
  );
}

checkForNewTranslations(translateMessageResponse);
