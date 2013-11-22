//lexer.js
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

   exports.LexerNode = function(string,tokenizer){
    	this.string = string;
      this.children = [];
      this.indexes = [];
      var childElements = [];
    	if(string){
    		 var self=this;
         var counter=0;
         string.replace(tokenizer.spaces,function(m1,index,str){
            self.indexes.push((counter==0)?0:index);
            counter+=1;
         });
         childElements = enumerable(string.split(tokenizer.spaces));
         childElements.forEach(function(i,val,a){
           a[i]=a[i].replace(tokenizer.extra,'');
           if(tokenizer.comma.test(a[i])){
              a[i]=a[i].replace(tokenizer.comma,'');
              a.splice(i,0,',');
           }
           if(tokenizer.dot.test(a[i])){
              a[i]=a[i].replace(tokenizer.dot,'');
              a.splice(i,0,'.');
           }
           if(tokenizer.exclamation.test(a[i])){
              a[i]=a[i].replace(tokenizer.exclamation,'');
              a.splice(i,0,'!');
           }
           if(tokenizer.question.test(a[i])){
              a[i]=a[i].replace(tokenizer.question,'');
              a.splice(i,0,'?');
           }
         });
         if(childElements.obj[childElements.obj.length-1]==''){
            childElements.obj.pop();
         }
         else if(childElements.obj[0]==''){
            childElements.obj.shift();
         }
    	}
    	if(childElements.obj.length==0){
         this.children = [string];
    	}
      else{
         this.children = childElements.obj;
      }
   };
   exports.LexerNode.prototype.fillArray = function(array){
      for(var i in this.children){
          array.push({word:this.children[i],index:(i==this.children.length-1)?this.indexes[i-1]+this.children[i].length:this.indexes[i]});
      }
   };
   exports.LexerNode.prototype.toString = function(){
      var array = [];
      this.fillArray(array);
      return array.toString();
   };
   exports.Lexer = function(){
    	// Split by punctuation, numbers, then whitespace;
      this.tokenizer = {
                          comma       : /[\,]/g,  //mid-sentence punctuation;
                          dot         : /[\.]/g, //end-sentence punctuation;
                          exclamation : /[\!]/g, //end-sentence punctuation;
                          question    : /[\?]/g, //end-sentence punctuation;
                          numbers     : /[0-9]*\.[0-9]*/g,
                          spaces      : /[\s\t\n\r]+/g,
                          extra       : /[\[\]\(\{\}\)\`\´\¨\“\”\‘\′\‛\‟\„\˝\〟\〞\〝\＂\＇\'\"\:\-\_\$\^\%\&\|\±\§\@\*]+/g
                       };
      return this;
   };
   exports.Lexer.prototype.lex = function(string){
    	var array = [];
      var node = new LexerNode(string, this.tokenizer);
      node.fillArray(array);
      return array;
   };
   //usage:
   //print(new Lexer().lex("I made $5.60 today in 1 hour of work.  The E.M.T.'s were on time, but only barely.").toString());

    exports.Lexer.version = version;
    return exports;
});
