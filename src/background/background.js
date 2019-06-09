const browserTabs = chrome.tabs || browser.tabs;
const runtime = chrome.runtime || browser.runtime;

let translationData;

function fetchTranslation(response) {
  translationData = response;

  translationData.text = translationData.text.map(text => {
    return maskTML(htmlToTML(text));
  });

  translationData.text = doseTranslation(translationData.text);

  window.open('https://www.deepl.com/translate', '_blank');
}

function translatePage(targetLang, sourceLang) {
  let message = {
    'subject': 'parse-page',
    'data': {
      'targetLang': targetLang,
      'sourceLang': sourceLang
    }
  };

  browserTabs.query({ active: true, currentWindow: true }, tabs => {
    browserTabs.sendMessage(tabs[0].id, message, fetchTranslation);
  });
}

runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.subject == 'check-for-translations') {
    let response = {
      'textList': translationData.text,
      'targetLang': translationData.targetLang,
      'sourceLang': translationData.sourceLang,
    }

    sendResponse(response);
  } else if (message.subject == 'translations-list') {
    browserTabs.query({ active: true, currentWindow: true }, tabs => {
      let translations = message.data.translations.map(translation => {
        return translation.translation.translatedText;
      });

      translations = undoseTranslation(translations);

      translations = translations.map(translation => {
        return tmlToHTML(unmaskTML(translation));
      });

      let newMessage = {
        'subject': 'apply-translation',
        'data': {
          'translations': translations
        }
      };

      emptyTmlAttributesList();

      browserTabs.sendMessage(tabs[0].openerTabId, newMessage, fetchTranslation);
    });
  }
});