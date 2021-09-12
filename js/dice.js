// 白画像を追加
const addWhite = () => {
    const white = $('<img>', {
        src: "/images/white.png",
        alt: "真っ白な画像",
        width: '100%'
    });
    $('div[id^="dice-container"]').append(white);
}

addWhite();

// sleep関数を定義
const sleep = (sec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec*1000);
    });
};

// サイコロをふる関数を定義
const rollDice = async (n) => {
    $('#btn').attr('disabled', '')
    const container = $(`#dice-container${n}`);
    const result = $('<img>', {
        id: `dice${n}`,
        alt: 'サイコロの画像',
        width: '100%'
    });
    container.html('');
    let rand = getRandomInt(6);
    result.attr('src', `/images/dice${rand}.jpg`);
    container.append(result);
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
        'class': 'btn btn-warning m-3',
        onclick: 'reloadPage()',
        text: 'もう一度サイコロをふる'
    });
    $('#btn').replaceWith(reloadBtn);
}

// リロードする関数を定義する
const reloadPage = () => {
    location.reload();
}

// 駅名の選択肢を追加する
$.getJSON("山陽本線（岡山→宮島口）.json", function(json) {
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
        const nextStation = $(`#station-select > option[value="${selectedVal + sum}"]`).text()
        const resultText = `合計：${sum}<br>次の駅：${nextStation}`
        $('#result').html(resultText)
        resolve();
    });
}

// 現在の駅を選択しないとボタンを押せないようにする
$('#station-select').on('change', function() {
    if($('#station-select option:selected').text() == "現在の駅を選択") {
        $('#btn').attr('disabled', '');
    } else {
        $('#btn').removeAttr('disabled');
    }
});
