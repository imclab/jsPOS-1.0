//POSTagger.init.js
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
})("POSTagger_init", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";

   var version = "2.5.1";

   //public method of POSTagger;
   //accepting no arguments;
   exports.POSTagger.init = function POSTagger_init(conf){
      var area=z.elem(conf.srcArea);
      if(area){
         area.value=POSTagger.test.testString;
      }
      var keyw;
      if(conf.do=="printTags"){
         keyw=prompt("type syntactic position or word!","NN");
      }
      if((conf.do=="printTags" && keyw) || conf.do!="printTags"){
          var start  = new Date().getTime();
          try{
               POSTagger.work(function POSTagger_worker_thread(deep){
                                  new POSTagger(deep,function POSTagger_worker_cBack(){
                                      var words   = new Lexer().lex(POSTagger.test.testString);
                                      var tags    = this.tag(words);
                                      return self.postMessage({retVal:JSON.stringify({words: words, tags: tags})});
                                  });
                              },
                              {onLoad:POSTagger[conf.do],args:{keyw:keyw,deep:conf.deep,output:conf.output,start:start}}
               );
          }
          catch(e){
               try{
                    new POSTagger(conf.deep,function POSTagger_main_thread(){
                        var words   = new Lexer().lex(POSTagger.test.testString);
                        var tags    = this.tag(words);
                        return POSTagger[conf.do]({words: words, tags: tags},{keyw:keyw,deep:conf.deep,output:conf.output,start:start});
                    });
               }
               catch(e){
                    if(z.devVersion){
                       z.Log({description:'stacked during POSTagging, maybe webworker is not supported! @thread: '+z.trace()});
                    }
               }
          }
          /*
          new POSTagger(conf.deep,function POSTagger_main_thread(){
              var words   = new Lexer().lex(POSTagger.test.testString);
              var tags    = this.tag(words);
              return POSTagger[conf.do]({words: words, tags: tags},{keyw:keyw,deep:conf.deep,output:conf.output,start:start});
          });
          */
      }
   };
   exports.POSTagger.work = function POSTagger_work(fn,args){
      if(it.typeOf(args)!='object'){
         return;
      }
      var worker = new Worker('w.js');
      worker.onmessage = function worker_onmessage(e){
         if(it.typeOf(e)!='object' || !e.data){
            return z.Log({description:e,dump:true});
         }
         else if(e.data && e.data.log){
            return z.Log({description:e.data.log,dump:true});
         }
         return it.typeOf(args.onLoad)=='function'?args.onLoad.apply(it.typeOf(args.ctx)=='object'?args.ctx:null,[JSON.parse(e.data.retVal),args.args]):function(){};
      };
      worker.onerror = function worker_onerror(e){
         //set z.devVersion temporarily;
         z.devVersion=true;
         z.Log({description:'Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message});
         //revert z.devVersion;
         z.devVersion=false;
      };
      return worker.postMessage({fn:fn.toString(),deep:args.args.deep});
   };
   exports.POSTagger.printKeywords = function POSTagger_printKeywords(result,args){
      if(result.type=='promises'){
         return setTimeout(arguments.callee.caller,100);
      }
      else if(it.typeOf(result)!='object' || it.typeOf(args)!='object' || it.typeOf(args.start)=='undefined'){
         if(z.devVersion){
            z.Log({description:'stacked during keyword mining! @thread: '+z.trace()});
         }
         return;
      }
      var output = z.elem(args.output);
      if(it.typeOf(output)!="domObject"){
         return z.Log({description:output+" is not an element in document to output.."});
      }
      //store vars to the main POSTagger constructor static property space;
      var thisFn=zu.getFunc(arguments.callee);
      self[thisFn.substring(0,thisFn.indexOf('_'))].result=result;
      if('NN' in result.tags.synSet){
         var keywords = [];
         new POSTagger(args.deep,function(static){
             this.wordFrequency(static.result.tags.synSet['NN'],POSTagger.frequencyModel)
                 .get(function printKeywords_get(i,val,a){
                        if(POSTagger.POSTAGGER_LEXICON[val]=='DT'){
                           return true;
                        }
                        //if(val=='privacy')alert(keywords);
                        return keywords.push(val);
                 });
                 var ret=[];
                 enumerable(keywords).unredundant().forEach(function(i,val,a){
                     return ret.push(val);
                 });
                 ret.length=3;
                 output.innerHTML="<br /><b>keywords</b>:<br /><br />"+ret.join()+"<br />";
                 var end = new Date().getTime();
                 output.innerHTML+="<br /><br />mining keywords in " + result.words.length + " words in " + (end - args.start) + " milliseconds in vacuumProcess worker";
         });
      }
      z.Effect.bounce();
   };
   exports.POSTagger.printTags = function POSTagger_printTags(result,args){
      if(result=='promises'){
         return setTimeout(arguments.callee.caller,100);
      }
      else if(it.typeOf(result)!='object' || it.typeOf(args)!='object' || it.typeOf(args.keyw)=='undefined' || it.typeOf(args.start)=='undefined'){
         if(z.devVersion){
            z.Log({description:'stacked during printing tags! @thread: '+z.trace()});
         }
         return;
      }
      var output = z.elem(args.output);
      if(it.typeOf(output)!="domObject"){
         return z.Log({description:output+" is not an element in document to output.."});
      }
      //store vars to the main POSTagger constructor static property space;
      var thisFn=zu.getFunc(arguments.callee);
      self[thisFn.substring(0,thisFn.indexOf('_'))].result=result;
      var tag;
      if(args.keyw.toUpperCase() in result.tags.synSet){
         tag=result.tags.synSet[args.keyw.toUpperCase()];
      }
      else if(args.keyw.toLowerCase() in result.tags.wordSet){
         tag=result.tags.wordSet[args.keyw.toLowerCase()];
      }
      else{
         output.innerHTML="<br />Not found in corpus!";
      }
      output.innerHTML="<br />";
      enumerable(tag).forEach(function(i,val){
        output.innerHTML+=" <b>" + (val.word || val.POS) + "</b>"+" [" + (val.word?args.keyw:args.keyw.toUpperCase()) + "] @ " +val.index;
      });
      var end = new Date().getTime();
      output.innerHTML+="<br /><br />Tokenized and tagged " + result.words.length + " words in " + (end - args.start) + " milliseconds in vacuumProcess worker";
      z.Effect.bounce();
      output.innerHTML=output.innerHTML+("<br /><br />"+
                                         "Possible syntactic positions:                   <br /><br />"+
                                         "CC Coord Conjunction                            <b>example: and,but,or</b><br />"+
                                         "CD Cardinal number                              <b>example: one,two</b><br />"+
                                         "DT Determiner                                   <b>example: the,some</b><br />"+
                                         "TO verb prefix                                  <b>example: to</b><br />"+
                                         "EX Existential there                            <b>example: there</b><br />"+
                                         "AUX Auxiliary                                   <b>example: have,do in statement expressions</b><br />"+
                                         "FW Foreign Word                                 <b>example: mon dieu</b><br />"+
                                         "IN Preposition                                  <b>example: of,in,by</b><br />"+
                                         "JJ Adjective                                    <b>example: big</b><br />"+
                                         "JJR Adj., comparative                           <b>example: bigger</b><br />"+
                                         "JJS Adj., superlative                           <b>example: biggest</b><br />"+
                                         "LS List item marker                             <b>example: 1,One</b><br />"+
                                         "MD Modal                                        <b>example: can,should</b><br />"+
                                         "MDN Modal neg                                   <b>example: can't,shouldn't</b><br />"+
                                         "NN Noun, sing. or mass                          <b>example: dog</b><br />"+
                                         "NNSU Noun subject, subject of the sentence      <b>example: dog</b><br />"+
                                         "NNP Proper noun, sing.                          <b>example: Edinburgh</b><br />"+
                                         "NNPS Proper noun, plural                        <b>example: Smiths</b><br />"+
                                         "NNS Noun, plural                                <b>example: dogs</b><br />"+
                                         "POS Possessive ending                           <b>example: \"s</b><br />"+
                                         "PDT Predeterminer                               <b>example: all,both</b><br />"+
                                         "PP$ Possessive pronoun                          <b>example: my,one\"s</b><br />"+
                                         "PRP Personal pronoun                            <b>example: I,you,she</b><br />"+
                                         "RB Adverb                                       <b>example: quickly</b><br />"+
                                         "RBR Adverb, comparative                         <b>example: faster</b><br />"+
                                         "RBS Adverb, superlative                         <b>example: fastest</b><br />"+
                                         "RP Particle                                     <b>example: up,off</b><br />"+
                                         "SYM Symbol                                      <b>example: +,%,&</b><br />"+
                                         "VP Verb phrase                                  <b>example: stopped to smoke</b><br />"+
                                         "VBP Verb, simple present                        <b>example: eat</b><br />"+
                                         "VBPN Verb, simple present negation              <b>example: doesn't eat</b><br />"+
                                         "VBG verb, present continous, gerund             <b>example: eating</b><br />"+
                                         "VBGN verb, present continous, gerund negation   <b>example: isn't eating</b><br />"+
                                         "VBGP verb, present continous passive            <b>example: being eaten</b><br />"+
                                         "VBGPN verb, present continous passive negation  <b>example: isn't being eaten</b><br />"+
                                         "VBPP verb, present perfect                      <b>example: has eaten</b><br />"+
                                         "VBPPN verb, present perfect negation            <b>example: hasn't eaten</b><br />"+
                                         "VBPPP verb, present perfect passive             <b>example: has been eaten</b><br />"+
                                         "VBPPPN verb, present perfect passive negation   <b>example: hasn't been eaten</b><br />"+
                                         "VBPPC verb, present perfect continous           <b>example: has been eating</b><br />"+
                                         "VBPPCN verb, present perfect continous negation <b>example: hasn't been eating</b><br />"+
                                         "VBD verb, simple past tense                     <b>example: ate</b><br />"+
                                         "VBDN verb, simple past tense negation           <b>example: didn’t eat</b><br />"+
                                         "VBN verb, past perfect                          <b>example: had eaten</b><br />"+
                                         "VBNN verb, past perfect negation                <b>example: hadn't eaten</b><br />"+
                                         "VBNP verb, past perfect passive                 <b>example: had been eaten</b><br />"+
                                         "VBNPN verb, past perfect passive negation       <b>example: hadn't been eaten</b><br />"+
                                         "VBNC verb, past perfect continous               <b>example: had been eating</b><br />"+
                                         "VBNCN verb, past perfect continous negation     <b>example: hadn't been eating</b><br />"+
                                         "VBF verb, future tense                          <b>example: will eat</b><br />"+
                                         "VBFN verb, future tense negation                <b>example: won't eat</b><br />"+
                                         "VBFP verb, future perfect tense                 <b>example: will have eaten</b><br />"+
                                         "VBFPN verb, future perfect tense negation       <b>example: won't have eaten</b><br />"+
                                         "VBFPP verb, future perfect passive              <b>example: will have been eaten</b><br />"+
                                         "VBFPPN verb, future perfect passive negation    <b>example: won't have been eaten</b><br />"+
                                         "VBFPC verb, future perfect continous            <b>example: will have been eating</b><br />"+
                                         "VBFPCN verb, future perfect continous negation  <b>example: won't have been eating</b><br />"+
                                         "VBC verb, conditional present tense             <b>example: would eat</b><br />"+
                                         "VBCN verb, conditional present tense negation   <b>example: wouldn't eat</b><br />"+
                                         "VBCPP verb, conditional present perfect         <b>example: would have eaten</b><br />"+
                                         "VBCPPN verb, conditional present perfect neg.   <b>example: wouldn't have eaten</b><br />"+
                                         "VBCPPP verb, conditional present perf. passive  <b>example: would have been eaten</b><br />"+
                                         "VBCPPPN verb, conditional present perf. p. neg. <b>example: wouldn't have been eaten</b><br />"+
                                         "VBCPPC verb, conditional present perfect cont.  <b>example: would have been eating</b><br />"+
                                         "VBCPPCN verb, cond. pres. perf. cont. neg.      <b>example: wouldn't have been eating</b><br />"+
                                         "VBCN verb, conditional past perfect             <b>example: would had eaten</b><br />"+
                                         "VBCNN verb, conditional past perfect negation   <b>example: wouldn't had eaten</b><br />"+
                                         "VBCNC verb, conditional past perfect cont.      <b>example: would had been eating</b><br />"+
                                         "VBCNP verb, conditional past perfect passive    <b>example: would had been eaten</b><br />"+
                                         "VBCNPN verb, cond. past perf. passive negation  <b>example: wouldn't had been eaten</b><br />"+
                                         "VBCNCN verb, cond. past perfect cont. negation  <b>example: wouldn't had been eating</b><br />"+
                                         "WDT Wh-determiner                               <b>example: which,that</b><br />"+
                                         "WP Wh pronoun                                   <b>example: who,what</b><br />"+
                                         "WP$ Possessive-Wh                               <b>example: whose</b><br />"+
                                         "WRB Wh-adverb                                   <b>example: how,where</b><br />"+
                                         ", Comma                                         <b>example: ,</b><br />"+
                                         ". Sent-final punct.                             <b>example: . ! ?</b><br />"+
                                         ": Mid-sent punct.                               <b>example: : ; Ñ</b><br />"+
                                         "$ Dollar sign                                   <b>example: $</b><br />"+
                                         "# Pound sign                                    <b>example: #</b><br />"+
                                         "\" quote                                        <b>example: \"</b><br />"+
                                         "( Left paren                                    <b>example: (</b><br />"+
                                         ") Right paren                                   <b>example: )</b><br />");
   };

   Object.defineProperty(exports.POSTagger.init,"version",{value:version,enumerable:false});

   return exports;
});
