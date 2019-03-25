
function sign_in() {
  chrome.storage.local.set({"signed_in": true}, function() {
          console.log('User signed in');
        });
        window.location.assign("animals.html")
}

el = document.getElementById('sign_in_button');
el.addEventListener("click", sign_in);
