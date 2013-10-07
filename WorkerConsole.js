//WorkerConsole.js
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
})("worker", function(exports){
   //we need to use eval, so do not "use strict"
   //"use strict";

   if(typeof require != 'undefined'){
      require('./../../../../z/utils/z.js');
   }

   //do not load module without support!
   if(z.noSupport()){
      return exports;
   }

   if(exports.Worker){
      var version = '3.9.13-05';

      // Remember the original Worker() constructor
      exports._Worker = exports.Worker;

      // Make Worker writable, so we can replace it.
      Object.defineProperty(exports, "Worker", {writable: true});

      // Replace Worker constructor with new augmented version
      exports.Worker = function Worker(url,onmessage,onerror){
            var w = new _Worker(url);
            w.onmessage = function(e) {
                if(e.data.log){
                   z.Log({description:'log message from worker '+e.data.log});
                }
                else{
                   onmessage(e);
                }
            }
            w.onerror = function(e) {
                onerror(e);
            }
            return w;
      };

      Object.defineProperty(exports.Worker,"version",{value:version,enumerable:false});

   }

   return exports;
});
