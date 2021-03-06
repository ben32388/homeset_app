$("#insertfname").change(function () {
    $("#fnwarn").html("");
});

var user_email;
var user_token;
var user_id;

//資料庫
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS space (id text primary key, name text, number integer, space_color text, planargraph_id text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS thing (id text primary key, name text, description text, image text, category text, owner text, furniture_id text, number integer, layer text, out integer, remind integer, time date, content text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS furniture (id text primary key, name text, image text, layer text, space_id text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS page (id integer primary key, home integer, furniture_page integer, search_page integer, post_page integer)');
    });

    let urlParams = new URLSearchParams(window.location.search);
    var spaceId = urlParams.get('space');

    db.transaction(function (tx) {

        tx.executeSql('SELECT * FROM user', [],
            function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    user_email = res.rows.item(0)['email'];
                    user_token = res.rows.item(0)['token'];
                    user_id = res.rows.item(0)['id'];

                    // qrcode 掃描跳轉 homeset://
                    window.handleOpenURL = function (url) {
                        var open = url.split("/")[2]
                        var spaceId = open.split("=")[1].slice(0, 13)
                        var furnitureId = open.split("=")[2].slice(0, 13)
                        var email = user_email.replace(/@/g, "").split(".").join("");
                        location.replace("F01.html?space=" + email + spaceId + "&furniture=" + email + furnitureId + "");
                        // window.location.hash = url.slice(7) 
                    }

                }
            });

        tx.executeSql('SELECT * FROM space WHERE id = ?', [spaceId],
            function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    $("#stitle").html(res.rows.item(0)['name'])
                }
            });


        tx.executeSql('SELECT * FROM furniture WHERE space_id = ?', [spaceId], function (tx, res) {
            var len = res.rows.length;
            if (res.rows.length >= 1) {
                for (var i = 0; i < len; i++) {
                    $(".flex").append(`<div id='fpress` + res.rows.item(i)['id'] + `' onclick='fidclick("` + res.rows.item(i)['id'] + `")'><img src='` + res.rows.item(i)['image'] + `' height='90' width='90' class='square' id='` + res.rows.item(i)['id'] + `' onclick='fclick("` + res.rows.item(i)['id'] + `")'><div class='content' id='fname` + res.rows.item(i)['id'] + `'>` + res.rows.item(i)['name'] + `</div></div>`)

                    //fdclick fdd 為儲物櫃刪除互動視窗
                    var fdd = `<div class="modal fade" id="fdd` + res.rows.item(i)['id'] + `" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel5" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content" style="margin-top: 50%;border-radius: 5%;">
                                    <div class="modal-body text-black">
                                        <p>是否要刪除<spen id="fdname`+ res.rows.item(i)['id'] + `">` + res.rows.item(i)['name'] + `</spen>?</p>
                                        <div class="row" style="text-align: center">
                                            <div class="col">
                                                <button type="button" class="btn btn-outline-secondary" onclick="fddc('`+ res.rows.item(i)['id'] + `')">取消</button>
                                            </div>
                                            <div class="col">
                                                <button type="submit" class="btn btn-outline-secondary" onclick="fddv('`+ res.rows.item(i)['id'] + `')">確認</button>
                                            </div>
                                        </div>
                                    </div>
                               </div>
                             </div>
                            </div>`

                    $("body").append(fdd);

                    //atd 為增加物品的互動視窗
                    var atd = `<div class="modal" id="atd` + res.rows.item(i)['id'] + `" tabindex="-1" role="dialog" aria-labelledby="atd` + res.rows.item(i)['id'] + `" aria-hidden="true">
                                <div class="modal-dialog modal-xl" role="document" style="margin: 0px;position: absolute;bottom:0px; max-width: 1500px;width:100vw;">
                                    <div class="modal-content">
                                        <div class="modal-body " style="background-color: rgb(255, 255, 255);padding: 5px 0px 16px 0px;">
                                            <div class="row objcenter">
                                                <p style="margin:0px ;">新增物品從</p>
                                            </div>
                                            <hr style="margin: 5px 0px 16px 0px">
                                            <div class="row objcenter">
                                                <a href="T01_insert.html?furniture=`+ res.rows.item(i)['id'] + `">單筆建立</a>
                                            </div>
                                            <hr>
                                            <div class="row objcenter">
                                                <a href="javascript:;" onclick="imgbatch('`+ res.rows.item(i)['id'] + `')">多筆建立</a>
                                            </div>
                                            <hr>
                                            <div class="row objcenter">
                                                <a href="javascript:;" onclick="tcancel('`+ res.rows.item(i)['id'] + `')">取消</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    $("body").append(atd);
                    //fnclick fned 為儲物櫃名稱編輯修改互動視窗
                    var fned = `<div class="modal fade " id="fned` + res.rows.item(i)['id'] + `" tabindex="-1" role="dialog" aria-labelledby="fned` + res.rows.item(i)['id'] + `" aria-hidden="False">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content" style="border-radius: 5%;">
                                    <div class="modal-body text-black">
                                        <form id='fnform'>
                                            <div style="margin-bottom:10px;">
                                                <label for="furniturename">儲物櫃名稱</label>
                                                <P id="fndwarn" style="display:inline-flex;color: red;margin:0px;"></P>
                                                <input type="text" class="form-control" id="furniturename`+ res.rows.item(i)['id'] + `" value="` + res.rows.item(i)['name'] + `" required>
                                            </div>
                                            <div style="margin-bottom:10px;">
                                            <label for="furniturename">夾層數量</label>
                                            <button type="button" class="btn btn-outline " id="updateflayer`+ res.rows.item(i)['id'] + `">` + res.rows.item(i)['layer'] + `</button>
                                            </div>
                                            <label>照片</label>
                                            <div style="margin-bottom: 10px;">
                                                <div style="position: relative;" class="fit">
                                                    <div id="feimg`+ res.rows.item(i)['id'] + `" class="fit">
                                                        <img src="` + res.rows.item(i)['image'] + `" class="fephotothumb" id="fimagedit` + res.rows.item(i)['id'] + `">
                                                    </div>
                                                    <div class='camera' >
                                                        <i class='icon ion-ios-camera' onclick="fpem('`+ res.rows.item(i)['id'] + `')"></i>
                                                    </div>
                                                </div>
                                            </div>
                                                <div class="row" style="text-align: center">
                                                    <div class="col">
                                                        <button type="button" class="btn btn-outline-secondary" onclick="fndc('`+ res.rows.item(i)['id'] + `')">取消</button>
                                                    </div>

                                                    <div class="col">
                                                        <button type="button" class="btn btn-outline-secondary" onclick="fndv('`+ res.rows.item(i)['id'] + `')">確認</button>
                                                    </div>
                                                </div>
                                        </form>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    $("body").append(fned);
                    // 為fned修改夾層的滾輪
                    var layerselect = `<script>
                                var layers`+ res.rows.item(i)['id'] + ` = new MobileSelect({
                                trigger: '#updateflayer`+ res.rows.item(i)['id'] + `',
                                title: '夾層',
                                cancelBtnColor: '#f0f0f0',
                                ensureBtnColor: '#f0f0f0',
                                titleBgColor: '#254F6E',
                                titleColor: '#f0f0f0',
                                ensureBtnText: '確認',
                                wheels: [
                                    { data: ['無夾層', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'] }
                                ],
                                position: [0] //初始化定位

                            });
                            <\/script>`;

                    $("body").append(layerselect);


                }



                let urlParams = new URLSearchParams(window.location.search);
                var furnitureId = urlParams.get('furniture');
                if (!furnitureId) {
                    fidclick(res.rows.item(0)['id'])
                    fclick(res.rows.item(0)['id'])
                } else {
                    fidclick(furnitureId)
                    fclick(furnitureId)
                }

            }
            tx.executeSql("SELECT * FROM page", [],
                function (tx, res) {
                    var len = res.rows.length;
                    if (res.rows.length >= 1) {
                        var furniture_page = res.rows.item(0)['furniture_page']
                        if (!furniture_page) {
                            $(".lead").css('display', 'block');
                        }
                    }
                });
        });
    });

}

