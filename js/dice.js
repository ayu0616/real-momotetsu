// 白画像を追加
const addWhite = () => {
    const white = $('<img>', {
        src: "/images/white.png",
        alt: "真っ白な画像",
        width: '100%'
    });
    $('#dice-container').append(white);
}

addWhite();

// sleep関数を定義
const sleep = (sec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec*1000);
    });
};

// サイコロをふる関数を定義
const rollDice = async () => {
    $('#btn').attr('disabled', '')
    const container = $('#dice-container');
    const result = $('<img>', {
        id: 'dice',
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
const blinkImg = () => {
    return new Promise((resolve, reject) => {
        $('#dice').fadeOut(500,function(){$(this).fadeIn(500)});
        resolve();
        reject();
    });
}

// ボタンをクリックしたときに動作する関数を定義する
const onClick = async () => {
    await rollDice();
    await blinkImg();
    const num = $('#dice').attr('src').replace('/images/dice', '').replace('.jpg', '');
    toText(num);
}

// 結果をテキストに出力する関数を定義する
const toText = (result) => {
    text = `結果は${result}です`;
    $('#result-text').text(text).attr('style', '');
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