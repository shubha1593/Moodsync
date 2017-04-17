$(function() {
  $("#link_form").on("submit", function() {
    console.log("on submit here")
    var link_form = document.getElementById('link_form');
    formData = new FormData(link_form);
    /*
    formData['description'] = $('description').val();
    
    if (formData.has('fancy-checkbox-success-custom-icons')) {
      formData['fancy-checkbox-success-custom-icons'] = "Happy";
    }
    if (formData.has('fancy-checkbox-warning-custom-icons')) {
      formData['fancy-checkbox-warning-custom-icons'] = "Amazed";
    }
    if (formData.has('fancy-checkbox-info-custom-icons')) {
      formData['fancy-checkbox-info-custom-icons'] = "Sad";
    }
    if (formData.has('fancy-checkbox-danger-custom-icons')) {
      formData['fancy-checkbox-danger-custom-icons'] = "Angry";
    }
    */

    for(var pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
    }

    console.log(formData);
    getCurrentTabUrl(function(tab, url) {
      console.log(" in saveLinkToStorage " + url);
      
      localStorage.setItem('formData', JSON.stringify($('form').serialize()));
      localStorage.setItem('linkURL', url);
      console.log(JSON.parse(localStorage.getItem('formData')));
      
      let param = {
                'format': 'png',
                'quality': 100
            };
      
      chrome.tabs.captureVisibleTab(tab.windowId, param, function(dataurl) {
        console.log("in captureVisibleTab *****************");
        formData.append("imageURL", dataurl);
        localStorage.setItem('imageURL', dataurl);
        /*
        storeData("linkURL", url);
        getData("linkURL");
        storeData("imageURL", dataurl);
        getData("imageURL");
        console.log("form data : " + JSON.stringify(formData));
        storeData("formData", JSON.stringify(formData));
        getData("formData");
        */      
      });
      /*window.close();*/
    });
  });
});
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  console.log("In getCurrentTabUrl");
  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(tab, url);
  });
}

function storeData(key, data) {
  console.log("Data : " + data);
  chrome.storage.local.set({key: data}, function() {
    console.log('Data saved for "%s" : "%s"', key, data);
  });
}

function getData(key) {
  chrome.storage.local.get([key], function(items) {
    console.log("stored data : " + JSON.stringify(items));
  });
}