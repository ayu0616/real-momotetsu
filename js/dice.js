// サイコロをふる関数を定義
const rollDice = () => {
    const container = $('#dice-container');
    // container.width(400).height(400)
    // container.html('');
    // const spinner = $('<div></div>', {
    //     'class': 'spinner-border text-primary align-middle',
    //     role: 'status'
    // });
    // const span = $('<span></span>', {
    //     'class': 'visually-hidden',
    //     text: 'Loading...'
    // });
    // spinner.append(span)
    // container.append(spinner)
    const result = $('<img>', {
        id: 'dice',
        alt: 'サイコロの画像',
        width: '400',
        height: '400'
    });
    const randResult = () => {
        let rand = getRandomInt(6);
        result.attr('src', `/images/dice${rand}.jpg`);
    }
    container.html('')
    randResult()
    container.append(result);
    loopSleep(20, 150, function() {
        randResult()
    })
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
    return;
}

function loopSleep(_loopLimit,_interval, _mainFunc){
    var loopLimit = _loopLimit;
    var interval = _interval;
    var mainFunc = _mainFunc;
    var i = 0;
    var loopFunc = function () {
        var result = mainFunc(i);
        if (result === false) {
            // break機能
            return;
        }
        i = i + 1;
        if (i < loopLimit) {
            setTimeout(loopFunc, interval);
        }
    }
    loopFunc();
}