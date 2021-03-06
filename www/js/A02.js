//收藏

var urlParams = new URLSearchParams(window.location.search);
var categoryselect = urlParams.get('category');
switch (parseInt(categoryselect)) {
  case 1:
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/01.jpg";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/02.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/03.jpg";
    $(".categorytitle").html("客廳翻新");
    $(".categorycaption").html("打造獨特收納空間");
    break;
  case 2:
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/04.jpg";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/05.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/06.jpg";
    $(".categorytitle").html("廚房翻新");
    $(".categorycaption").html("打造獨特收納空間");
    break;
  case 3:
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/08.jpg";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/07.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/09.jpg";
    $(".categorytitle").html("臥室翻新");
    $(".categorycaption").html("打造獨特收納空間");
    break;
  case 4:
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/10.jpg";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/11.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/12.jpg";
    $(".categorytitle").html("浴室翻新");
    $(".categorycaption").html("打造獨特收納空間");
    break;
  case 5:
    category = "技巧";
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/13.png";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/14.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/15.jpg";
    $(".categorytitle").html("技巧改造");
    $(".categorycaption").html("創新收納技巧秘訣");
    break;
  case 6:
    category = "設計";
    var obj1 = document.getElementById("categoryimg1");
    obj1.src = "static/post/16.jpg";
    var obj2 = document.getElementById("categoryimg2");
    obj2.src = "static/post/17.jpg";
    var obj3 = document.getElementById("categoryimg3");
    obj3.src = "static/post/18.jpg";
    $(".categorytitle").html("風格設計");
    $(".categorycaption").html("設計專屬個人風格");
    break;
  default:
    alert("網路連線失敗")
}








var user_email;
var user_token;
document.addEventListener("deviceready", onDeviceReady, false);
var db;
function onDeviceReady() {
  db = window.sqlitePlugin.openDatabase({
    name: 'my.db',
    location: 'default',
  });
  //提醒跳轉
  cordova.plugins.notification.local.on("click", function (notification) {
    window.location.href = 'T01_edit.html?thing=' + notification.thingId + ''
  });
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key, email text, token text, nickname text, backup text)');
  });

  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user', [],
      function (tx, res) {
        var len = res.rows.length;
        if (res.rows.length >= 1) {
          user_email = res.rows.item(0)['email']
          user_token = res.rows.item(0)['token']
          let urlParams = new URLSearchParams(window.location.search);
          var categoryid = urlParams.get('category');
          $.ajax({
            headers: {
              "Authorization": "Token " + user_token + ""
            },
            type: "GET",
            url: "http://140.131.114.157/posts/category/" + categoryid + "",
            error: function (err) {
              alert("請開啟網路連線")
            },
            success: function (res) {
              if (res.length >= 1) {
                for (i = res.length - 1; i >= 0; i--) {
                  var category
                  switch (parseInt(res[i].category)) {
                    case 1:
                      category = "客廳";
                      break;
                    case 2:
                      category = "廚房";
                      break;
                    case 3:
                      category = "臥室";
                      break;
                    case 4:
                      category = "浴室";
                      break;
                    case 5:
                      category = "技巧";
                      break;
                    case 6:
                      category = "設計";
                      break;
                    default:
                      category = "無類別";
                  }
                  var title = res[i].title;
                  if (title.length > 25) {
                    title = res[i].title.substr(0, 24) + "...";
                  }
                  var post = `<div style="position: relative">
                                             <i class="icon collection ion-md-heart" id="post`+ res[i].id + `" onclick="collection('` + res[i].id + `')"></i>
                                             <h6 class="nicknamestyle">`+ res[i].nickname + `</h6>
                                             <p class="likes" id="likes`+ res[i].id + `">` + res[i].likes + `人收藏 </p>
                                             <a href="A03.html?post=`+ res[i].id + `">
                                                 <div class="row card1 border rounded">
                                                     <div class="col left rounded-left ">
                                                         <img src="`+ res[i].image + `">
                                                     </div>
                                                     <div class="col right rounded-right ">
                                                         <h5>`+ category + `收納</h5>
                                                         <h4>`+ title + `</h4>
                                                     </div>
                                                 </div>
                                             </a>
                                         </div>`
                  $(".content").append(post)

                  if (res[i].liked == true) {
                    $("#post" + res[i].id + "").addClass("selectcolor");
                  }

                }
              }
            }
          })
        }
      });
  });
}


function collection(id) {
  $("#post" + id + "").toggleClass("selectcolor");

  $.ajax({
    headers: {
      "Authorization": "Token " + user_token + ""
    },
    type: "POST",
    async: false,
    url: "http://140.131.114.157/posts/" + id + "/like",
    error: function (err) {
      alert("請開啟網路連線")
    }
  })

  $.ajax({
    headers: {
      "Authorization": "Token " + user_token + ""
    },
    type: "GET",
    async: false,
    url: "http://140.131.114.157/posts/" + id + "",
    success: function (res) {
      $("#likes" + id + "").html(res.likes + "人收藏 ");
      // alert(JSON.stringify(res))
    }
  })


}
