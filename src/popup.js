const extension = chrome.extension || browser.extension;
const browserTabs = chrome.tabs || browser.tabs;
const background = extension.getBackgroundPage();
const githubButton = document.querySelector('#githubButton');
const form = document.forms[0];
const showOriginalButton = document.querySelector('#showOriginalButton');

let lastTargetLang = localStorage.getItem('lastTargetLang');
if (lastTargetLang) form['targetLangs'].value = lastTargetLang;

githubButton.onclick = () => window.open('https://github.com/jokenox/deeplex-extension');

form.onsubmit = () => {
  let sourceLang = form['sourceLangs'].value;
  let targetLang = form['targetLangs'].value;

  if (targetLang !== lastTargetLang) {
    localStorage.setItem('lastTargetLang', targetLang);
  }

  background.translatePage(targetLang, sourceLang);
};

showOriginalButton.addEventListener('click', () => {
  background.revertPageTranslation()

  document.querySelector('#translationForm').classList.remove('hidden');
  document.querySelector('#afterTranslation').classList.add('hidden');
});

// Page is translated?
browserTabs.query({ active: true, currentWindow: true }, tabs => {
  let message = { 'subject': 'page-is-translated?' };

  browserTabs.sendMessage(tabs[0].id, message, response => {
    if (response == true) {
      document.querySelector('#translationForm').classList.add('hidden');
      document.querySelector('#afterTranslation').classList.remove('hidden');
    }
  });
});

