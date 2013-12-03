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

   var version = "2.5.1";

   exports.POSTagger = function POSTagger(deep,fn){
        if(!(this instanceof arguments.callee)){
           return new arguments.callee([].slice.call(arguments,0));
        }
        //space for static vars, for reaching out stored results of external processes.
        var callee = arguments.callee;
        var that   = this;
        //initiate lexicon;
        this.lexicon = POSTagger.POSTAGGER_LEXICON;
        this.words   = enumerable();
        this.syns    = enumerable();
        this.synSet  = {};
        this.wordSet = {};
        this.deep  = deep;
        if(deep && it.typeOf(POSTagger.prototype.deepRules)!='function'){
           return z.Promise(
              function(){
                   return zl({
                        url    : "./deepRules.js",
                        cached : false,
                        ctx    : this
                   });
              }
           )
           .Ready(function(fn,callee){
                  fn.apply(this,[callee]);
           }.bind(this,fn,callee));
        }
        else if(it.typeOf(POSTagger.prototype.deepRules)=='function' && it.typeOf(fn)=='function'){
           return fn.apply(this,[callee]);
        }
        else{
           return this;
        }
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
        fromItem = it.typeOf(fromItem) != 'number'?0:fromItem;
        toItem   = it.typeOf(toItem)   != 'number'?this.wordsLength-1:toItem;
        var syns     = [];
        var self     = this;
        //filtering through dict;
        this.words.forEach(function POSTagger_dict2tag_forEach(i,val,a){
            val.word    = val.word.toLowerCase();
            var stemmed = self.stemmer(val.word);
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
        var that   = this;
        fromItem = it.typeOf(fromItem)!='number'?0:fromItem;
        toItem   = it.typeOf(toItem)!='number'?this.wordsLength-1:toItem;
        /**
         * Apply transformational rules
        **/
        this.words.forEach(function POSTagger_applyRules_forEach(i,val,a){
            i              = parseInt(i);
            val            = (it.typeOf(val)=="object" && it.typeOf(val.word)=="string")?val:{word:""};
            var tag        = that.syns.obj[i] || "";
            var nextVerb   = that.nextPOS('VB.*',i+1,i+3);
            var expression = nextVerb!=-1;
            //z.Log({description:val.word+" : "+i+" : "+nextVerb+" : "+expression});
            //when deep grammatical rules required - seperating subject vectors, determiner vectors, object vectors and action vectors;
            return that.deepRules(i,val,tag,nextVerb,expression);
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
        if(this.deep){
           this.applyRules();
        }
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
                    //z.Log({description:POS+" : "+val+" : "+new RegExp(POS).test(val)+" : "+i+" : "+toItem+" : "+(i>=toItem)});
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
        z.Log({description:tagger.inSyns(function(val){return new RegExp('VB*').test(val)},2,5)});
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
   exports.POSTagger.prototype.wordFrequency = function POSTagger_wordFrequency(taggedCorpus,tag,sortingModel){
        if(it.isNotTypeOf(taggedCorpus,[Array,Object,String]).OR().isNotTypeOf(tag,[Array,Object,String]).true()){
           return false;
        }
        this.taggedCorpus = enumerable(it.typeOf(taggedCorpus)=='string'?taggedCorpus.split(' '):taggedCorpus);
        this.tag = enumerable(it.typeOf(tag)=='string'?tag.split(' '):tag);
        this.sortingModel = sortingModel;
        return this.getFrequency();
   };
   exports.POSTagger.prototype.getFrequency = function POSTagger_getFrequency(){
        var ctx=this;
        this.tag=this.tag
        //map all words into sortableWords;
        .eachOfEvery(function POSTagger_getFrequency_mapAllWordsIntoSortableWords(i,val,obj){
          if(it.typeOf(obj.word)=='undefined'){
             return 'continue';
          }
          else if(it.typeOf(ctx.sortableWords)!='array'){
             ctx.sortableWords=[];
          }
          return ctx.sortableWords.push(obj.word);
        })
        //set up frequency of each word occurence;
        .eachOfEvery(function POSTagger_getFrequency_setUpFrequencyInSortableWords(i,val,obj,_length,counter){
          if(it.typeOf(obj.word)=='undefined'){
             return true;
          }
          return (obj.frequency=ctx.sortableWords.join().split(obj.word).length-1);
        })
        //sort against POSTagger.frequencyModel, which can be any external sortingModel
        .sort({againstVal:true,func:this.sortingModel});
        //need to return context to pack the internal results to some external variable;
        return this;
   };
   exports.POSTagger.prototype.get = function POSTagger_get(f,ctx){
        this.tag
        .eachOfEvery(function POSTagger_get_forEach(i,val,obj){
            if(it.typeOf(obj.word)=='undefined' || i!='word'){
               return 'continue';
            }
            return it.typeOf(f)=='function'?f.apply(ctx,[].slice.call(arguments,0)):function(){}();
        });
   };
   //usage:
   //print(new POSTagger().tag(["i", "went", "to", "the", "store", "to", "buy", "5.2", "gallons", "of", "milk"]));

   Object.defineProperty(exports.POSTagger,"version",{value:version,enumerable:false});

   return exports;
});
