// 見出しについて
const head = $('#rule-container h2');
head.addClass('m-3');

// ナビバーの高さを取得する
const navHeight = $('.sticky-top').outerHeight();

// 見出しの高さを設定する関数を定義
// const setHeight = () => {
//     const windowHeight = $(window).height();
//     const tocTop = $('#toc').offset().top;
//     const tocHeight = windowHeight - tocTop;
//     $('#toc').height(tocHeight);
// }

// 横並びか否かで見出しの高さを変更
// $(window).on('load resize', function() {
//     if($(window).width() > 575) {
        // setHeight();
    // } else {
        // $('#toc').height(`${$(window).height() / 3}`);
//     }
// });

// 見出しにidを振る関数を定義
const addIdToHead = () => {
    head.each(function(index) {
        $(this).attr('id', `head${index}`);
    });
}

// 目次のaタグを作成して目次に追加する関数を定義
const createA = () => {
    head.each(function() {
        let headText = $(this).text();
        let headId = $(this).attr('id');
        let a = $('<a></a>', {
            text: headText,
            href: `#${headId}`
        });
        a.css('color', 'black');
        let li = $('<li></li>').append(a);
        li.addClass('mb-2');
        $('#toc').append(li);
    });
}

// スムーススクロールを作成する関数を定義
const setScroll = () => {
    // #で始まるアンカーをクリックした場合に処理
    $('a[href^="#"]').click(function() {
        // スクロールの速度
        var speed = 400; // ミリ秒
        // アンカーの値取得
        var href= $(this).attr("href");
        // 移動先を取得
        var target = $(href == "#" || href == "" ? 'html' : href);
        // 移動先を数値で取得
        var position = target.offset().top - navHeight - 17;
        // スムーススクロール
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
}

addIdToHead();
createA();
setScroll();

// 目次を固定する
const stickToc = () => {
    let tocContainer = $('#toc-container');
    let tocTop = $('.navbar').outerHeight() + 16;
    tocContainer.css('top', tocTop);
    tocContainer.css('position', 'sticky');
}

$(window).on('load resize', stickToc);

// ルールの各見出しについてクラスを追加する
(function() {
    $('#rule-container > div').addClass('my-3 border border-danger rounded');
})();

// ルールのliタグに下のmarginを追加する
(function() {
    $('#rule-container ol > li').addClass('mb-1');
})();

// olタグにm-3クラスを追加し、paddingを1.5emにする
(function() {
    $('#rule-container ol').addClass('m-3').css('padding-left', '1.5em');
})();

// 「TOPに戻るボタン」を押したときの動作
$(function() {
    var topBtn = $('.page-top');
    topBtn.hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
    topBtn.click(function () {
        $('body, html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
});

// containerの下に余白をつくる（上に戻るボタンの都合上）
(() => {
    $('#rule-container').css('margin-bottom', '80px');
})();

// JSONを読み込む
let cardJson;
$.getJSON('json/カード一覧.json', function(data) {
    cardJson = data;
    showCardTable(data);
});

// カード表を表示する関数を定義
const showCardTable = (json) => {
    const cardNameJson = json.カード名;
    const effectJson = json.効果;
    const jsonLen = Object.keys(cardNameJson).length;
    for(i = 0; i < jsonLen; i ++) {
        let cardTd = $('<td></td>', {
            'class': 'card-name align-middle',
            text: cardNameJson[i]
        });

        let effectTd = $('<td></td>', {
            'class': 'effect align-middle',
            text: effectJson[i]
        });

        let tr = $('<tr><tr>');
        tr.append(cardTd, effectTd);

        $('#card-table > tbody').append(tr);
    }
}
