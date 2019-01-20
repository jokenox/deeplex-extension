// Deeplex Serverless Fetch
// Licensed under the MIT License
// Copyright (c) 2019 Kenny Cruz

function fetchTranslation(text, targetLang, sourceLang) {
  localStorage.setItem('translation', '1');
  localStorage.setItem('text', text);
  localStorage.setItem('targetLang', targetLang);
  localStorage.setItem('sourceLang', sourceLang);

  window.open('https://www.deepl.com/translate');
}