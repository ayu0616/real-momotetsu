// カードの要素を作成
(() => {
    const col = 'col-sm-6'
    $('#card-container > div').addClass(`${col} mb-3`);
    $(`#card-container > .${col} > div`).addClass('card').css('height', '100%');
    $('.card > img').addClass('card-img-top');
    $('.card > div').addClass('card-body position-relative');
    $('.card-body > h5').addClass('card-title');
    $('.card-body > p').addClass('card-text');
    $('.card-body > a').addClass('btn btn-primary position-absolute').text('詳細はこちら').css('bottom', '1em').css('right', '1em');
})();

// 現在時刻などが入っているdivの高さを100%にする
(() => {
    const col = 'col-sm-6';
    $(`#time-container > .${col}`).addClass('mb-3')
    $(`#time-container > .${col} > div`).css('height' ,'100%');
})();

(() => {
    const momotetsuDate = new Date(2022, 2, 18);
    const momotetsuDateJa = `${momotetsuDate.getFullYear()}年${momotetsuDate.getMonth() + 1}月${momotetsuDate.getDate()}日`;
    const todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    todayDate.setMilliseconds(0)
    const countDown = (momotetsuDate - todayDate) / 1000 / 3600 / 24;
    const text1 = `リアル桃鉄当日（${momotetsuDateJa}［仮］）まで`
    const text2 = `あと${countDown}日`
    $('#count-down > p:nth-child(2)').text(text1)
    $('#count-down > p:nth-child(3)').text(text2)
})();

// ウィンドウサイズに応じてカードのサイズを変更
$(window).on('load resize', function() {
    $('.card-body').each(function() {
        let titleHeight = $(this).children('.card-title').outerHeight(true);
        let textHeight = $(this).children('.card-text').outerHeight(true);
        let aHeight = $('.card-body > a').outerHeight(true);
        let cardBodyHeight = titleHeight + textHeight + aHeight;
        $(this).height(cardBodyHeight);
    });
})

// 時計を表示する関数を定義
const showClock = () => {
    let dateTime1 = new Date();
    let date = dateTime1.getFullYear() + "年" +
                (dateTime1.getMonth() + 1)  + "月" +
                dateTime1.getDate() + "日";

    let time = dateTime1.getHours() + "時" +
                dateTime1.getMinutes() + "分" +
                dateTime1.getSeconds() + "秒";

    $('#now-date').text(date);
    $('#now-time').text(time);
}

showClock()
setInterval('showClock()',1000);