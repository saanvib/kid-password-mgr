var input_fields = document.getElementsByTagName("input")

function insert_login(e) {
  var f = e.target;
  var current_url = window.location.href;
  var tab_arr = current_url.split("/");

  current_url = tab_arr[0] +  "//"  + tab_arr[2]
  //alert(current_url)
  chrome.storage.local.get('passwordlist', function(data) { 

    var g_passwordlist = data.passwordlist;
    //alert(g_passwordlist)
    for (var j = 0; j < g_passwordlist.length; j++) {
      if ((current_url === g_passwordlist[j].url) || (current_url+"/" === g_passwordlist[j].url)) {
        f.value = g_passwordlist[j].login;
      }
    }
    });
    return;
}

function insert_pass(e) {
  var f = e.target;
  var current_url = window.location.href;
  var tab_arr = current_url.split("/");

  var passwd = "";

  current_url = tab_arr[0] +  "//"  + tab_arr[2]
  //alert(current_url)
  chrome.storage.local.get('passwordlist', function(data) { 

    var g_passwordlist = data.passwordlist;
    //alert(g_passwordlist)
    for (var j = 0; j < g_passwordlist.length; j++) {
      if ((current_url === g_passwordlist[j].url) || (current_url+"/" === g_passwordlist[j].url)) {
        f.value = g_passwordlist[j].passwd;
      }
    }
    });
    return;
}

for (var i = 0;i < input_fields.length; i++) {
  var f = input_fields[i];
  if (f.type == "password") {
    f.addEventListener("click", insert_pass)
  }
  if (f.type == "text") {
    f.addEventListener("click", insert_login)
  }
}
