// ==UserScript==
// @name         Instagram Curator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide locally blacklisted images from a browser-based Instagram timeline
// @author       Getzel Rubashkin
// @match        https://www.instagram.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    //load blacklist
    if(typeof localStorage.InstaCurator == 'undefined'){localStorage.InstaCurator=JSON.stringify([]);}
    var blacklist = JSON.parse(localStorage.InstaCurator);

    //Add CSS
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'article header + div{display:none;} article.ic-shown header + div {display:flex !important;}'+
        '.ic-hide_this{-webkit-box-align: center; -webkit-align-items: center;   -ms-flex-align: center;   align-items: center;    background: 0 0;    border: 0;    cursor: pointer;    display: -webkit-box;    display: -webkit-flex;    display: -ms-flexbox;    display: flex;    -webkit-box-flex: 0;    -webkit-flex-grow: 0;    -ms-flex-positive: 0;    flex-grow: 0;    -webkit-box-pack: center;    -webkit-justify-content: center;     -ms-flex-pack: center;    justify-content: center;    min-height: 40px;    min-width: 40px;    padding: 0;}';
    document.getElementsByTagName('head')[0].appendChild(style);

    function instaCurator_init(post){
        var $post = $(post), img = $post.find('header+div img');
        if(typeof img == 'undefined'||typeof img[0]=='undefined'){
            $post.addClass('ic-puzzled');
            console.log($post);
        }else{
            (function(){
                setTimeout(function($post){
                    var src = img[0].currentSrc.split('/').pop();
                    console.log(src,blacklist,blacklist.indexOf(src));
                    //var src = 'abcdefg';
                    //$(this).find('.ic-hide_this').remove();
                    $post.addClass('curated').toggleClass('ic-shown',!isListed(src)).find('section:eq(0)').append('<button class="ic-hide_this" data-src="'+src+'" aria-label="Hide">'+icToggleEye(isListed(src)?'closed':'open')+'</button>');
                },500,$post);
            })();
        }
    }
    function isListed(src){
        return blacklist.indexOf(src)!=-1;
    }
    function addToList(img){
        var list = JSON.parse(localStorage.InstaCurator);
        if(list.indexOf(img)==-1){
            list.push(img);
        }
        localStorage.InstaCurator = JSON.stringify(list);
        return list;
    };
    function removeFromList(img){
        var list = JSON.parse(localStorage.InstaCurator);
        var idx = list.indexOf(img);
        if(idx!==-1){
            list.splice(img,1);
        }
        localStorage.InstaCurator = JSON.stringify(list);
        return list;
    };
    function icToggleEye(mode){
        if(mode=='open'){
            return '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12.01 20c-5.065 0-9.586-4.211-12.01-8.424 2.418-4.103 6.943-7.576 12.01-7.576 5.135 0 9.635 3.453 11.999 7.564-2.241 4.43-6.726 8.436-11.999 8.436zm-10.842-8.416c.843 1.331 5.018 7.416 10.842 7.416 6.305 0 10.112-6.103 10.851-7.405-.772-1.198-4.606-6.595-10.851-6.595-6.116 0-10.025 5.355-10.842 6.584zm10.832-4.584c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 1c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z"/></svg>';
        }else{
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>';
        }

    }
   jQuery(function($){
       $('body').addClass('ic-hide_hidden');
       $('article').each(function(){instaCurator_init($(this)[0]);});

       //Trigger curator on DOMChange
       var observer = new MutationObserver(function(mutationsList) {
           mutationsList.forEach(function(mutation) {
               if(mutation.type == 'childList'&&mutation.addedNodes.length==1&&mutation.addedNodes[0].tagName=='ARTICLE'){
                   instaCurator_init(mutation.addedNodes[0]);
               }
               if(mutation.type == 'childList'&&mutation.addedNodes.length>1){
                   console.log('Assumption Fail');
               }
           });
       });
       observer.observe(document.querySelector('body'), {childList:true,subtree:true});

      //page toggle click
        //show/hide flagged articles
        //add "hide/show" class to body

     //article toggle click
       $('body').on('click', '.ic-hide_this',function(){
           var $p = $(this).parents('article');
           if($p.hasClass('ic-shown')){
               $p.removeClass('ic-shown');
               blacklist = addToList($(this).attr('data-src'));
               $(this).html(icToggleEye('closed'));
           }else{
               $p.addClass('ic-shown');
               blacklist = removeFromList($(this).attr('data-src'));
               $(this).html(icToggleEye('open'));
           }
       });
   });
})();
