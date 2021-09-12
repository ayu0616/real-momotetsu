// 見出しについて
const head = $('#rule-container h2')
head.addClass('m-3')

// ナビバーの高さを取得する
const navHeight = $('.sticky-top').outerHeight();

// 目次を固定する
(function() {
    const tocTop = $('#toc').offset().top;
    $('#toc-container').css('top', tocTop);
    // $('#toc').css('height', $(window).height() - tocTop);
})();

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
        a.css('color', 'black')
        let li = $('<li></li>').append(a);
        li.addClass('mb-1')
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
        var position = target.offset().top - navHeight;
        // スムーススクロール
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
}

// ルールの各見出しについてクラスを追加する
(function() {
    $('#rule-container > div').addClass('m-3 border border-danger rounded');
})();

// ルールのliタグに下のmarginを追加する
(function() {
    $('#rule-container ol > li').addClass('mb-1');
})();

// olタグにm-3クラスを追加する
(function() {
    $('#rule-container ol').addClass('m-3').css('padding-left', '1.5em')
})();

addIdToHead()
createA()
setScroll()