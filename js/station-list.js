let json;
let jsonNumber;
let jsonStation;
let jsonForced;
let jsonMission;

const createTable = () => {
    const tbody = $('#tbody');
    $.getJSON("/json/山陽本線（岡山→宮島口）.json", function(data) {
        json = data
        jsonNumber = json.Number;
        jsonStation = json.駅;
        jsonForced = json.必ず下車;
        jsonMission = json.ミッション;
        len = Object.keys(jsonNumber).length - 1;
        let forcedHtml
        for(i = 0; i <= len; i ++) {
            let tr = $('<tr></tr>', {
                'data-bs-toggle': "modal",
                'data-bs-target': `#modal`
            });

            let td1 = $('<td></td>', {
                text: jsonNumber[i],
                'class': 'number align-middle'
            });
            let td2 = $('<td></td>', {
                text: jsonStation[i],
                'class': 'station align-middle'
            });

            if(jsonForced[i] == '★') {
                forcedHtml = '<i class="bi bi-star-fill"></i>'
            } else {
                forcedHtml = jsonForced[i]
            }
            let td3 = $('<td></td>', {
                'class': 'forced align-middle'
            });
            td3.html(forcedHtml)

            let td4 = $('<td></td>', {
                text: jsonMission[i],
                'class': 'mission align-middle d-none'
            });
            tr.append(td1, td2, td3, td4);
            tbody.append(tr);
            changeForcedColor(td3);
        }
    });
    // changeStationWidth();
}

const changeForcedColor = (elem) => {
    if(elem.text() != "") {
        elem.parent().addClass('table-warning');
    }
}

// const changeStationWidth = () => {
//     const stationElems = $('.station');
//     stationElems.width('64');
// }

createTable();

// modalの中に表示する写真
let imageUrls
$.getJSON('/json/stationImage.json', function(data) {
    imageUrls = data.url;
});

const modalImage = (num) => {
    const imageUrl = imageUrls[num];
    const img = $('<img></img>', {
        src: imageUrl
    });
    img.width('100%')
    return img;
}

// 表の行をクリックしたときにmodalを表示する
$(document).on('click', 'tr[data-bs-toggle="modal"]', function() {
    const stationNumber = $(this).children('.number').text();
    const stationName = $(this).children('.station').text();
    const mission = jsonMission[stationNumber];
    const labelText = `No.${stationNumber} ${stationName}`;
    const p = $('<p></p>', {
        'class': 'mt-3 mb-0'
    });
    p.html(`【ミッション】<br>${mission}`);
    $('#modal-label').text(labelText);
    $('.modal-body').html('').prepend(modalImage(stationNumber)).append(p);
});

// リストの見た目を調整する
(() => {
    $('#description ol > li').addClass('mb-2');
    $('#description ol').css('padding-left', '1.5em')
})();

// 説明を固定する
(() => {
    // 説明欄の最上部の高さを取得する
    const des = $('#description');
    const desTop = des.offset().top;
    // 説明欄を固定する
    des.css('top', desTop);
    des.css('position', 'sticky')
})();

// エンターキーを押したとき、OKボタンを押す
$(document).keypress(function(e) {
    if (e.keyCode == 13) {
        $('#okBtn').click()
    return false;
    }
});

// ウィンドウサイズが小さくなったとき、表中のミッション欄を隠す
const hideWidth = 976;

$(window).on('load resize', function() {
    const windowWidth = $(window).width();
    if(windowWidth <= hideWidth) {
        $('.mission').addClass('d-none');
    } else {
        $('.mission').removeClass('d-none');
    }
});