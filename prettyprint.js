(function(){
  document.getElementById('corpus').value=
  												z.Transport.serializeJsonObj(
														/* obj to stringify */POSTagger.POSTAGGER_LEXICON,
														/* allowing functions to stringify */false,
														/* allowing prototypes */false,
														/* prettify */true,
														/* cycleness guarrantie */false,
														/* dictionary stringifying output lemmatized lexamas as props */true
  												);
})();