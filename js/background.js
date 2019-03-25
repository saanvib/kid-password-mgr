// chrome.storage.local.set({'signed_in': false})
chrome.storage.local.get('signed_in', function(data) { 
  if (data.signed_in)
  { 
    chrome.browserAction.setPopup({popup: 'hobbies.html'}); 
  }
  else
  { 
    chrome.browserAction.setPopup({popup: 'popup_sign_in.html'}); 
  } 
 }); 
