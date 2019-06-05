const browserTabs = chrome.tabs || browser.tabs;
const runtime = chrome.runtime || browser.runtime;

let translationData;

function fetchTranslation(response) {
  //let texts = doseTranslation(response.text);

  translationData = response;
  translationData.text = response.text.map(text => htmlToTML(text));
  
  window.open('https://www.deepl.com/translate', '_blank');
}

function translatePage(targetLang, sourceLang) {
  let message = {
    'targetLang': targetLang,
    'sourceLang': sourceLang
  };

  browserTabs.query({active: true, currentWindow: true}, tabs => {
    browserTabs.sendMessage(tabs[0].id, message, fetchTranslation);
  });
}

runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.translator) {
    let response = {
      'textList': translationData.text,
      'targetLang': translationData.targetLang,
      'sourceLang': translationData.sourceLang,
    }
    //text = doseTranslation(text);

    sendResponse(response);
  }
});