function lead() {
    $(".lead").css('display', 'none');
    db.transaction(function (tx) {
        tx.executeSql("UPDATE page SET furniture_page = ? WHERE id = ?", [1, 1], function (tx, res) {
            location.reload()
        });
    });
}
function lead2() {
    $(".lead").css('display', 'none');
}

// 生成pdf base64
function createpdf() {

    let options = {
        documentSize: 'A4',
        type: 'base64'
    }
    var furniturepdf = $("#furniturepdf").html()
    pdf.fromData(furniturepdf, options)
        .then((base64) => furnitureshare(base64))
        .catch((err) => alert("請開啟網路連線"))
}

//分享
function furnitureshare(name) {
    var fnamepdf = $("#fnamepdf").html()
    var fplacepdf = $("#fplacepdf").html()

    var options = {
        message: fplacepdf,
        subject: fnamepdf,
        files: ['data:application/pdf;base64,' + name + ''],
    };

    var onSuccess = function (result) {
        //alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        //alert("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function (msg) {
        alert("請開啟網路連線");
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

// 點選儲物櫃後跳出來的物品，夾層依照櫃子定義的層數跑回圈where去抓裡面有的東西

function shrink(x) {
    $("#" + x + "").slideToggle();
}



function fidclick(x) {
    let urlParams = new URLSearchParams(window.location.search);
    var spaceId = urlParams.get('space');
    window.history.pushState({}, 0, "F01.html?space=" + spaceId + "&furniture=" + x + "")
    var spaceId1 = spaceId.slice(-13)
    var furnitureId1 = x.slice(-13)

    $(".addthings").html("")

    //右下角功能鍵
    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM page", [],
            function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    var furniture_page = res.rows.item(0)['furniture_page']
                    if (furniture_page == 1) {
                        $('.lead').attr('onclick', 'lead2()');
                        $(".lead").css('display', 'block');
                        $("#leadarrow").removeClass("arrow")
                        $("#leadarrow").addClass("editarrow")
                        $("#leadcaption").removeClass("caption")
                        $("#leadcaption").addClass("editcaption")
                        $("#leadcaption").html("點擊可以<br>新增物品 / 編輯儲物櫃<br>刪除儲物櫃 / 分享")
                        $("#leadknow").removeClass("know")
                        $("#leadknow").addClass("editknow")
                        tx.executeSql("UPDATE page SET furniture_page = ? WHERE id = ?", [2, 1]);
                    }
                }
            });

        tx.executeSql('SELECT * FROM thing WHERE furniture_id = ?', [x],
            function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    $("#tcount").html(len);
                } else {
                    $("#tcount").html(0);
                }
            });
        tx.executeSql('SELECT * FROM furniture WHERE id = ?', [x],
            function (tx, res) {
                $("#lcount").html(res.rows.item(0)['layer']);
                var addthing = `<nav class="cd-stretchy-nav">
                    <div></div>
                    <a class="cd-nav-trigger" href="#0">        
                    <span aria-hidden="true"></span>
                    </a>
                    <ul>
                        <li><a href="#0" onclick="thingaddclick( '`+ res.rows.item(0)['id'] + `' )"><span>新增物品 <i class="icon ion-md-add" style="font-size:35px;color:rgb(255, 255, 255);padding:0 20px 0 20px"></i></span></a></li>
                        <li><a href="#0" onclick="fnclick('` + res.rows.item(0)['id'] + `','` + res.rows.item(0)['name'] + `','` + res.rows.item(0)['layer'] + `')"><span>編輯儲物櫃<i class="icon ion-ios-create" style="font-size:35px;color:rgb(255, 255, 255);padding:0 14px 0 20px"></i></span></a></li>
                        <li><a href="#0" onclick="fdclick('`+ res.rows.item(0)['id'] + `')"><span>刪除儲物櫃<i class="icon ion-ios-trash" style="font-size:35px;color:rgb(255, 255, 255);padding:0 20px 0 25px"></i></span></a></li>
                        <li><a href="#0" onclick="createpdf('`+ res.rows.item(0)['name'] + `')"><span>分享<i class="icon ion-ios-share" style="font-size:35px;color:rgb(255, 255, 255);padding:0 20px 0 25px"></i></span></a></li>
                    </ul> 
                    <span aria-hidden="true" class="stretchy-nav-bg"></span>
                    </nav>`;
                $(".addthings").append(addthing);

                if ($('.cd-stretchy-nav').length > 0) {
                    var stretchyNavs = $('.cd-stretchy-nav');

                    stretchyNavs.each(function () {
                        var stretchyNav = $(this),
                            stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');

                        stretchyNavTrigger.on('click', function (event) {
                            event.preventDefault();
                            stretchyNav.toggleClass('nav-is-visible');
                        });
                    });

                    $(document).on('click', function (event) {
                        (!$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span')) && stretchyNavs.removeClass('nav-is-visible');
                    });
                }
                $("#fimgpdf").attr('src', res.rows.item(0)['image']);
                $("#fnamepdf").html(res.rows.item(0)['name']);
                $("#flayerpdf").html(res.rows.item(0)['layer']);
                tx.executeSql('SELECT * FROM space WHERE id = ?', [res.rows.item(0)['space_id']],
                    function (tx, res) {
                        var spacename = res.rows.item(0)['name']
                        tx.executeSql('SELECT * FROM planargraph WHERE id = ?', [res.rows.item(0)['planargraph_id']],
                            function (tx, res) {
                                $("#fplacepdf").html(res.rows.item(0)['name'] + " " + spacename);
                            })
                    })

            });
    });

    //呈現物品
    db.transaction(function (tx) {
        $(".box-wrap").html("");
        $("#thingpdf").html("");
        tx.executeSql('SELECT DISTINCT layer FROM thing WHERE furniture_id = ? ORDER BY layer DESC', [x], function (tx, res) {
            var len = res.rows.length;

            if (res.rows.length >= 1) {
                for (var i = 0; i < len; i++) {
                    var num = res.rows.item(i)['layer'];

                    if (!num) {
                        var tr = function (num, i) {
                            tx.executeSql('SELECT * FROM thing WHERE (layer IS NULL OR layer="") AND furniture_id = ?', [x], function (tx, res) {
                                $(".box-wrap").append(`<p onclick='shrink("shrink` + x + i + `")'><span>尚未編輯完成<i class='icon ion-md-arrow-dropdown'></i></span></p><hr/>`)
                                $("#thingpdf").append(`<p style="color:black;display:flex;width: 100%;border-bottom:solid 1px #f4c82ae7;"><span
                                                        style="padding: 5px;background-color: #f4c82ae7;">尚未編輯完成</span></p>`)
                                var len = res.rows.length;
                                if (res.rows.length >= 1) {
                                    var warn
                                    $(".box-wrap").append('<div class="shrink" id ="shrink' + x + i + '"></div>')
                                    $("#thingpdf").append('<div id ="notedit" style="margin-left:50px"></div>')
                                    for (var j = 0; j < len; j++) {

                                        if (res.rows.item(j)['out'] == 1) {
                                            warn = "<i class='icon ion-md-information-circle iwarn'></i>";
                                        } else {
                                            warn = "";
                                        }
                                        $("#shrink" + x + i + "").append(`<div class="box">
                                                        `+ warn + `
                                                        <a href="T01_edit.html?thing=`+ res.rows.item(j)['id'] + `"><img src="` + res.rows.item(j)['image'] + `" style=width:100%;height:100%></a>
                                                        </div>`)

                                        $("#notedit").append(`<div style="margin:0px 5px 8px 0px;display:inline-flex;">
                                                                <img src="` + res.rows.item(j)['image'] + `" width="150" height="150">
                                                                </div>
                                                                `)

                                    }
                                    $("#shrink" + x + i + "").slideDown(0);
                                }
                            });
                        }(num, i)
                    } else if (num == "無夾層") {
                        var tr = function (num, i) {
                            tx.executeSql('SELECT * FROM thing WHERE layer = ? AND furniture_id = ?', [num, x], function (tx, res) {
                                var len = res.rows.length;
                                if (res.rows.length >= 1) {
                                    var warn
                                    $(".box-wrap").append('<div class="shrink" id ="shrink' + x + i + '"></div>')
                                    $(".box-wrap").append('<p style="width: 100vw;height: 7px;"></p>')

                                    for (var j = 0; j < len; j++) {
                                        if (res.rows.item(j)['out'] == 1) {
                                            warn = "<i class='icon ion-md-information-circle iwarn'></i>";
                                        } else {
                                            warn = "";
                                        }
                                        $("#shrink" + x + i + "").append(`<div class="box">
                                                        `+ warn + `
                                                        <a href="T01_edit.html?thing=`+ res.rows.item(j)['id'] + `"><img src="` + res.rows.item(j)['image'] + `" style=width:100%;height:100%></a>
                                                        </div>`)

                                        $("#thingpdf").append(`<div style="display: -ms-flexbox;display: flex;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;margin-top: 10px;">
                                                        <div style="-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%; align-items: center;justify-content: center;text-align: center;">
                                                            <img src="` + res.rows.item(j)['image'] + `" width="150" height="150">
                                                        </div>
                                                        <div style="-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;color:black;">
                                                            <p style="margin-bottom: 5px;">物品名稱: ` + res.rows.item(j)['name'] + `</p>
                                                            <p style="margin-bottom: 5px;">內容: ` + res.rows.item(j)['description'] + `</p>
                                                            <p style="margin-bottom: 0px;">數量: ` + res.rows.item(j)['number'] + `</p>
                                                        </div>
                                                    </div>`)
                                    }
                                }
                            });
                        }(num, i)
                    } else {
                        var tr = function (num, i) {
                            tx.executeSql('SELECT * FROM thing WHERE layer = ? AND furniture_id = ?', [num, x], function (tx, res) {
                                $(".box-wrap").prepend('<p style="width: 100vw;height: 7px;"></p>')
                                $(".box-wrap").prepend('<div class="shrink" id ="shrink' + x + i + '"></div>')
                                $(".box-wrap").prepend(`<p onclick='shrink("shrink` + x + i + `")'><span>第` + num + `層<i class='icon ion-md-arrow-dropdown'></i></span></p><hr/>`)
                                $("#thingpdf").prepend('<div id ="thingpdf' + x + i + '"></div>')
                                $("#thingpdf").prepend(`<p style="color:black;display:flex;width: 100%;border-bottom:solid 1px #f4c82ae7;"><span
                                                        style="padding: 5px;background-color: #f4c82ae7;">第` + num + `層</span></p>`)

                                var len = res.rows.length;

                                if (res.rows.length >= 1) {
                                    var warn

                                    for (var j = 0; j < len; j++) {
                                        if (res.rows.item(j)['out'] == 1) {
                                            warn = "<i class='icon ion-md-information-circle iwarn'></i>";
                                        } else {
                                            warn = "";
                                        }
                                        $("#shrink" + x + i + "").append(`<div class="box">
                                                        `+ warn + `
                                                        <a href="T01_edit.html?thing=`+ res.rows.item(j)['id'] + `"><img src="` + res.rows.item(j)['image'] + `" style=width:100%;height:100%></a>
                                                        </div>`)
                                        $("#thingpdf" + x + i + "").append(`<div style="display: -ms-flexbox;display: flex;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;margin-top: 10px;">
                                                        <div style="-ms-flex: 0 0 33.333333%;flex: 0 0 33.333333%;max-width: 33.333333%; align-items: center;justify-content: center;text-align: center;">
                                                            <img src="` + res.rows.item(j)['image'] + `" width="150" height="150">
                                                        </div>
                                                        <div style="-ms-flex: 0 0 66.666667%;flex: 0 0 66.666667%;max-width: 66.666667%;color:black;">
                                                            <p style="margin-bottom: 5px;">物品名稱: ` + res.rows.item(j)['name'] + `</p>
                                                            <p style="margin-bottom: 5px;">內容: ` + res.rows.item(j)['description'] + `</p>
                                                            <p style="margin-bottom: 0px;">數量: ` + res.rows.item(j)['number'] + `</p>
                                                        </div>
                                                    </div>`)
                                    }
                                    $("#shrink" + x + i + "").slideDown(0);
                                }
                            });
                        }(num, i)
                    }

                }
            }
        });
    });
}



