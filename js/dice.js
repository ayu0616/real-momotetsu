    // 画像の縦横の長さ
    img_len = 300
    // 白画像を追加
    const addWhite = () => {
        const white = $('<img>', {
            src: "/images/white.png",
            alt: "真っ白な画像",
            width: img_len,
            height: img_len
        });
        $('#dice-container').append(white);
    }

    addWhite();

    // サイコロをふる関数を定義
    const rollDice = () => {
        const container = $('#dice-container');
        const result = $('<img>', {
            id: 'dice',
            alt: 'サイコロの画像',
            width: img_len,
            height: img_len
        });
        const randResult = () => {
            let rand = getRandomInt(6);
            result.attr('src', `/images/dice${rand}.jpg`);
        }
        container.html('')
        randResult();
        container.append(result);
        loopSleep(20, 250, function() {
            randResult();
        });
    }

    // 整数の乱数を出力する関数を定義
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max) + 1;
    }

    // ループとスリープを組み合わせた関数
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