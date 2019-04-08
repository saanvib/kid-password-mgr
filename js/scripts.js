var g_passwordlist = [];

function logout() {
  chrome.storage.local.set({'signed_in': false}, function () {
    window.location.assign("popup.html");
  });
}

function save_passwd() {
    var website_name = document.getElementById("website_name").value;
    var login_id = document.getElementById("login_id").value;
    var passwd = document.getElementById("passwd").value;

    alert(website_name + " " + login_id + " " + passwd);
    chrome.storage.local.get('passwordlist', function(data) {
      g_passwordlist = data.passwordlist;
      g_passwordlist.push({"url":website_name, "login":login_id, "passwd":passwd})
      chrome.storage.local.set({"passwordlist":g_passwordlist}, function() {
          window.location.assign("passwordscreen.html");
      });
    });
     // do not worry about overwriting - just add new


    // var encrypted = CryptoJS.AES.encrypt(JSON.stringify(g_passwordlist), "myPassword");
    // alert(encrypted);
    // var decrypted = CryptoJS.AES.decrypt(encrypted, "myPassword");
    // var str = decrypted.toString(CryptoJS.enc.Utf8);
    //
    // alert(str);

}

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
    var backurl = "popup_sign_in.html";
    var newurl = "color.html";
    if (url.includes("yes")) {
      newurl += "?create=yes";
      backurl += "?create=yes";
    }
    else
      newurl += "?create=no";
    choice = event.target.id;
    chrome.storage.local.set({'animal_choice': choice});
    var backbtn = document.getElementById("back-button");
    if (backbtn)
      backbtn.href = backurl;
    window.location.assign(newurl)
  }
  else if (event.target.className.includes("color")) {
    choice = event.target.id;
    chrome.storage.local.set({'color_choice': choice})
    var url = window.location.href;
    var newurl = "hobbies.html";
    var backurl = "animals.html";
    if (url.includes("yes")) {
      newurl += "?create=yes";
      backurl += "?create=yes";
    }
    else
      newurl += "?create=no";
    var backbtn = document.getElementById("back-button");
    if (backbtn)
      backbtn.href = backurl;
    window.location.assign(newurl)
  }
  else if (event.target.className.includes("hobbies")) {
    var create_path = false;
    var url = window.location.href;
    var backurl = "color.html";
    if (url.includes("yes")) {
      create_path = true;
      backurl += "?create=yes";
    }
    else {
      backurl += "?create=no";
    }
    var backbtn = document.getElementById("back-button");
    if (backbtn)
      backbtn.href = backurl;
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
          chrome.storage.local.set({"account_exists": true});
          window.location.assign("passwordscreen.html");
        }
        else {
          // sign in path
          chrome.storage.local.get('password', function(data) { 
            if (data.password === password) {
              chrome.storage.local.set({"signed_in": true}, function() {
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
  // assuming only one password per url
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
    if (window.location.href.includes("passwordscreen")) {
      passwords_to_table();
      register_copy();
    }
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
    //cell.align = "center";
    var text = document.createTextNode(g_passwordlist[i].login)
    cell.appendChild(text)
    row.appendChild(cell)
    var cell = document.createElement("td")
    cell.align = "center";
    var btn = document.createElement("button")
    btn.className = "copybutton"
    btn.id = g_passwordlist[i].url;
    var img = document.createElement("img");
    img.src = "images/copy-image.png";
    img.style.height = "20px";
    img.style.width = "20px";
    img.id = g_passwordlist[i].url;
    btn.appendChild(img);
    cell.appendChild(btn)
    row.appendChild(cell)
    passwd_table.appendChild(row)
  }
}

//generate a password with num letters and digits mixed
function generate_random_passwd(num_of_letters) {
  var generated_password = "";
  for (var i = 0; i < num_of_letters; i++) {
    var c = Math.round(Math.random());
    if (c===0) {
      // 52 letters (capitalized and non-capitalized)
      var decide = Math.round(Math.random());
      //65 - 90 Capital letters
      // 97-122
      if (decide===0) {
        // small letters
        var small_letter = (Math.round(Math.random() * 26) + 97);
        generated_password += String.fromCharCode(small_letter);
      }
      else {
        // big letters
        var big_letter = (Math.round(Math.random() * 26) + 65);
        generated_password += String.fromCharCode(big_letter);
      }
    }
    else {
      // numbers
      var num = Math.round(Math.random() * 9);
      generated_password+=num;
    }
  }
    return generated_password;
}

function fill_passwd() {
  var passwd = generate_random_passwd(8);
  var p = document.getElementById("passwd");
  p.value = passwd;
  alert(passwd);
}


function register_copy() {
  var copy_button = document.getElementsByClassName("copybutton");
  if (copy_button) {
    var i;
    for (i = 0; i < copy_button.length; i++) {
      copy_button[i].addEventListener("click", copy_to_clipboard)
    }
  }
}


window.onload = function() {
  if (window.location.href.includes("popup.html")) {
    chrome.storage.local.get('signed_in', function(data) { 
      if (data.signed_in)
      { 
        window.location.assign("passwordscreen.html")
      }
      else
      { 
        window.location.assign("popup_sign_in.html")
      } 
     }); 
  }

  if (window.location.href.includes("passwordscreen")) {
    get_password_from_storage()
  }

  if (window.location.href.includes("popup_sign_in")) {
    chrome.storage.local.get('account_exists', function(data) { 
      if (data.account_exists) {
        var btn = document.getElementById("create_account");
        btn.style.display = "none";
      }
      else {
        var btn = document.getElementById("sign_in_button");
        btn.style.display = "none";
      }
    });
  }

  if (window.location.href.includes("createpassword")) {
    var gen_passwd_btn = document.getElementById("generate_passwd");
    if (gen_passwd_btn)
      gen_passwd_btn.addEventListener("click", fill_passwd);

    var passwd_save_btn = document.getElementById("save_info");
      if (passwd_save_btn)
        passwd_save_btn.addEventListener("click", save_passwd);
  }

  var logout_button = document.getElementById('logout');
  if (logout_button) {
    logout_button.addEventListener("click", logout)
  }

  var el = document.getElementById('create_account');
  if (el)
    el.addEventListener("click", create_account);

}