// 按鈕點選變色，點另一个按紐顏色還原
var t = null;
function fclick(x) {
    // 這個是判斷第一次點選
    document.getElementById(x).style.height = "110px";
    document.getElementById(x).style.width = "110px";
    document.getElementById(x).style.border = "3px solid yellow";
    //螢幕寬度
    var w = $(document).width()
    //點選的位置
    var set = $("#" + x + "").offset();
    //螢幕上左邊第一個的位置
    var first = $(".flex").scrollLeft()

    if (set.left > w) {
        $(".flex").animate({ scrollLeft: set.left }, 0);
    } else if (set.left > w * 0.75) {
        $(".flex").animate({ scrollLeft: first + w * 0.65 }, 300);
    } else if (set.left < 0) {
        $(".flex").animate({ scrollLeft: first - w * 0.65 }, 300);
    }

    if (t != null & x != t) {
        document.getElementById(t).style.height = "90px";
        document.getElementById(t).style.width = "90px";
        document.getElementById(t).style.border = "0px ";
    }
    t = x;
};

function thingaddclick(id) {
    $('#atd' + id + '').modal('show');
}


// 新增物品的取消
function tcancel(id) {
    $('#atd' + id + '').modal('hide');
}

//fnclick fned 為儲物櫃名稱編輯修改互動視窗
function fnclick(id, name, layer) {
    // $('#fed' + id).modal('hide')

    $('#fned' + id + '').modal('show')
}

