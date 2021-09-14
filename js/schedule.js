// 目次ここから
// ナビバーの高さを取得する
const navHeight = $('.sticky-top').outerHeight();

// 目次を固定する
(function() {
    const tocContainer = $('#toc-container');
    const tocTop = tocContainer.offset().top;
    tocContainer.css('top', tocTop);
    tocContainer.css('position', 'sticky');
})();

// 目次の高さを設定する関数を定義
const setHeight = () => {
    const windowHeight = $(window).height();
    const tocTop = $('#toc').offset().top;
    const tocHeight = windowHeight - tocTop;
    $('#toc').height(tocHeight);
}

// 横並びか否かで目次の高さを変更
$(window).on('load resize', function() {
    if($(window).width() > 575) {
        setHeight();
    } else {
        $('#toc').height(`${$(window).height() / 3}`)
    }
})

// 目次にidを振る関数を定義
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
        li.addClass('mb-2')
        $('#toc').append(li);
    });
}
// 目次ここまで

// スケジュールここから
const dayScheduleContainer = (day) => {
    for(i = 1; i <= day; i ++) {
        let div = $('<div></div>', {
            id: `day${i}`
        });
        $('#schedule-container').append(div);
    }
}

(() => {
    dayScheduleContainer(3);

    const days = $('div[id^="day"]');
    days.addClass('col-sm-6');
    days.each(function(i) {
        let h2 = $('<h2></h2>', {
            text: `${i + 1}日目`
        });
        $(this).prepend(h2);
    });

    const table = $('<table></table>', {
        'class': 'table'
    });
    const thead = $('<thead></thead>');
    const tr = $('<tr></tr>');

    const appendTh = (...cols) => {
        cols.forEach(function(elem) {
            let th = $('<th></th>', {
                scope: "col"
            });
            th.text(elem);
            tr.append(th);
        });
    }

    appendTh('時刻', '内容');
    thead.append(tr);
    table.append(thead);
    days.append(table);
})();
// スケジュールここまで