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
});

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

        console.log(setNextStationNum());
        const nextStation = $(`#station-select > option[value="${setNextStationNum()}"]`).text();
        const resultText = `合計：${sum}<br>次の駅：${nextStation}`;
        $('#next-station').html(nextStation);
        resolve();
    });
}

// 駅を選択すると動作する関数
$('#station-select').on('change', function() {
    if($('#station-select option:selected').text() == "現在の駅を選択") {
        $('#btn').attr('disabled', '');
        $('#current-station').text('');
    } else {
        $('#btn').removeAttr('disabled');
        $('#current-station').text($('#station-select option:selected').text());
    }
});

(() => {
    $('#result-container > div').addClass('col');
})();