// fndc 為儲物櫃名稱編輯修改互動視窗的取消鍵
function fndc(id) {
    $("#fned" + id + "").modal('hide')
}
// fndv 為儲物櫃名稱編輯修改互動視窗的確認鍵,更新資料庫
function fndv(id) {
    var name = $("#furniturename" + id + "").val();
    if (!name) {
        $('#fndwarn').html('<i class="icon ion-md-information-circle"></i>');
        $('#fndwarn').append("請輸入儲物櫃名稱");
        $('#fnform').addClass("was-validated");
        return
    }
    var updateflayer = $("#updateflayer" + id + "").text();


    var img = document.getElementById("fimagedit" + id + "").src;

    db.transaction(function (tx) {
        var query = "UPDATE furniture SET name = ?,layer = ?,image = ? WHERE id = ?";
        tx.executeSql(query, [name, updateflayer, img, id], function (tx, res) {
            // fidclick(id);
            // fclick(id);
            var obj = document.getElementById("" + id + "");
            obj.src = img;
            // $("#fpoint" + id + "").text(name);
            $("#fname" + id + "").text(name);
            // $("#fpname" + id + "").text(name);
            $("#fdname" + id + "").text(name);
            $("#fsname" + id + "").text(name);
            $("#fned" + id + "").modal('hide');
        });

        if (updateflayer == "無夾層") {
            tx.executeSql("SELECT * FROM thing WHERE furniture_id = ?", [id], function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    for (var i = 0; i < len; i++) {
                        var layernum = res.rows.item(i)['layer']
                        var thingId = res.rows.item(i)['id']
                        var tran = function (layernum, thingId) {
                            if (!layernum) {
                            } else {
                                db.transaction(function (tx) {
                                    tx.executeSql("UPDATE thing SET layer = ? WHERE id = ?", [updateflayer, thingId]);
                                });
                            }
                        }(layernum, thingId);
                    }
                    fidclick(id);
                    fclick(id);
                }
            });

        } else {
            tx.executeSql("SELECT * FROM thing WHERE furniture_id = ?", [id], function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {

                    for (var i = 0; i < len; i++) {
                        var layernum = res.rows.item(i)['layer']
                        var thingId = res.rows.item(i)['id']
                        var tran = function (layernum, thingId) {
                            if (layernum == "無夾層") {
                                db.transaction(function (tx) {
                                    tx.executeSql("UPDATE thing SET layer = ? WHERE id = ?", [1, thingId]);
                                });
                            }


                            if (layernum > updateflayer) {
                                if (layernum != "無夾層") {
                                    db.transaction(function (tx) {
                                        tx.executeSql("UPDATE thing SET layer = ? WHERE id = ?", [updateflayer, thingId]);
                                    });
                                }
                            }

                        }(layernum, thingId);
                    }
                    fidclick(id);
                    fclick(id);
                }
            });
        }


    });

}
//修改儲物櫃圖片
function fpem(id) {
    $('#openphoto').modal('show')
    $('#takecamera').attr('onclick', 'takecamera("' + id + '")');
    $('#fimgedit').attr('onclick', 'fimgedit("' + id + '")');
}

