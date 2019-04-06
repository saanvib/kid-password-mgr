// chrome.storage.local.set({"signed_in": false}, function() {
// console.log('User signed in');
// });

chrome.storage.local.get('signed_in', function(data) { 
  if (data.signed_in)
  { 
    chrome.browserAction.setPopup({popup: 'passwordscreen.html'}); 
  }
  else
  { 
    chrome.browserAction.setPopup({popup: 'popup_sign_in.html'}); 
  } 
 }); 
