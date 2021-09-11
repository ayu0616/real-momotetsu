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

// ナビバーのリスト作成する関数を定義
const navList = (text, url) => {
    const li = $('<li></li>', {
        'class': 'nav-item',
    });
    const a = $('<a></a>', {
        text: text,
        href: url,
        'class': "nav-link active text-decoration-underline",
        'aria-current': "page"
    });
    return li.append(a)
}

// ナビバーのリストを表示する関数を定義
const showNav = () => {
    const li1 = navList('TOP PAGE', 'index.html')
    const li2 = navList('STATION LIST', 'station-list.html')
    const li3 = navList('DICE', 'dice.html')
    $('#navbar-nav').append(li1, li2, li3)
}

showClock()
setInterval('showClock()',1000);
showNav()