//fdclick fdd 為儲物櫃刪除互動視窗
function fdclick(id) {
    // $('#fed' + id).modal('hide')
    $('#fdd' + id + '').modal('show')

}

function fddc(id) {
    $("#fdd" + id + "").modal('hide')
}

function fddv(id) {
    db.transaction(function (tx) {
        var query = "DELETE FROM furniture where id = ?";
        tx.executeSql(query, [id]);
        var query2 = "DELETE FROM thing where furniture_id = ?";
        tx.executeSql(query2, [id], function (tx, res) {
            let urlParams = new URLSearchParams(window.location.search);
            var spaceId = urlParams.get('space');
            location.href = "F01.html?space=" + spaceId
        });
    });
    $("#fdd" + id + "").modal('hide')

}

//fpclick fped 為儲物櫃編輯照片互動視窗
function fpclick(id, image, name) {
    // $('#fed' + id).modal('hide')
    $('#fped' + id + '').modal('show')
}

function fpdc(id) {
    $("#fped" + id + "").modal('hide')
}

function insertfurniture() {
    var name = $("#insertfname").val();
    if (!name) {
        $('#fnwarn').html('<i class="icon ion-md-information-circle"></i>');
        $('#fnwarn').append("請輸入儲物櫃名稱");
        $('#fform').addClass("was-validated");
        return
    }
    var a = $('#insertfphoto').hasClass('a');
    if (a === true) {
        $("#fimg").css('display', 'block');
        return
    }
    var layervalue = $("#insertflayer").text();
    var img = document.getElementById("insertfphoto").src;

    let urlParams = new URLSearchParams(window.location.search);
    var spaceId = urlParams.get('space');


    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM user', [],
            function (tx, res) {
                var len = res.rows.length;
                if (res.rows.length >= 1) {
                    var timestamp = (new Date()).valueOf();

                    var email = user_email.replace(/@/g, "").split(".").join("");
                    var furnitureId = email + timestamp;
                    tx.executeSql('INSERT INTO furniture (id, name, image, layer, space_id) VALUES (?,?,?,?,?)', [furnitureId, name, img, layervalue, spaceId],
                        function (tx, res) {
                            location.href = "F01.html?space=" + spaceId + "&furniture=" + furnitureId + "";
                        }, function (error) {
                            alert("請開啟網路連線");
                        });
                }
            }, function (error) {
                alert("請開啟網路連線");
            });
    });
}

