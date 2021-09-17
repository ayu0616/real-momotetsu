// containerの横幅を制限する
(() => {
    $('.container').css('max-width', '750px')
})();

// 白画像を追加
(() => {
    const white = $('<img>', {
        src: "/images/white.png",
        alt: "真っ白な画像",
        width: '100%',
        'class': 'border border-danger rounded'
    });
    $('div[id^="dice-container"]').append(white);
})();

// sleep関数を定義
const sleep = (sec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec*1000);
    });
};

// サイコロをふる関数を定義
const rollDice = async (n) => {
    $('#btn').attr('disabled', '');
    $('#reset-station-btn').attr('disabled', '');
    $('#station-select').attr('disabled', '');

    const container = $(`#dice-container${n}`);
    const result = $('<img>', {
        id: `dice${n}`,
        alt: 'サイコロの画像',
        width: '100%',
        'class': 'border border-danger rounded'
    });
    let rand = getRandomInt(6);
    result.attr('src', `/images/dice${rand}.jpg`);
    container.children('img').replaceWith(result);
    for(i = 1; i <= 20; i ++) {
        let rand = getRandomInt(6);
        result.attr('src', `/images/dice${rand}.jpg`);
        await sleep(0.4)
    };
}

// 整数の乱数を出力する関数を定義
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

// 画像を点滅させる関数を定義
const blinkImg = (n) => {
    return new Promise((resolve, reject) => {
        $(`#dice${n}`).fadeOut(500,function(){$(this).fadeIn(500)});
        resolve();
        reject();
    });
}

// n番目のサイコロをふる関数を定義
const nRoll = async (n) => {
    await rollDice(n);
    await blinkImg(n);
    const num = $(`#dice${n}`).attr('src').replace('/images/dice', '').replace('.jpg', '');
    toText(num, n);
}

// ボタンをクリックしたときに動作する関数を定義する
const onClick = async () => {
    nRoll(1);
    await nRoll(2);
    await sleep(1);
    sumNumber();
    await sleep(1);
    scrollToResult();
}

// 結果をテキストに出力する関数を定義する
const toText = (result, n) => {
    text = `結果は${result}です`;
    $(`#result-text${n}`).text(text).attr('style', '');
    replaceBtn()
}

// ボタンを置き換える関数を定義する
const replaceBtn = () => {
    const reloadBtn = $('<button></button>', {
        type: 'button',
        'class': 'btn btn-warning',
        onclick: 'reloadPage()',
        text: 'もう一度ふる'
    });
    $('#btn').replaceWith(reloadBtn);
}

// リロードする関数を定義する
const reloadPage = () => {
    location.reload();
}

// 駅名の選択肢を追加する
let json;
$.getJSON("/json/山陽本線（岡山→宮島口）.json", function(data) {
    json = data;
    const jsonNumber = json.Number;
    const jsonStation = json.駅;
    const jsonLen = Object.keys(jsonNumber).length;

    for(i = 0; i < jsonLen; i ++) {
        const option = $('<option></option>', {
            value: i,
            text: `${jsonNumber[i]}. ${jsonStation[i]}`
        });
        $('#station-select').append(option);
    }
    selectStationByStorage();
    changeBtn();
});

// ローカルストレージから駅名を取得し選択する関数を定義
const selectStationByStorage = () => {
    const currentStationNum = localStorage.getItem('stationNum');
    if(currentStationNum != null) {
        $('option[selected]').removeAttr('selected');
        $(`option[value="${currentStationNum}"]`).attr('selected', '');
        $('#station-select').attr('disabled', '');
    }
}

