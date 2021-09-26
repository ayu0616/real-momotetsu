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
const changeCardImageSize = (windowWidth) => {
    const card = $(".card");
    const heightList = [];
    card.each(function () {
        $(this).children(".card-img-top").addClass("d-none");
        heightList.push($(this).height());
        $(this).children(".card-img-top").removeClass("d-none");
    });

    const size = Math.min.apply(null, heightList);
    const maxWidth = ($(".card").width() * 3) / 10;

    card.each(function () {
        if (size < maxWidth) {
            $(this).children(".card-img-top").width(size).height(size);
        } else {
            $(this).children(".card-img-top").width(maxWidth).height(maxWidth);
        }
    });
};
// ウィンドウサイズが変わったときに動作
$(window).on("load resize", function () {
    h2OneLine();

    // ウィンドウの大きさを取得
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    // カードの写真のサイズを変更
    changeCardImageSize(windowWidth);

    if ($(window).width() <= 575) {
        $("#carousel-control").removeClass("d-none");
        $("#carousel-control").addClass("d-flex");

        const container = $("#time-container");

        container.parent().addClass("carousel carousel-dark slide");
        container.parent().attr("data-bs-ride", "carousel");

        container.removeClass("row");
        container.addClass("carousel-inner");

        container.children("div").each(function (index) {
            $(this).removeClass("col-sm-6 mb-3");
            $(this).addClass("carousel-item");
            $(this).attr("data-bs-interval", "1000000");

            const child = $(this).children();
            child.removeClass("h-100");
            child.addClass("d-block w-100 overflow-auto");
            child.height(windowHeight * 0.3);
        });
    } else {
        $("#carousel-control").removeClass("d-flex");
        $("#carousel-control").addClass("d-none");

        const container = $("#time-container");

        container.removeClass("carousel carousel-dark slide");
        container.parent().removeAttr("data-bs-ride");

        container.removeClass("carousel-inner");
        container.addClass("row");

        container.children("div").each(function () {
            $(this).removeClass("carousel-item");
            $(this).addClass("col-sm-6 mb-3");
            $(this).removeAttr("data-bs-interval");

            const child = $(this).children();
            child.removeClass("d-block w-100 overflow-auto");
            child.addClass("h-100");
            child.height("");
        });
    }
});

// 駅とミッションの表をJSONで取得
let json;
let jsonNumber;
let jsonStation;
let jsonForced;
let jsonMission;
let jsonLen;

const getJson = async () => {
    await $.getJSON("./json/山陽本線（岡山→宮島口）.json", function (data) {
        json = data;
        jsonNumber = json.Number;
        jsonStation = json.駅;
        jsonForced = json.必ず下車;
        jsonMission = json.ミッション;
        jsonLastTime = json.最終出発時刻;
        jsonLen = Object.keys(jsonNumber).length - 1;
    });
};

// 「挑戦中のミッション駅」を表示する関数を定義
const showMissionStation = async () => {
    const stationNum = localStorage.getItem("stationNum");
    if (stationNum == null) {
        $("#current-station-name").text("開始していません");
    } else {
        const stationName = jsonStation[stationNum];
        const stationText = `${stationNum}. ${stationName}`;
        $("#current-station-name").text(stationText);

        // ミッションを表示
        const stationMission = jsonMission[stationNum];
        $("#current-mission").append(stationMission);

        const lastTime = jsonLastTime[stationNum];

        // 最終出発時刻を表示
        if (lastTime == null) {
            $("#last-time").text("——");
            $("#remaining-time").html("——");
        } else {
            $("#last-time").text(lastTime);
        }

        showRemainingTime(lastTime);
        setInterval(showRemainingTime, 15000, lastTime);
    }
};

const showRemainingTime = (lastTime) => {
    if (lastTime != null) {
        // 最終出発時刻を時間と分に分ける
        const lastTimeArray = lastTime.split(":");
        const lastHour = Number(lastTimeArray[0]);
        const lastMinute = Number(lastTimeArray[1]);

        // 現在時刻を取得
        const nowTime = new Date();
        const nowHour = nowTime.getHours();
        const nowMinute = nowTime.getMinutes();

        // 時間の差を取得（分）
        const timeDelta = lastHour * 60 + lastMinute - (nowHour * 60 + nowMinute);

        // 時間オーバーかどうかで場合分け
        let remainingTimeText;
        if (timeDelta < 0) {
            remainingTimeText = "時間切れです";
        } else {
            const hourDelta = Math.floor(timeDelta / 60);
            const minuteDelta = timeDelta % 60;
            remainingTimeText = `${hourDelta}時間${minuteDelta}分`;
        }

        // 残り時間を表示
        const remainingTimeElem = $("#remaining-time");
        remainingTimeElem.text(remainingTimeText);

        // 残り時間に応じてテキストの色を変える
        if (timeDelta < 60) {
            remainingTimeElem.css({
                color: "red",
                "font-weight": "bold",
            });
        } else if (timeDelta < 120) {
            remainingTimeElem.css({
                color: "#fcc800",
                "font-weight": "bold",
            });
        } else {
            remainingTimeElem.css({
                color: "black",
                "font-weight": "normal",
            });
        }
    }
};

// 「これまで訪れた駅」を表示する関数を定義
const showVisitedStations = async () => {
    const stationNums = JSON.parse(localStorage.getItem("visitedList"));
    if (stationNums == null) {
        $("#visited-station-list").parent().append("<p>サイコロを回すとこの欄に駅が表示されます</p>");
    } else {
        $.each(stationNums, function (index, value) {
            const div = $("<div></div>", {
                text: `${value}. ${jsonStation[value]}`,
                class: "col p-1 border-bottom",
            });
            $("#visited-station-list").append(div);
        });
    }
};

(async () => {
    // jsonを取得
    await getJson();

    // 「挑戦中のミッション駅」を表示する
    showMissionStation();

    // 「これまで訪れた駅」を表示する
    showVisitedStations();
})();
