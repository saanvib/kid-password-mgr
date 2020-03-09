var input_fields = document.getElementsByTagName("input")

function insert_pass(e) {
  alert("insert_pass")
  // var current_url = window.location.href;
  // var tab_arr = current_url.split("/");
  // var passwd = "";
  //
  // current_url = tab_arr[0] +  "//"  + tab_arr[2]
  // alert(current_url)
  // chrome.storage.local.get('passwordlist', function(data) { 
  //   alert("passlist fetched")
  //
  //   var g_passwordlist = data.passwordlist;
  //   alert(JSON.stringify(g_passwordlist));
  //   for (var j = 0; j < g_passwordlist.length; j++) {
  //     if (current_url === g_passwordlist[j].url) {
  //       alert("pass found")
  //       f.value = g_passwordlist[j].passwd;
  //     }
  //   }
  //   });
  //   break;

}

for (var i = 0;i < input_fields.length; i++) {
  var f = input_fields[i];
  if (f.type == "password") {
    f.addEventListener("click", insert_pass())
  }
}
