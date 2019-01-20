const browserTabs = chrome ? chrome.tabs : browser.tabs;

function fetchTranslation(response) {
  localStorage.setItem('tabId', response.tabId);
  localStorage.setItem('text', response.text);
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
