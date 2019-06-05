const browserTabs = chrome.tabs || browser.tabs;
const runtime = chrome.runtime || browser.runtime;

function fetchTranslation(response) {
  //let texts = doseTranslation(response.text);

  let texts = response.text.map(text => htmlToTML(text));

  localStorage.setItem('tabId', response.tabId);
  localStorage.setItem('text', texts.join('[&,]'));
  localStorage.setItem('targetLang', response.targetLang);
  localStorage.setItem('sourceLang', response.sourceLang);
  
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
      'textList': localStorage.getItem('text').split('[&,]'),
      'targetLang': localStorage.getItem('targetLang'),
      'sourceLang': localStorage.getItem('sourceLang'),
    }
    //text = doseTranslation(text);

    sendResponse(response);
  }
});