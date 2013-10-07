importScripts(
              './../../z/utils/it.js',
              './../../z/utils/enumerable.js',
              './../../z/utils/z.js',
              './lexer.js',
              './POSTagger.js',
              './lexicon.js',
              './corpus.js'
);
self.onmessage = function(e){
    var data = e.data;
    if(!data){
       z.Log({description: 'no data has been passed to worker!'});
    }
    else if(data.fn && it.typeOf(eval('self.fn='+data.fn))=='function'){
       eval('('+data.fn+')('+data.deep+')');
    }
    else{
       z.Log({description: data.fn+' is not a function is a '+it.typeOf(eval('self.fn='+data.fn))});
    }
};
