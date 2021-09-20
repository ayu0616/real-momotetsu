// スマホかどうか判別する関数
const isSmartPhone = () => {
    if (navigator.userAgent.match(/iPhone | Android. + Mobile/)) {
        return true;
    } else {
        return false;
    }
};

// containerの横幅を制限する
(() => {
    $(".container").css("max-width", "750px");
})();

// カードの要素を作成
(() => {
    const col = "col";
    $("#card-container > div").addClass(`${col} mb-3`);
    $(`#card-container > .${col} > a`).addClass("text-dark text-decoration-none");
    $(`#card-container > .${col} > a > div`).addClass("card align-items-center");
    $(".card > img").addClass("card-img-top");
    $(".card > div").addClass("card-body position-relative border-start");
    $(".card-body > h5").addClass("card-title");
    $(".card-body > p").addClass("card-text");
})();

// hover時に影をつける
(() => {
    const shadow = "shadow";
    if (!isSmartPhone()) {
        $(".card").on({
            mouseenter: function () {
                $(".card").removeClass(shadow);
                $(this).addClass(shadow);
            },
            mouseleave: function () {
                $(".card").removeClass(shadow);
            },
        });
    }
})();

(() => {
    const momotetsuDate = new Date(2022, 2, 18);
    const momotetsuDateJa = `${momotetsuDate.getFullYear()}年${momotetsuDate.getMonth() + 1}月${momotetsuDate.getDate()}日`;
    const todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    todayDate.setMilliseconds(0);
    const countDown = (momotetsuDate - todayDate) / 1000 / 3600 / 24;
    const text1 = `リアル桃鉄当日（${momotetsuDateJa}［仮］）まで`;
    const text2 = `あと${countDown}日`;
    $("#count-down > div > p:nth-child(1)").text(text1);
    $("#count-down > div > p:nth-child(2)").text(text2);
})();

// 時刻などのh2を1行に収める関数を定義
const h2OneLine = () => {
    const h2 = $("#time-container > div > div > h2");
    h2.each(function () {
        const t = $(this);
        t.css("font-size", "29.977px");
        while (t.height() > 35) {
            let fontSize = t.css("font-size").replace("px", "");
            t.css("font-size", fontSize - 0.5);
        }
    });
};

// 現在時刻などが入っているdivの高さを100%にする
(() => {
    const col = "col-sm-6";
    $(`#time-container > .${col}`).addClass("mb-3");
    $(`#time-container > .${col} > div`).addClass("h-100");
})();

// カードの写真のサイズを変更する関数を定義
const changeCardImageSize = () => {
    const card = $(".card");
    const heightList = [];
    card.each(function () {
        heightList.push($(this).height());
    });

    card.each(function () {
        $(this).children(".card-img-top").addClass("d-none");

        const size = Math.min.apply(null, heightList);
        $(this)
            .children(".card-img-top")
            .width(size)
            .height(size)
            .css("max-height", $(window).width() / 3)
            .css("max-width", $(window).width() / 3);

        $(this).children(".card-img-top").removeClass("d-none");
    });
};
// ウィンドウサイズが変わったときに動作
$(window).on("load resize", function () {
    h2OneLine();

    // ウィンドウの大きさを取得
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    // カードの写真のサイズを変更
    changeCardImageSize();

    // 追加／削除するclass
    const timeContainerClass = "border rounded mx-0 mb-3";
    // ウィンドウの横幅が575以下のとき
    if ($(window).width() <= 575) {
        $("#time-container")
            .height(windowHeight * 0.35)
            .addClass(timeContainerClass);
        $("#time-container > div:nth-child(1)").addClass("mt-3");
        $("#time-container div.d-flex").height("").addClass("my-3");
    } else {
        $("#time-container").height("").removeClass(timeContainerClass);
        $("#time-container > div:nth-child(1)").removeClass("mt-3");
        if ($("#visited-station-list").height() > $("#time-container div.d-flex").height()) {
            $("#time-container div.d-flex").height($("#visited-station-list").height()).removeClass("my-3");
        }
    }
});

// 時計を表示する関数を定義
const showClock = () => {
    let dateTime1 = new Date();
    let date = dateTime1.getFullYear() + "年" + (dateTime1.getMonth() + 1) + "月" + dateTime1.getDate() + "日";

    let time = dateTime1.getHours() + "時" + dateTime1.getMinutes() + "分" + dateTime1.getSeconds() + "秒";

    $("#now-date").text(date);
    $("#now-time").text(time);
};

showClock();
setInterval("showClock()", 1000);

// 駅とミッションの表をJSONで取得
let json;
let jsonNumber;
let jsonStation;
let jsonForced;
let jsonMission;
let jsonLen;

$.getJSON("/json/山陽本線（岡山→宮島口）.json", function (data) {
    json = data;
    jsonNumber = json.Number;
    jsonStation = json.駅;
    jsonForced = json.必ず下車;
    jsonMission = json.ミッション;
    jsonLen = Object.keys(jsonNumber).length - 1;

    // 「挑戦中のミッション駅」を表示する
    showMissionStation();

    // 「これまで訪れた駅」を表示する
    showVisitedStations();
});

// 「挑戦中のミッション駅」を表示する関数を定義
const showMissionStation = () => {
    const stationNum = localStorage.getItem("stationNum");
    const stationName = jsonStation[stationNum];
    const stationText = `${stationNum}. ${stationName}`;
    $("#current-station-name").text(stationText);

    const stationMission = jsonMission[stationNum];
    $("#current-mission").append(stationMission);
};

// 「これまで訪れた駅」を表示する関数を定義
const showVisitedStations = () => {
    const stationNums = JSON.parse(localStorage.getItem("visitedList"));
    $.each(stationNums, function (index, value) {
        const div = $("<div></div>", {
            text: `${value}. ${jsonStation[value]}`,
            class: "col p-1 border-bottom",
        });
        $("#visited-station-list").append(div);
    });
};
