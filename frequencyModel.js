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
   var that     = exports.POSTagger;

   exports.POSTagger.topWord = function(wordObj){
      var Flist = [];
			new POSTagger()
			//analyse the entire results to get topWords;
	    .wordFrequency(this.result.tags.synSet,null)
	    .get(function(i,val,a){
	         if(POSTagger.POSTAGGER_LEXICON[val]=='DT'){
	             return true;
	         }
	         return Flist.push(val);
	    });
	    Flist=enumerable(Flist).unredundant().obj;
	    return (Flist.length=3 && (Flist.indexOf(wordObj.word)!=-1?true:false));
   };

	 /*
	 //complex frequencyModel come into scene later;
	 exports.POSTagger.frequencyModel=[
	    function(a){ return POSTagger.topWord.call(this,a)?true:false },
	    function isEntityORfirstWordInSentence(){ return ((!isFirstWordInSentence(w) && camelCased(w)) || entityExists(w)) }
	 ];
	 */

	 //simple frequencyModel can also be defined as string:
	 //exports.POSTagger.frequencyModel="a.frequency>b.frequency?-1:0";

	 exports.POSTagger.frequencyModel=function(a,b){
	 		//z.Log({description:JSON.stringify(a.word)+" : "+JSON.stringify(b.word)+" : "+a.frequency+" > "+b.frequency});
	 		return a.frequency>b.frequency?1:0
	 }
   enumerable(POSTagger.frequencyModel).forEach(function(i,val){ return val.bind(that) });

   Object.defineProperty(exports.POSTagger.frequencyModel,"version",{value:version,enumerable:false});

   return exports;
});
