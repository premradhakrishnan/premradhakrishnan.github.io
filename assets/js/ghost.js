// https://github.com/shockey/ghost-external-links/blob/master/ghost-external-links.js

$(document).ready(function() {
    $("a[href^=http]").each(function(){
       var excluded = [
          // format for whitelist: 'google.com', 'apple.com', 'myawesomeblog.com'
          // add your excluded domains here
          ];
       for(i=0; i<excluded.length; i++) {
          if(this.href.indexOf(excluded[i]) != -1) {
             return true;
          }
       }
       if(this.href.indexOf(location.hostname) == -1) {
            $(this).click(function() { return true; }); 
            $(this).attr({
                target: "_blank",
                //title: "Opens in a new window"
            });
            $(this).click();
       }
    })
 });