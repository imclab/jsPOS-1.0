//deepRules.js
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
/*
z.Utils//helper
z.Object//helper
z.Date//helper
z.EventDriven//custom eventmanager has global interfaces, instantiated and inherited by z.module;
z.PreloadImages//has global interfaces;
z.styleSheet//has global interfaces;
z.Transport//ajax helper, not supporting cross domain communication, use requireJS for that case;
z.Module//core class;
z.Indicator//loader module, every module instantiate it for evented loading;
z.Effects//has global interfaces;
z.Button//button module used as a submodule in modules like z.Windows, z.Grid;
z.thumbViewer//module
z.slideShow//module
*/
(function(name, factory){
    typeof require == "undefined" ?
            // pure browser;
            factory(self) :
            typeof module.exports == "undefined" ?
                // browser AMD loader or RequireJS
                define(name, ["exports"], factory) :
                // CommonJS environment
                factory(module.exports);
})("POSTagger_deepRules", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";

   var version = "2.5.1";

   exports.POSTagger.prototype.deepRules = function POSTagger_deepRules(i,val,tag,nextVerb,expression){
      var that=this;
      //  rule 1: DT, {VBD | VBP} --> NN
      if(
          tag == "DT" && 
         (that.syns.obj[i+1] == "NN" || that.syns.obj[i+1] == "VBD" || that.syns.obj[i+1] == "VBN" || that.syns.obj[i+1] == "VBP" || that.syns.obj[i+1] == "VB")
      )
      {
          that.syns.obj[i] = "NN";
          val.word=that.getWordsBetweenIndices(i,i+2);
          that.words.obj.splice(i+1,1);
          that.syns.obj.splice(i+1,1);
      }
      // rule 2: convert a noun to a list item marker (LS) if ending with "." or ","
      else if(
         /([0-9]\.)*[0-9](([\.]*[a-zA-Z]+[\.\,])|([\.\,])*)*/.test(val.word)
      ){
         // Attempt to convert into a number
         that.syns.obj[i] = "LS";
      }
      // rule 3: convert a noun to a number (CD) if "." appears in the word
      else if(z.String(tag).startsWith("N").true() && !/[a-zA-Z]+/.test(val.word) && parseFloat(val.word)){
         // Attempt to convert into a number
         that.syns.obj[i] = "CD";
      }
      // rule 4: convert a noun to an adjective form (jj) if the previous word is noun too.
      else if(z.String(tag).startsWith("N").true() && z.String(that.syns.obj[i+1]).startsWith("N").true()){
         that.syns.obj[i] = "JJ";
         val.word=that.getWordsBetweenIndices(i,i+2);
         that.words.obj.splice(i+1,1);
         that.syns.obj.splice(i+1,1);
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS    = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDPPC";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDPPP";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDNC";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDNP";
         }
         else if(/have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(that.syns.obj[secondPOS])){
            that.syns.obj[i] = "MDPP";
         }
         else if(/had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(that.syns.obj[secondPOS])){
            that.syns.obj[i] = "MDN";
         }
         else{
            that.syns.obj[i] = "MD";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDPPCN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDPPPN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDNCN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "MDNPN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "MDPPN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "MDNN";
         }
         else{
            that.syns.obj[i] = "MDN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCPPC";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCPPP";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCNC";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCNP";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBCPP";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBCN";
         }
         else{
            that.syns.obj[i] = "VBC";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCPPCN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCPPPN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBCNCN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         ){
            that.syns.obj[i] = "VBCNPN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBCPPN";
         }
         else if(
            /had/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBCNN";
         }
         else{
            that.syns.obj[i] = "VBCN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
      }
      // rule 9: simple future, future perfect, future perfect continous, future perfect passive - non negation.
      else if(
         (
          val.word == "will"
         ) && 
         expression
      )
      {
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBFPC";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBFPP";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBFP";
         }
         else{
            that.syns.obj[i] = "VBF";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
      }
      // rule 10: simple future, future perfect, future perfect continous, future perfect passive - negation.
      else if(
         (
          val.word == "won't"
         ) && 
         expression
      )
      {
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBG/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBFPCN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBFPPN";
         }
         else if(
            /have/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBFPN";
         }
         else{
            that.syns.obj[i] = "VBFN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /having|being/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBGP";
         }
         else if(
            /having|being/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBGP";
         }
         else{
            that.syns.obj[i] = "VBG";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         var thirdPOS   = that.nextPOS('VB.*',secondPOS,secondPOS+3);
         if(
            /having|being/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1 && thirdPOS!=-1) && 
            /been/.test(that.words.obj[secondPOS].word) && /VBN|VBD/.test(that.syns.obj[thirdPOS])
         )
         {
            that.syns.obj[i] = "VBGPN";
         }
         else if(
            /having|being/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBGPN";
         }
         else{
            that.syns.obj[i] = "VBGN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBPPP";
         }
         else if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBG/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBPPC";
         }
         else{
            that.syns.obj[i] = "VBPP";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
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
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBPPPN";
         }
         else if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBG/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBPPCN";
         }
         else{
            that.syns.obj[i] = "VBPPN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
      }
      // rule 15: simple past, past perfect, past perfect continous, past perfect passive - non negation.
      else if(
         (
           val.word == "had"
         ) && 
         expression
      )
      {
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBNP";
         }
         else if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBG/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBNC";
         }
         else{
            that.syns.obj[i] = "VBN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
      }
      // rule 16: simple past, past perfect, past perfect continous, past perfect passive - negation.
      else if(
         (
           val.word == "hadn't"
         ) && 
         expression
      )
      {
         var secondPOS   = that.nextPOS('VB.*',nextVerb,nextVerb+3);
         if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBN|VBD/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBNPN";
         }
         else if(
            /been/.test(that.words.obj[nextVerb].word) && (secondPOS!=-1) && 
            /VBG/.test(that.syns.obj[secondPOS])
         )
         {
            that.syns.obj[i] = "VBNCN";
         }
         else{
            that.syns.obj[i] = "VBNN";
         }
         val.word=that.getWordsBetweenIndices(i,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb));
         that.words.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
         that.syns.obj.splice(i+1,(secondPOS!=-1 && thirdPOS!=-1)?thirdPOS:(secondPOS!=-1?secondPOS:nextVerb)-(i+1));
      }
      // rule 17: TO+(VB*)+JJ -> VV.(to be honest)
      else if(val.word == "to" && z.String(that.syns.obj[i+1]).startsWith("VB").true() && z.String(that.syns.obj[i+2]).startsWith("JJ").true()){
         val.word += " " + that.words.obj[i+1].word + " " + that.words.obj[i+2].word;
         that.syns.obj[i] = "VV";
         that.words.obj.splice(i+1,3);
         that.syns.obj.splice(i+1,3);
      }
      // rule 18: TO+(VB*)+JJ -> VV.(to keep going)
      else if(val.word == "to" && z.String(that.syns.obj[i+1]).startsWith("VB").true() && z.String(that.syns.obj[i+2]).startsWith("VB").true()){
         val.word += " " + that.words.obj[i+1].word + " " + that.words.obj[i+2].word;
         that.syns.obj[i] = "VV";
         that.words.obj.splice(i+1,3);
         that.syns.obj.splice(i+1,3);
      }
      // rule 19: VBD+TO+VBP -> VV.(stopped to smoke)
      else if(
              z.String(that.syns.obj[i]).startsWith("VB").true() && that.words.obj[i+1] && 
              that.words.obj[i+1].word == "to" && z.String(that.syns.obj[i+2]).startsWith("VB").true()
      )
      {
         val.word += " " + that.words.obj[i+1].word + " " + that.words.obj[i+2].word;
         that.syns.obj[i] = "VV";
         that.words.obj.splice(i+1,3);
         that.syns.obj.splice(i+1,3);
      }
      // rule 20: VBD+(VBG|NN) -> VV.(stopped smoking)
      else if(z.String(that.syns.obj[i]).startsWith("VB").true() && (that.syns.obj[i+1]=="VBG" || that.syns.obj[i+1]=="NN")){
         val.word += " " + that.words.obj[i+1].word;
         that.syns.obj[i] = "VV";
         that.words.obj.splice(i+1,2);
         that.syns.obj.splice(i+1,2);
      }
      // rule 21: VB* -> NNSU(NN subject).
      else if(val.word == "to" && z.String(that.syns.obj[i+1]).startsWith("VB").true()){
         val.word += " " + that.words.obj[i+1].word;
         that.syns.obj[i] = "NNSU";
         that.words.obj.splice(i+1,2);
         that.syns.obj.splice(i+1,2);
      }
      // rule 22: convert any type to adverb if it ends in "ly";
      else if(z.String(val.word).endsWith("ly").true()){
         that.syns.obj[i] = "RB";
      }
      // rule 23: convert a common noun (NN or NNS) to a adjective if it ends with "al"
      else if(z.String(tag).startsWith("NN").true() && z.String(val.word).endsWith("al").true()){
         that.syns.obj[i] = "JJ";
      }
      // rule 24: if a word has been categorized as a common noun and it ends with "s",
      //          then set its type to plural common noun (NNS)
      else if(tag == "NN" && z.String(val.word).endsWith("s").true()){
         that.syns.obj[i] = "NNS";
      }
      return true;
   };

   Object.defineProperty(exports.POSTagger.prototype.deepRules,"version",{value:version,enumerable:false});

   return exports;
});
