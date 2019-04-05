function logout() {
  chrome.storage.local.set({'signed_in': false});
  window.location.assign("popup_sign_in.html")
}
var add_a_password = document.getElementById("addpassword")
if (add_a_password) {
add_a_password.addEventListener("click", add_password)
}
function add_password() {
window.location.assign("createpassword.html");
}
var g_passwordlist = null;
function sign_in() {
  window.location.assign("animals.html?create=no")
}

function create_account() {
  window.location.assign("animals.html?create=yes")
}

function register_choice(event) {
// we have to find out which image the user chose, because they all have the same class
  var choice = "";
  if (event.target.className.includes("animals")) {
    var url = window.location.href;
    var newurl = "color.html";
    if (url.includes("yes")) {
      newurl += "?create=yes";
    }
    else
      newurl += "?create=no";
    choice = event.target.id;
    chrome.storage.local.set({'animal_choice': choice});
    window.location.assign(newurl)
  }
  else if (event.target.className.includes("color")) {
    choice = event.target.id;
    chrome.storage.local.set({'color_choice': choice})
    var url = window.location.href;
    var newurl = "hobbies.html";
    if (url.includes("yes")) {
      newurl += "?create=yes";
    }
    else
      newurl += "?create=no";
    window.location.assign(newurl)
  }
  else if (event.target.className.includes("hobbies")) {
    var create_path = false;
    var url = window.location.href;
    if (url.includes("yes")) {
      create_path = true;
    }
    choice = event.target.id;
    chrome.storage.local.set({'hobby_choice': choice});
    var animalchoice = "";
    var colorchoice = "";
    chrome.storage.local.get('animal_choice', function(data) { 
      var animalchoice = data.animal_choice;
      chrome.storage.local.get('color_choice', function(data) { 
        var colorchoice = data.color_choice;
        var password = colorchoice + animalchoice + choice;
        // save the password so that it can be checked later (scenario for creating a password)
        if (create_path) {
          chrome.storage.local.set({"password": password});
          alert("password is: " + password);
          window.location.assign("passwordscreen.html");
        }
        else {
          // sign in path
          chrome.storage.local.get('password', function(data) { 
            if (data.password === password) {
              chrome.storage.local.set({"signed_in": true}, function() {
              console.log('User signed in');
              window.location.assign("passwordscreen.html");
              });
            }
            else {
              alert("Wrong password! Try again!")
              window.location.assign("popup_sign_in.html")
            }
          });
        }
       }); 
     }); 




  }
}

function copy_to_clipboard(event)  {
  // str is the password
  var url = event.target.id;

  str = get_password_for_url(url)
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

var el = document.getElementById('sign_in_button');
if (el)
  el.addEventListener("click", sign_in);
var x = document.getElementsByClassName("userchoice");
if (x) {
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].addEventListener("click", register_choice)
  }
}
var logout_button = document.getElementById('logout')
if (logout_button)
  logout_button.addEventListener("click", logout)
var el = document.getElementById('create_account');
if (el)
  el.addEventListener("click", create_account);


// {"passwordlist":[{"url":"https://www.google.com", "login":"saanvi.bhargava@gmail.com", "passwd":"password1111"}, ]}
function get_password_for_url(url) {
  for (var i = 0; i < g_passwordlist.length; i++) {
    if (url === g_passwordlist[i].url) {
      return g_passwordlist[i].passwd;
    }
  }

}

function get_password_from_storage() {
  chrome.storage.local.get('passwordlist', function(data) { 
    g_passwordlist = data.passwordlist;
    passwords_to_table();
    register_copy();
      });
}


function passwords_to_table() {

  var passwd_table = document.getElementById("passwordtable");
  if (!passwd_table)
    return;

  for (var i = 0; i < g_passwordlist.length; i++) {
    var row = document.createElement("tr")
    var cell = document.createElement("td")
    var text = document.createTextNode(g_passwordlist[i].url)
    cell.appendChild(text)
    row.appendChild(cell)
    var cell = document.createElement("td")
    var text = document.createTextNode(g_passwordlist[i].login)
    cell.appendChild(text)
    row.appendChild(cell)
    var cell = document.createElement("td")
    var btn = document.createElement("button")
    btn.className = "copybutton"
    btn.id = g_passwordlist[i].url;
    btn.innerHTML = "Copy";
    cell.appendChild(btn)
    row.appendChild(cell)
    passwd_table.appendChild(row)
  }
}

get_password_from_storage()

function register_copy() {
  var copy_button = document.getElementsByClassName("copybutton");
  if (copy_button) {
    var i;
    for (i = 0; i < copy_button.length; i++) {
      copy_button[i].addEventListener("click", copy_to_clipboard)
    }
  }
}
