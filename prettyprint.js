(function(){
  enumerable(pD).forEach(function(i,val,o,_length,counter){
  	 if(i in POSTagger.POSTAGGER_LEXICON){
      POSTagger.POSTAGGER_LEXICON[i]["weakness"]=val["weakness"];
      POSTagger.POSTAGGER_LEXICON[i]["polarity"]=val["polarity"];
      //z.Log(JSON.stringify(POSTagger.POSTAGGER_LEXICON[i]));
      //return false;
  	 }
  	 return true;
  }).obj;
  document.getElementById('corpus').value=
	z.Transport.serializeJsonObj(
		/* obj to stringify */POSTagger.POSTAGGER_LEXICON,
		/* allowing functions to stringify */false,
		/* allowing prototypes */false,
		/* prettify */true,
		/* cycleness guarrantie */false,
		/* dictionary stringifying output lemmatized lexamas as props */false
	);
})();