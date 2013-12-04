//frequencyModel.js
/**
*
* ***** BEGIN LICENSE BLOCK *****
* Version: MPL 2.0
*
* The contents of this file are subject to the Mozilla Public License Version
* 2.0 (the "License"); you may not use this file except in compliance with
* the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/2.0/
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), 
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, 
* EXCEPT FOR sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above permissions granted within the boundaries of a NON-COMMERCIAL PROJECT, 
* copyright notice with this permission notice must be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* The Initial Developer of the Original Code is ZLudany, BookingShare.net.
* Portions created by the Initial Developer are Copyright (C) 2002-2013
* by the Initial Developer. All Rights Reserved.
*
* ***** END LICENSE BLOCK ***** */
(function(name, factory){
    typeof require == "undefined" ?
            // pure browser;
            factory(self) :
            typeof module.exports == "undefined" ?
                // browser AMD loader or RequireJS
                define(name, ["exports"], factory) :
                // CommonJS environment
                factory(module.exports);
})("POSTagger_frequencyModel", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";

   var version = "2.5.1";

	 // exports.POSTagger.frequencyModel=[
	 //    function isTopWord(a,b){
	 //    	return POSTagger.frequencyModel.topWord(a)?1:0
	 //    }
	 //    ,function frequencyMeasurement(a,b){
		//     return a.frequency>b.frequency?1:0 
	 //    }
	 //    //,function isEntityORfirstWordInSentence(a,b){ return ((!isFirstWordInSentence(w) && camelCased(w)) || entityExists(w)) }
	 // ];

   exports.POSTagger.frequencyModel=function frequencyMeasurement(a,b){
         return a.frequency>b.frequency?1:0 
   };

	 //simple frequencyModel can also be defined as a string, but it is better to use functions:
	 //exports.POSTagger.frequencyModel="a.frequency>b.frequency?1:0";

   Object.defineProperty(exports.POSTagger.frequencyModel,"topWord",{value:function topWord(wordObj){
      var Flist = [];
			new POSTagger()
			//analyse the entire results to get topWords;
	    .wordFrequency(POSTagger.result.tags,POSTagger.result.tags.synSet,null/*we don't need another sortingModel*/)
	    .get(function(i,val,a){
           if(POSTagger.POSTAGGER_LEXICON[val] && POSTagger.POSTAGGER_LEXICON[val]['pos']=='DT'){
              return true;
           }
	         return Flist.push(val);
	    });
	    Flist=enumerable(Flist).unredundant().obj;
	    return (Flist.length=3 && (Flist.indexOf(wordObj.word)!=-1?true:false));
   },enumerable:true});

   Object.defineProperty(exports.POSTagger.frequencyModel,"version",{value:version,enumerable:false});

   return exports;
});
