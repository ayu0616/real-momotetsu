// サイコロをふる関数を定義
const rollDice = () => {
    const iMax = 5
    for(i = 1; i <= iMax; i ++) {
        addResult()
        if(i < iMax) {
            sleep(500);
        }
    }
}

const addResult = () => {
    const result = $('#dice');
    let rand = getRandomInt(6)
    result.attr('src', `/images/dice${rand}.jpg`)
}

// 整数の乱数を出力する関数を定義
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

// sleep関数を定義（引数はミリ秒単位）
const sleep = (a) => {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
}


