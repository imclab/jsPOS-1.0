//POSTagger.js
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
})("POSTagger", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";
   if(typeof require != 'undefined'){
      require('../../../z/utils/it.js');
      require('../../../z/utils/enumerable.js');
      require('../../../z/utils/z.js');
   }

   var version = "2.5.1";

   exports.POSTagger = function POSTagger(){
        if(!(this instanceof arguments.callee)){
           return new arguments.callee([].slice.call(arguments,0));
        }
        //initiate lexicon;
        this.lexicon = POSTagger.POSTAGGER_LEXICON;
        this.words   = enumerable();
        this.syns    = enumerable();
        this.synSet  = {};
        this.wordSet = {};
        return this;
   };
   exports.POSTagger.prototype.wordInLexicon = function POSTagger_wordInLexicon(word){
        if(this.lexicon[word]){
           return true;
        }
        // if not in hash, try lower case:
        else if(this.lexicon[word.toLowerCase()]){
           return true;
        }
        else{
           return false;
        }
   };
   exports.POSTagger.prototype.consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
   exports.POSTagger.prototype.vowels = ['a','e','i','o','u'];
   exports.POSTagger.prototype.stemmer = function POSTagger_stemmer(w){
        var c = "[^aeiou]";          // consonant
        var v = "[aeiouy]";          // vowel
        var C = c + "[^aeiouy]*";    // consonant sequence
        var V = v + "[aeiou]*";      // vowel sequence

        var mgr0 = "^(" + C + ")?" + V + C;               // [C]VC... is m>0
        var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";  // [C]VC[V] is m=1
        var mgr1 = "^(" + C + ")?" + V + C + V + C;       // [C]VCVC... is m>1
        var s_v   = "^(" + C + ")?" + v;                   // vowel in stem

        var step2list = new Array();
        step2list["ational"]="ate";
        step2list["tional"]="tion";
        step2list["enci"]="ence";
        step2list["anci"]="ance";
        step2list["izer"]="ize";
        step2list["bli"]="ble";
        step2list["alli"]="al";
        step2list["entli"]="ent";
        step2list["eli"]="e";
        step2list["ousli"]="ous";
        step2list["ization"]="ize";
        step2list["ation"]="ate";
        step2list["ator"]="ate";
        step2list["alism"]="al";
        step2list["iveness"]="ive";
        step2list["fulness"]="ful";
        step2list["ousness"]="ous";
        step2list["aliti"]="al";
        step2list["iviti"]="ive";
        step2list["biliti"]="ble";
        step2list["logi"]="log";

        step3list = new Array();
        step3list["icate"]="ic";
        step3list["ative"]="";
        step3list["alize"]="al";
        step3list["iciti"]="ic";
        step3list["ical"]="ic";
        step3list["ful"]="";
        step3list["ness"]="";

        var stem;
        var suffix;
        var firstch;
        var origword = w;

        if (w.length < 3) { return w; }

          var re;
          var re2;
          var re3;
          var re4;

        firstch = w.substr(0,1);
        if (firstch == "y") {
          w = firstch.toUpperCase() + w.substr(1);
        }
        // Step 1a
          re = /^(.+?)(ss|i)es$/;
          re2 = /^(.+?)([^s])s$/;

          if (re.test(w)) { w = w.replace(re,"$1$2"); }
          else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }
        // Step 1b
        re = /^(.+?)eed$/;
        re2 = /^(.+?)(ed|ing)$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          re = new RegExp(mgr0);
          if (re.test(fp[1])) {
            re = /.$/;
            w = w.replace(re,"");
          }
        } else if (re2.test(w)) {
          var fp = re2.exec(w);
          stem = fp[1];
          re2 = new RegExp(s_v);
          if (re2.test(stem)) {
            w = stem;
            re2 = /(at|bl|iz)$/;
            re3 = new RegExp("([^aeiouylsz])\\1$");
            re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
            if (re2.test(w)) {  w = w + "e"; }
            else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
            else if (re4.test(w)) { w = w + "e"; }
          }
        }
        // Step 1c
        re = /^(.+?)y$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          stem = fp[1];
          re = new RegExp(s_v);
          if (re.test(stem)) { w = stem + "i"; }
        }
        // Step 2
        re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          stem = fp[1];
          suffix = fp[2];
          re = new RegExp(mgr0);
          if (re.test(stem)) {
            w = stem + step2list[suffix];
          }
        }
        // Step 3
        re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          stem = fp[1];
          suffix = fp[2];
          re = new RegExp(mgr0);
          if (re.test(stem)) {
            w = stem + step3list[suffix];
          }
        }
        // Step 4
        re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        re2 = /^(.+?)(s|t)(ion)$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          stem = fp[1];
          re = new RegExp(mgr1);
          if (re.test(stem)) {
            w = stem;
          }
        } else if (re2.test(w)) {
          var fp = re2.exec(w);
          stem = fp[1] + fp[2];
          re2 = new RegExp(mgr1);
          if (re2.test(stem)) {
            w = stem;
          }
        }
        // Step 5
        re = /^(.+?)e$/;
        if (re.test(w)) {
          var fp = re.exec(w);
          stem = fp[1];
          re = new RegExp(mgr1);
          re2 = new RegExp(meq1);
          re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
          if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
            w = stem;
          }
        }
        re = /ll$/;
        re2 = new RegExp(mgr1);
        if (re.test(w) && re2.test(w)) {
          re = /.$/;
          w = w.replace(re,"");
        }
        // and turn initial Y back to y
        if (firstch == "y") {
          w = firstch.toLowerCase() + w.substr(1);
        }
        return w;
   };
   exports.POSTagger.prototype.dict2tag = function POSTagger_dict2tag(fromItem,toItem){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?this.wordsLength-1:toItem;
        var syns     = [];
        var self     = this;
        //filtering through dict;
        this.words.forEach(function POSTagger_dict2tag_forEach(i,val,a){
            val.word    = val.word.toLowerCase();
            var stemmed           = self.stemmer(val.word);
            if(self.wordInLexicon(val.word)){
               syns[i]  = self.lexicon[val.word][0];
            }
            else if(!self.wordInLexicon(val.word) && self.wordInLexicon(stemmed)){
               syns[i]  = self.lexicon[stemmed][0];
            }
            //correct lemmatizing of unsatisfiable -> unsatisfy OR proxies -> proxy;
            else if(stemmed.lastIndexOf('i')==stemmed.length-1 && self.wordInLexicon(stemmed.substring(0,stemmed.lastIndexOf('i'))+'y')){
               syns[i]  = self.lexicon[stemmed.substring(0,stemmed.lastIndexOf('i'))+'y'][0];
            }
            else{
               syns[i] = "NN";
            }
            return true;
        },fromItem);
        this.syns = enumerable(syns);
   };
   exports.POSTagger.prototype.applyRules = function POSTagger_applyRules(fromItem,toItem){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?this.wordsLength-1:toItem;
        var self     = this;
        /**
         * Apply transformational rules
        **/
        this.words.forEach(function POSTagger_applyRules_forEach(i,val,a){
            i       = parseInt(i);
            var tag = self.syns.obj[i] || "";
            val     = (it.typeOf(val)=="object" && it.typeOf(val.word)=="string")?val:{word:""};
            var nextVerb=self.nextPOS('VB.*',parseInt(i)+1,parseInt(i)+3);
            var expression=nextVerb!=-1;
            //alert(val.word+" : "+i+" : "+nextVerb+" : "+expression);
            //  rule 1: DT, {VBD | VBP} --> NN
            if(
                tag == "DT" && 
               (self.syns.obj[i+1] == "NN" || self.syns.obj[i+1] == "VBD" || self.syns.obj[i+1] == "VBN" || self.syns.obj[i+1] == "VBP" || self.syns.obj[i+1] == "VB")
            )
            {
                self.syns.obj[i] = "NN";
                val.word=self.getWordsBetweenIndices(i,i+2);
                self.words.obj.splice(i+1,1);
                self.syns.obj.splice(i+1,1);
            }
            // rule 2: convert a noun to a list item marker (LS) if ending with "." or ","
            else if(
               /([0-9]\.)*[0-9](([\.]*[a-zA-Z]+[\.\,])|([\.\,])*)*/.test(val.word)
            ){
               // Attempt to convert into a number
               self.syns.obj[i] = "LS";
            }
            // rule 3: convert a noun to a number (CD) if "." appears in the word
            else if(z.String(tag).startsWith("N").true() && !/[a-zA-Z]+/.test(val.word) && parseFloat(val.word)){
               // Attempt to convert into a number
               self.syns.obj[i] = "CD";
            }
            // rule 4: convert a noun to an adjective form (jj) if the previous word is noun too.
            else if(z.String(tag).startsWith("N").true() && z.String(self.syns.obj[i+1]).startsWith("N").true()){
               self.syns.obj[i] = "JJ";
               val.word=self.getWordsBetweenIndices(i,i+2);
               self.words.obj.splice(i+1,1);
               self.syns.obj.splice(i+1,1);
            }
            // rule 5: simple modality, modality perfect, modality perfect continous, modality perfect passive - non negation.
            // modality triple expression: MDP+[?Auxiliary]+VB[G|N|D] - non negation;
            else if(
               (
                val.word == "can" || 
                val.word == "shall"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS    = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDPPC";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDPPP";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDNC";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDNP";
               }
               else if(/have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(self.syns.obj[secondPOS])){
                  self.syns.obj[i] = "MDPP";
               }
               else if(/had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(self.syns.obj[secondPOS])){
                  self.syns.obj[i] = "MDN";
               }
               else{
                  self.syns.obj[i] = "MD";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 6: simple modality, modality perfect, modality perfect continous, modality perfect passive - negation.
            // modality triple expression: MDP+[?Auxiliary]+VB[G|N|D] - negation;
            else if(
               (
                val.word == "can't" || 
                val.word == "shan't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDPPCN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDPPPN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDNCN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "MDNPN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "MDPPN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "MDNN";
               }
               else{
                  self.syns.obj[i] = "MDN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 7: simple conditional, conditional perfect, conditional perfect continous, conditional perfect passive - non negation.
            // conditional triple expression: MDP+[?Auxiliary]+VB[G|N|D] - non negation;
            else if(
               (
                val.word == "would"  || 
                val.word == "could"  || 
                val.word == "should" || 
                val.word == "might"  || 
                val.word == "may"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCPPC";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCPPP";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCNC";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCNP";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBCPP";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBCN";
               }
               else{
                  self.syns.obj[i] = "VBC";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 8: simple conditional, conditional perfect, conditional perfect continous, conditional perfect passive - negation.
            // conditional triple expression: MDP+[?Auxiliary]+VB[G|N|D] - negation;
            else if(
               (
                val.word == "wouldn't"  || 
                val.word == "couldn't"  || 
                val.word == "shouldn't" || 
                val.word == "mightn't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCPPCN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCPPPN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBCNCN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               ){
                  self.syns.obj[i] = "VBCNPN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBCPPN";
               }
               else if(
                  /had/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBCNN";
               }
               else{
                  self.syns.obj[i] = "VBCN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 9: simple future, future perfect, future perfect continous, future perfect passive - non negation.
            else if(
               (
                val.word == "will"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBFPC";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBFPP";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBFP";
               }
               else{
                  self.syns.obj[i] = "VBF";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 10: simple future, future perfect, future perfect continous, future perfect passive - negation.
            else if(
               (
                val.word == "won't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBG/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBFPCN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBFPPN";
               }
               else if(
                  /have/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBFPN";
               }
               else{
                  self.syns.obj[i] = "VBFN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 11: simple present, present continous, present continous passive - non negation.
            else if(
               (
                 val.word == "is" || 
                 val.word == "are"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /having|being/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBGP";
               }
               else if(
                  /having|being/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBGP";
               }
               else{
                  self.syns.obj[i] = "VBG";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 12: simple present, present continous, present continous passive - negation.
            else if(
               (
                 val.word == "isn't" || 
                 val.word == "aren't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               var thirdPOS   = self.nextPOS('VB.*',secondPOS,secondPOS+3);
               if(
                  /having|being/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
                  /been/.test(self.words.obj[secondPOS].word) && /VBN|VBD/.test(self.syns.obj[thirdPOS])
               )
               {
                  self.syns.obj[i] = "VBGPN";
               }
               else if(
                  /having|being/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBGPN";
               }
               else{
                  self.syns.obj[i] = "VBGN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 13: simple present, present perfect, present perfect continous, present perfect passive - non negation.
            else if(
               (
                 val.word == "has" || 
                 val.word == "have"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBPPP";
               }
               else if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBG/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBPPC";
               }
               else{
                  self.syns.obj[i] = "VBPP";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 14: simple present, present perfect, present perfect continous, present perfect passive - negation.
            else if(
               (
                 val.word == "hasn't" || 
                 val.word == "haven't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBPPPN";
               }
               else if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBG/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBPPCN";
               }
               else{
                  self.syns.obj[i] = "VBPPN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 15: simple past, past perfect, past perfect continous, past perfect passive - non negation.
            else if(
               (
                 val.word == "had"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBNP";
               }
               else if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBG/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBNC";
               }
               else{
                  self.syns.obj[i] = "VBN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 16: simple past, past perfect, past perfect continous, past perfect passive - negation.
            else if(
               (
                 val.word == "hadn't"
               ) && 
               expression
            )
            {
               var secondPOS   = self.nextPOS('VB.*',nextVerb,nextVerb+3);
               if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBN|VBD/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBNPN";
               }
               else if(
                  /been/.test(self.words.obj[nextVerb].word) && (secondPOS!=-1) && 
                  /VBG/.test(self.syns.obj[secondPOS])
               )
               {
                  self.syns.obj[i] = "VBNCN";
               }
               else{
                  self.syns.obj[i] = "VBNN";
               }
               val.word=self.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
               self.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
               self.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
            }
            // rule 17: TO+(VB*)+JJ -> VV.(to be honest)
            else if(val.word == "to" && z.String(self.syns.obj[i+1]).startsWith("VB").true() && z.String(self.syns.obj[i+2]).startsWith("JJ").true()){
               val.word += " " + self.words.obj[i+1].word + " " + self.words.obj[i+2].word;
               self.syns.obj[i] = "VV";
               self.words.obj.splice(i+1,3);
               self.syns.obj.splice(i+1,3);
            }
            // rule 18: TO+(VB*)+JJ -> VV.(to keep going)
            else if(val.word == "to" && z.String(self.syns.obj[i+1]).startsWith("VB").true() && z.String(self.syns.obj[i+2]).startsWith("VB").true()){
               val.word += " " + self.words.obj[i+1].word + " " + self.words.obj[i+2].word;
               self.syns.obj[i] = "VV";
               self.words.obj.splice(i+1,3);
               self.syns.obj.splice(i+1,3);
            }
            // rule 19: VBD+TO+VBP -> VV.(stopped to smoke)
            else if(
                    z.String(self.syns.obj[i]).startsWith("VB").true() && self.words.obj[i+1] && 
                    self.words.obj[i+1].word == "to" && z.String(self.syns.obj[i+2]).startsWith("VB").true()
            )
            {
               val.word += " " + self.words.obj[i+1].word + " " + self.words.obj[i+2].word;
               self.syns.obj[i] = "VV";
               self.words.obj.splice(i+1,3);
               self.syns.obj.splice(i+1,3);
            }
            // rule 20: VBD+(VBG|NN) -> VV.(stopped smoking)
            else if(z.String(self.syns.obj[i]).startsWith("VB").true() && (self.syns.obj[i+1]=="VBG" || self.syns.obj[i+1]=="NN")){
               val.word += " " + self.words.obj[i+1].word;
               self.syns.obj[i] = "VV";
               self.words.obj.splice(i+1,2);
               self.syns.obj.splice(i+1,2);
            }
            // rule 21: VB* -> NNSU(NN subject).
            else if(val.word == "to" && z.String(self.syns.obj[i+1]).startsWith("VB").true()){
               val.word += " " + self.words.obj[i+1].word;
               self.syns.obj[i] = "NNSU";
               self.words.obj.splice(i+1,2);
               self.syns.obj.splice(i+1,2);
            }
            // rule 22: convert any type to adverb if it ends in "ly";
            else if(z.String(val.word).endsWith("ly").true()){
               self.syns.obj[i] = "RB";
            }
            // rule 23: convert a common noun (NN or NNS) to a adjective if it ends with "al"
            else if(z.String(tag).startsWith("NN").true() && z.String(val.word).endsWith("al").true()){
               self.syns.obj[i] = "JJ";
            }
            // rule 24: if a word has been categorized as a common noun and it ends with "s",
            //          then set its type to plural common noun (NNS)
            else if(tag == "NN" && z.String(val.word).endsWith("s").true()){
               self.syns.obj[i] = "NNS";
            }
            return true;
        },fromItem);
   };
   exports.POSTagger.prototype.fillUpWithTags = function POSTagger_fillUpWithTags(){
        var self=this;
        return this.words.forEach(function POSTagger_fillUpWithTags_forEach(i,val,a,_length,counter){
            if(!self.synSet[self.syns.obj[i]]){
               self.synSet[self.syns.obj[i]]=new Array({word:val.word,index:val.index});
            }
            else{
               self.synSet[self.syns.obj[i]].push({word:val.word,index:val.index});
            }
            if(!self.wordSet[val.word]){
               self.wordSet[val.word]=new Array({POS:self.syns.obj[i],index:val.index});
            }
            else{
               self.wordSet[val.word].push({POS:self.syns.obj[i],index:val.index});
            }
            return true;
        });
   };
   exports.POSTagger.prototype.tag = function POSTagger_tag(words){
        this.words        = enumerable(words);
        this.wordsLength  = this.words._length();
        this.synsLength   = this.wordsLength;
        //fillup syntax list this.syns;
        this.dict2tag();
        this.applyRules();
        this.fillUpWithTags();
        return this;
   };
   exports.POSTagger.prototype.nextPOS = function POSTagger_nextPOS(POS,fromItem,toItem){
        POS      = POS?POS:'.*';
        fromItem = fromItem?fromItem:0;
        toItem   = toItem?toItem:this.syns._length();
        return this.syns.indexOf(
               {
                 againstVal:true,
                 fromItem:fromItem,
                 all:false,
                 func:function POSTagger_nextPOS_indexOf_callBack(i,val,object,_length,counter){
                    //alert(POS+" : "+val+" : "+new RegExp(POS).test(val)+" : "+i+" : "+toItem+" : "+(i>=toItem));
                    if(i>=toItem){
                       return false;
                    }
                    else if(new RegExp(POS).test(val)){
                       return true;
                    }
                    else{
                       return false;
                    }
                 }
               }
        ).arr[0];
   };
   /*
   //eval is far more slower;
   exports.POSTagger.prototype.getWordsBetweenIndices = function POSTagger_getWordsBetweenIndices(fromItem,toItem){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?(it.typeOf(this.wordsLength)=='number'?this.wordsLength-1:this.words._length()-1):toItem;
        var e="";
        words= '';
        var self=this;
        enumerable().create(toItem).forEach(function POSTagger_getWordsBetweenIndices_forEach(i,val,a,_length,counter){
          e+=e?eval("z.String(' && (words+=self.words.obj[#])').embed("+i+").str"):
               eval("z.String('(words+=' '+self.words.obj[#])').embed("+i+").str");
        },fromItem);
        return eval(e) && words;
   };
   */
   exports.POSTagger.prototype.getWordsBetweenIndices = function POSTagger_getWordsBetweenIndices(fromItem,toItem){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?this.wordsLength-1:toItem;
        words    = '';
        this.words.
        forEach(function POSTagger_getWordsBetweenIndices_forEach(i,val,object,_length,counter){
          words+=' '+val.word;
          return (i>=toItem?false:true);
        },fromItem);
        return words;
   };
   /*
   usage:
        var tagger  = new POSTagger();
        var a=["NNS","JJ","VBG","RBR","NNSU","VBG"];
        tagger.syns = enumerable(a);
        //actually evaling props used @ inSyns seems slower than forEach in production code #2013.08.22 ZL
        alert(tagger.inSyns(function(val){return new RegExp('VB*').test(val)},2,5));
   */
   exports.POSTagger.prototype.inSyns = function POSTagger_inSyns(f,fromItem,toItem){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?(it.typeOf(this.synsLength)=='number'?this.synsLength-1:this.syns._length()-1):toItem;
        var e="";
        var self=this;
        enumerable().create(toItem).forEach(function POSTagger_inSyns_forEach(i,val,a,_length,counter){
          e+=e?eval("z.String(' || (f.call(self,self.syns.obj[#])?#:false)').embed("+i+").str"):
               eval("z.String('(f.call(self,self.syns.obj[#])?#:false)').embed("+i+").str");
        },fromItem);
        e=e.replace(/\?0/g,"?'0'");
        return eval(e);
   };
   exports.POSTagger.prototype.inWords = function POSTagger_inWords(f,fromItem,toItem,f){
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?(it.typeOf(this.wordsLength)=='number'?this.wordsLength-1:this.words._length()-1):toItem;
        var e="";
        var self=this;
        enumerable().create(toItem).forEach(function POSTagger_inWords_forEach(i,val,a,_length,counter){
          e+=e?eval("z.String(' || (f.call(self,self.words.obj[#])?#:false)').embed("+i+").str"):
               eval("z.String('(f.call(self,self.words.obj[#])?#:false)').embed("+i+").str");
        },fromItem);
        e=e.replace(/\?0/g,"?'0'");
        return eval(e);
   };
   exports.POSTagger.prototype.wordFrequency = function POSTagger_wordFrequency(taggedCorpus,sortingModel){
        if(it.isNotTypeOf(taggedCorpus,[Array,Object,String]).true()){
           return false;
        }
        this.taggedCorpus = enumerable(it.typeOf(taggedCorpus)=='string'?taggedCorpus.split(' '):taggedCorpus);
        this.sortingModel = sortingModel;
        return this.getFrequency(this);
   };
   exports.POSTagger.prototype.getFrequency = function POSTagger_getFrequency(ctx){
        var self=this;
        this.taggedCorpus=this.taggedCorpus
        [(this.sortingModel?"forEach":"eachOfEvery")](function POSTagger_getFrequency_forEach(i,val,a){
              if(it.typeOf(ctx.sortedWords)!='array'){
                 ctx.sortedWords=[];
              }
              if(ctx.sortedWords.indexOf(val.word)!=-1){
                 ctx.sortedWords.splice(ctx.sortedWords.indexOf(val.word),0,val.word);
              }
              else{
                 ctx.sortedWords.push(val.word);
              }
              return true;
        })
        .mapEvery(function POSTagger_getFrequency_mapEvery(i,val,a,_length,counter){
          if(it.typeOf(val.word)=='undefined'){
             return 'continue';
          }
          return  {
                    word:val.word,
                    frequency:ctx.sortedWords.join().split(val.word).length-1
                  }
        })
        .sort({againstVal:true,func:this.sortingModel});
        return this;
   };
   exports.POSTagger.prototype.get = function POSTagger_get(f,ctx){
        this.taggedCorpus
        [(this.sortingModel?"forEach":"eachOfEvery")](function POSTagger_get_forEach(i,val,a){
            if(it.typeOf(val.word)=='undefined'){
               return true;
            }
            return it.typeOf(f)=='function'?f.apply(ctx,[].slice.call(arguments,0)):function(){}();
        });
   };
   //usage:
   //print(new POSTagger().tag(["i", "went", "to", "the", "store", "to", "buy", "5.2", "gallons", "of", "milk"]));

   Object.defineProperty(exports.POSTagger,"version",{value:version,enumerable:false});

   return exports;
});
