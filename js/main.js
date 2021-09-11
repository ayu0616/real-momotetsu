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

// ナビバーのブランドのテキストを表示する関数を定義
const showBrand = (brand) => {
    const iconSize = 30
    const icon = $('<img>', {
        src: 'images/peach.png',
        class: 'me-2',
        alt: '桃の画像',
        width: iconSize,
        height: iconSize
    });
    $('#navbar-brand').append(icon, brand).addClass('align-middle')
}

// ナビバーのリスト作成する関数を定義
const navList = (title, url) => {
    const li = $('<li></li>', {
        'class': 'nav-item',
    });
    const a = $('<a></a>', {
        text: title,
        href: url,
        'class': "nav-link active text-decoration-underline",
        'aria-current': "page"
    });
    return li.append(a)
}

// ナビバーのリストを表示する関数を定義
const showNavList = () => {
    const li1 = navList('TOP PAGE', 'index.html')
    const li2 = navList('STATION LIST', 'station-list.html')
    const li3 = navList('DICE', 'dice.html')
    const li4 = navList('RULE', 'rule.html')
    $('#navbar-nav').append(li1, li2, li3, li4)
}


showClock()
setInterval('showClock()',1000);
showBrand('REAL-MOMOTETSU')
showNavList()