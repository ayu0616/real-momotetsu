// スケジュールここから
// n日分のschedule-containerを作成
const dayScheduleContainer = (day) => {
    for (i = 1; i <= day; i++) {
        let div = $("<div></div>", {
            id: `day${i}`,
        });
        $("#schedule-container").append(div);
    }
};

// テーブルにidを付与
const addIdToTable = () => {
    const table = $('div[id^="day"] > table');
    table.each(function (i) {
        day = i + 1;
        $(this).attr("id", `table-day${day}`);
    });
};

(() => {
    // それぞれの時間のスケジュールを作成
    const timeSchedule = (scheduleDay, json) => {
        console.log(json["values"].slice(1));
        json["values"].slice(1).forEach(function (value) {
            if (value[0] == undefined) {
                return true;
            }
            const hour = value[0];
            const minute = value[1];
            const content = value[2];

            const day = scheduleDay;
            const minute2 = ("0" + minute).slice(-2);
            const time = `${hour}:${minute2}`;

            const tr = $("<tr></tr>");

            const timeElem = $("<td></td>", {
                text: time,
            });
            timeElem.css("width", "3.5em");

            const contentElem = $("<td></td>", {
                text: content,
            });

            tr.append(timeElem, contentElem);

            const tbody = $(`#table-day${day} > tbody`);
            tbody.append(tr);
        });
    };

    dayScheduleContainer(3);

    const days = $('div[id^="day"]');
    days.addClass("col-sm-6");
    days.each(function (i) {
        let h2 = $("<h2></h2>", {
            text: `${i + 1}日目`,
        });
        $(this).prepend(h2);
    });

    const table = $("<table></table>", {
        class: "table table-striped",
    });
    const thead = $("<thead></thead>");
    const tbody = $("<tbody></tbody>");
    const tr = $("<tr></tr>");

    const appendTh = (...cols) => {
        cols.forEach(function (elem) {
            let th = $("<th></th>", {
                scope: "col",
            });
            th.text(elem);
            tr.append(th);
        });
    };

    appendTh("時刻", "内容");
    thead.append(tr);
    table.append(thead, tbody);
    days.append(table);
    addIdToTable();

    const APIKey = "AIzaSyBh6fWBIDR8nZvucod3Fe77Ro4Hd3xtjO8";
    const sheetID = "1lnXrQX5YKoFlkaHdYmLpNelnKntrH8ijqRjsoHGOidI";
    // スケジュールを表に書く
    $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/day1!A1:C200?key=${APIKey}`, (json) => {
        timeSchedule(1, json);
    });

    // 2日目のスケジュール
    $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/day2!A1:C200?key=${APIKey}`, (json) => {
        timeSchedule(2, json);
    });

    // 3日目のスケジュール
    $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/day3!A1:C200?key=${APIKey}`, (json) => {
        timeSchedule(3, json);
    });
})();
// スケジュールここまで

// 目次ここから
// スケジュールのh2タグをheadとする
const head = $("#schedule-container h2");

// 目次を固定する
const stickToc = () => {
    let tocContainer = $("#toc-container");
    let tocTop = $(".navbar").outerHeight() + 16;
    tocContainer.css("top", tocTop);
    tocContainer.css("position", "sticky");
};

$(window).on("load resize", stickToc);

// 目次にidを振る関数を定義
(() => {
    head.each(function (index) {
        $(this).attr("id", `head-day${index + 1}`);
    });
})();

// 目次のaタグを作成して目次に追加する関数を定義
(() => {
    head.each(function () {
        let headText = $(this).text();
        let headId = $(this).attr("id");
        let a = $("<a></a>", {
            text: headText,
            href: `#${headId}`,
        });
        a.css("color", "black");
        let li = $("<li></li>").append(a);
        li.addClass("mb-2");
        $("#toc").append(li);
    });
})();

// スムーススクロール
(() => {
    // #で始まるアンカーをクリックした場合に処理
    $('a[href^="#"]').click(function () {
        // スクロールの速度
        var speed = 400; // ミリ秒
        // アンカーの値取得
        var href = $(this).attr("href");
        // 移動先を取得
        var target = $(href == "#" || href == "" ? "html" : href);
        // ナビバーの高さを取得する
        const navHeight = $(".sticky-top").outerHeight();
        // 移動先を数値で取得
        var position = target.offset().top - navHeight - 17;
        // スムーススクロール
        $("body,html").animate({ scrollTop: position }, speed, "swing");
        return false;
    });
})();
// 目次ここまで