function back() {
    let urlParams = new URLSearchParams(window.location.search);
    var spaceId = urlParams.get('space');
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM space WHERE id=?', [spaceId], function (tx, res) {
            var len = res.rows.length;
            if (res.rows.length >= 1) {
                location.href = "H01.html?planargraph=" + res.rows.item(0)['planargraph_id'] + "";
            }
        });
    });
}


// ----------------------------照相---------------------------------------
function takephoto() {
    let opts = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK
    };
    navigator.camera.getPicture(function cameraSuccess(imgURI) {

        myimg = `<img src="` + imgURI + `" class="fphotothumb" id="insertfphoto">`;
        $("#fimg").css('display', 'block');
        $("#fimg").text("");
        $("#fimg").append(myimg);


    }, function cameraError(error) {
        // alert("無法取得");
    }, opts);
}

function imgget() {
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function (s) {
        window.imagePicker.getPictures(
            function (results) {
                var imgURI = results[0]

                if (!imgURI) {
                } else {
                    var myimg = `<img src="` + imgURI + `" class="fphotothumb" id="insertfphoto">`;
                    $("#fimg").css('display', 'block');
                    $("#fimg").text("");
                    $("#fimg").append(myimg);
                }
            }, function (error) {
                console.log('Error: ' + error);
            }, {
            maximumImagesCount: 1,
            quality: 50
        }
        );
    }, function (error) {
        console.log('Error: ' + error);
    });
}


