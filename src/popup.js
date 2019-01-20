const extension = chrome ? chrome.extension : browser.extension;
const background = extension.getBackgroundPage();
const tab = extension.tabs;
const form = document.forms[0];

let lastTargetLang = localStorage.getItem('lastTargetLang');
if (lastTargetLang) form['targetLangs'].value = lastTargetLang;

form.onsubmit = () => {
  let sourceLang = form['sourceLangs'].value;
  let targetLang = form['targetLangs'].value;
  localStorage.setItem('lastTargetLang', targetLang);
  background.translatePage(targetLang, sourceLang);
};
