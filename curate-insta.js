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
    //Add Toggle to Header
    //Trigger curator on DOMChange
      //Review posts (<article>), flagging reviewed
      //For non-reviewed
        //Add "hide/show" toggle
        //is blacklisted?
          //add "flagged" class
        
        
   jQuery(function($){
      //page toggle click
        //show/hide flagged articles
        //add "hide/show" class to body
     
     //article toggle click
        //add/remove "flagged" class
        //add/remove from local storage blacklist
        //if body.hasClass hide, hide
   });
})();
