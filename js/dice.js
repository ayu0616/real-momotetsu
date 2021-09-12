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
    for(i = 1; i <= 10 + getRandomInt(10); i ++) {
        let rand = getRandomInt(6);
        result.attr('src', `/images/dice${rand}.jpg`);
        await sleep(getRandomInt(10) / 10)
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
    nRoll(2);
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