function fimgedit(id) {

    window.imagePicker.getPictures(
        function (results) {
            var imgURI = results[0]
            if (!imgURI) {
            } else {
                var myimg = `<img src="` + imgURI + `" class="fephotothumb" id="fimagedit` + id + `">`;
                $("#feimg" + id + "").text("");
                $("#feimg" + id + "").append(myimg);
                $("#openphoto").modal("hide");
            }
        }, function (error) {
            console.log('Error: ' + error);
        }, {
        maximumImagesCount: 1,
        quality: 50
    }
    );
}
function takecamera(id) {
    let opts = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK
    };
    navigator.camera.getPicture(function cameraSuccess(imgURI) {
        var myimg = `<img src="` + imgURI + `" class="fephotothumb" id="fimagedit` + id + `">`;
        $("#feimg" + id + "").html(myimg);
        $("#openphoto").modal("hide");
    }, function cameraError(error) {
        // alert("Unable to obtain picture: " + error, "app");
    }, opts);
}


function imgbatch(id) {

    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function (s) {
        window.imagePicker.getPictures(
            function (results) {
                var len = results.length;
                for (var i = 0; i < len; i++) {
                    var uri = results[i];
                    var timestamp = (new Date()).valueOf();
                    var email = user_email.replace(/@/g, "").split(".").join("");
                    var thingId = email + timestamp + "" + i + "";

                    var tran = function (uri, thingId) {
                        db.transaction(function (tx) {
                            tx.executeSql('INSERT INTO thing (id, image, furniture_id) VALUES (?,?,?)', [thingId, uri, id]);
                        });
                    }(uri, thingId);
                }

                fidclick(id);
                fclick(id);
                $("#atd" + id + "").modal('hide')
            }, function (error) {
                console.log('Error: ' + error);
            }, {
            maximumImagesCount: 10,
            quality: 50
        }
        );
    }, function (error) {
        console.log('Error: ' + error);
    });

}

var mobileSelect1 = new MobileSelect({
    trigger: '#insertflayer',
    title: '夾層',
    cancelBtnColor: '#f0f0f0',
    ensureBtnColor: '#f0f0f0',
    titleBgColor: '#254F6E',
    titleColor: '#f0f0f0',
    ensureBtnText: '確認',
    wheels: [
        { data: ['無夾層', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'] }
    ],
    position: [2], //初始化定位
    callback: function (indexArr, data) {

    }
});