// 合計値と次に下車する駅を出力する関数を定義
const sumNumber = () => {
    return new Promise((resolve, reject) => {
        let sum = 0
        $('img[id^="dice"]').each(function() {
            let diceSrc = $(this).attr('src');
            diceSrc = diceSrc.replace('/images/dice', '').replace('.jpg', '');
            sum += Number(diceSrc)
        });
        const selectedVal = Number($('#station-select option:selected').val());

        const setNextStationNum = () => {
            if(selectedVal + sum > $('#station-select > option[value]').length - 1) {
                return $('#station-select > option[value]').length - 1;
            } else {
                return selectedVal + sum;
            }
        }

        const nextStationNum = setNextStationNum();
        const nextStation = $(`#station-select > option[value="${nextStationNum}"]`).text();
        // const resultText = `合計：${sum}<br>次の駅：${nextStation}`;
        const nextMissionHtml = `【ミッション】<br>${json.ミッション[nextStationNum]}`;
        $('#next-station').html(nextStation);
        $('#next-mission').html(nextMissionHtml);

        // 現在の駅ナンバーをローカルストレージに追加
        localStorage.setItem('stationNum', nextStationNum);

        // 現在の駅ナンバーをこれまで訪れた駅のローカルストレージに追加
        const visitedKey = 'visitedList'
        let visitedList = localStorage.getItem(visitedKey);
        if(visitedList == null) {
            visitedList = [selectedVal];
            localStorage.setItem(visitedKey, JSON.stringify(visitedList));
        } else {
            visitedList = JSON.parse(visitedList);
            visitedList.push(selectedVal);
            localStorage.setItem(visitedKey, JSON.stringify(visitedList));
        }

        resolve();
    });
}

// ボタンを押せる／押せないようにする関数を定義
const changeBtn = () => {
    const currentMissionHtml = (num) => {return `【ミッション】<br>${json.ミッション[num]}`;}
    if($('#station-select option:selected').text() == "現在の駅を選択") {
        $('#btn').attr('disabled', '');
        $('#current-station').text('');
        $('#current-mission').html('');
    } else {
        $('#btn').removeAttr('disabled');
        const selectedElem = $('#station-select option:selected');
        $('#current-station').text(selectedElem.text());
        $('#current-mission').html(currentMissionHtml(selectedElem.attr('value')));
    }
}

// 駅を選択すると動作
$('#station-select').on('change', changeBtn);

// 結果表示欄までスクロール
const scrollToResult = () => {
    const resultHeight = $('#current-station-col').offset().top;
    const navHeight = $('.navbar').outerHeight();
    $('html, body').animate({scrollTop:resultHeight - navHeight - 2});
}

// 結果表示欄を装飾
(() => {
    $('#result-container > div.col > div').addClass('border border-danger rounded');
    $('#result-container > div.col > div').css('height', '100%');
    $('#result-container > div.col > div > div').addClass('m-3');
})();

// ウィンドウサイズに応じて結果欄の縦横を変更する
$(window).on('load resize', function() {
    const changeWidth = 550;
    const windowWidth = $(window).width();

    if(windowWidth < changeWidth) {
        $('#result-container').addClass('row-cols-1');
        $('#arrow').removeClass('col-1');
        $('#arrow').addClass('col');
        $('#arrow').html('<i class="bi bi-chevron-double-down"></i>')
    } else {
        $('#result-container').removeClass('row-cols-1');
        $('#arrow').removeClass('col');
        $('#arrow').addClass('col-1');
        $('#arrow').html('<i class="bi bi-chevron-double-right"></i>');
    }
});

// 現在の駅をリセットする関数を定義
const resetStation = () => {
    if(confirm('本当にリセットしますか？？？？？？？')) {
        localStorage.removeItem('stationNum');
        $('option[selected]').removeAttr('selected');
        $('#current-station').text('');
        $('option:first-child').attr('selected', '');
        $('#station-select').removeAttr('disabled');
        $('#reset-station-btn').attr('disabled', '')
        changeBtn();
    }
}

// ローカルストレージがないときは駅リセットボタンを押せないようにする
(() => {
    if(localStorage.getItem('stationNum') == null) {
        $('#reset-station-btn').attr('disabled', '')
    }
})();