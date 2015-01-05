var verseDiv = $("<div class='nfe-quote'/>");

var url = "https://labs.bible.org/api/?passage=votd&type=json";

var requestVerse = function(callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);

  req.onreadystatechange = function (){
    if (req.readyState == 4){
      fillupDivs(req,callback);
    }
    else return;
  }

  // req.onload = fillupDivs(req, callback);
  req.send(null);
}

var fillupDivs = function(req, callback) {

  var response = req.responseText;

  var verse = JSON.parse(response)[0];

  console.log(verse);


  // Info panel, hidden by default
  infoPanel = $("<div class='nfe-info-panel'></div>")
  .hide()
  .appendTo(verseDiv);

  quoteText = $("<p>“"+verse.text+"</p>")
  .addClass('nfe-quote-text')
  .appendTo(verseDiv);


  quoteSource = $("<p>~"+verse.bookname+" "+verse.chapter+":"+verse.verse+"</p>")
  .addClass('nfe-quote-source')
  .appendTo(verseDiv);

  console.log(quoteText);
  console.log(verseDiv);

  fbLink = $("<a href='javascript:;'>News Feed Eradicator Bible Version :)</a>")
  .addClass('nfe-info-link')
  .on('click', function(){
    var handleClose = function() {
      $('.nfe-close-button').on('click', hideInfoPanel);
    };
    var url = 'info-panel.html';

    if (window.chrome !== undefined) {
          // Chrome extension
          infoPanel.load(chrome.extension.getURL(url),
           handleClose);
        } else {
          // Firefox extension
          self.port.emit('requestUrl', url);
          self.port.once(url, function(data) {
            console.log("Received data for ", url);
            infoPanel.html(data);
            handleClose();
          });
        }
        infoPanel.show();
      })
  .appendTo(verseDiv);

  callback();

}

var hideInfoPanel = function(){
  $('div.nfe-info-panel').hide();
}


var extensionURL  = function(relativeURL){
  if(window.chrome !== undefined){
        // Chrome extension
        return chrome.extension.getURL(relativeURL);
      }else{
        // Firefox extension
        return self.options.urls[relativeURL];
      }

}


var replaceFacebookItems = function(){

      setInterval(function(){
      // Replace the news feed
      $("div#pagelet_home_stream").replaceWith(verseDiv);
      $("div[id^='topnews_main_stream']").replaceWith(verseDiv);

      // Delete the ticker
      $("div#pagelet_ticker").remove();

      // Delete the trending box
      $("div#pagelet_trending_tags_and_topics").remove();
    }, 1000);
}

requestVerse(replaceFacebookItems);

  // This delay ensures that the elements have been created by Facebook's
  // scripts before we attempt to replace them







