// containerの横幅を制限する
(() => {
    $(".container").css("max-width", "750px");
})();

// 白画像を追加
(() => {
    const white = $("<img>", {
        src: "/images/white.png",
        alt: "真っ白な画像",
        width: "100%",
        class: "border border-pink rounded",
    });
    $('div[id^="dice-container"]').append(white);
})();

// sleep関数を定義
const sleep = (sec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
    });
};

// サイコロをふる関数を定義
const rollDice = async (n) => {
    $("#btn").attr("disabled", "");
    $("#reset-station-btn").attr("disabled", "");
    $("restore-backup-btn").attr("disabled", "");
    $("#station-select").attr("disabled", "");

    const container = $(`#dice-container${n}`);
    const result = $("<img>", {
        id: `dice${n}`,
        alt: "サイコロの画像",
        width: "100%",
        class: "border border-pink rounded",
    });
    let rand = getRandomInt(6);
    result.attr("src", `/images/dice${rand}.jpg`);
    container.children("img").replaceWith(result);
    for (i = 1; i <= 20; i++) {
        let rand = getRandomInt(6);
        result.attr("src", `/images/dice${rand}.jpg`);
        await sleep(0.4);
    }
};

// 整数の乱数を出力する関数を定義
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
};

// 画像を点滅させる関数を定義
const blinkImg = (n) => {
    return new Promise((resolve, reject) => {
        $(`#dice${n}`).fadeOut(500, function () {
            $(this).fadeIn(500);
        });
        resolve();
        reject();
    });
};

// n番目のサイコロをふる関数を定義
const nRoll = async (n) => {
    await rollDice(n);
    await blinkImg(n);
    const num = $(`#dice${n}`).attr("src").replace("/images/dice", "").replace(".jpg", "");
    toText(num, n);
};

// ボタンをクリックしたときに動作する関数を定義する
const onClick = async () => {
    if ($("#station-select > option:selected").text() == $("#station-select > option:last-child").text()) {
        alert("おめでとうございます！！！\nゴールしました！！！");
    } else {
        nRoll(1);
        await nRoll(2);
        await sleep(1);
        sumNumber();
        await sleep(1);
        scrollToResult();
        if ($("#next-station").text() == $("#station-select > option:last-child").text()) {
            alert("おめでとうございます！！！\nゴールしました！！！");
        }
    }
};

// 結果をテキストに出力する関数を定義する
const toText = (result, n) => {
    text = `結果は${result}です`;
    $(`#result-text${n}`).text(text).attr("style", "");
    replaceBtn();
};

// ボタンを置き換える関数を定義する
const replaceBtn = () => {
    const reloadBtn = $("<button></button>", {
        type: "button",
        class: "btn btn-lg btn-success",
        onclick: "reloadPage()",
        html: "<i class='bi bi-arrow-clockwise'></i>",
        id: "btn",
    });
    $("#btn").replaceWith(reloadBtn);
    setBtnMargin();
};

// リロードする関数を定義する
const reloadPage = () => {
    location.reload();
};

// 駅名の選択肢を追加する
let json;
$.getJSON("/json/山陽本線（岡山→宮島口）.json", function (data) {
    json = data;
    const jsonNumber = json.Number;
    const jsonStation = json.駅;
    const jsonLen = Object.keys(jsonNumber).length;

    for (i = 0; i < jsonLen; i++) {
        const option = $("<option></option>", {
            value: i,
            text: `${jsonNumber[i]}. ${jsonStation[i]}`,
        });
        $("#station-select").append(option);
    }
    selectStationByStorage();
    changeBtn();
});

// ローカルストレージから駅名を取得し選択する関数を定義
const selectStationByStorage = () => {
    const currentStationNum = localStorage.getItem("stationNum");
    if (currentStationNum != null) {
        $("option[selected]").removeAttr("selected");
        $(`option[value="${currentStationNum}"]`).attr("selected", "");
        $("#station-select").attr("disabled", "");
    }
};

// 合計値と次に下車する駅を出力する関数を定義
const sumNumber = () => {
    return new Promise((resolve, reject) => {
        let sum = 0;
        $('img[id^="dice"]').each(function () {
            let diceSrc = $(this).attr("src");
            diceSrc = diceSrc.replace("/images/dice", "").replace(".jpg", "");
            sum += Number(diceSrc);
        });
        const selectedVal = Number($("#station-select option:selected").val());
        const currentStationName = json.駅[selectedVal];

        const nextStationNum = setNextStationNum(sum, selectedVal);
        const nextStation = $(`#station-select > option[value="${nextStationNum}"]`).text();
        const nextStationName = json.駅[nextStationNum];
        const nextMissionHtml = `【ミッション】<br>${json.ミッション[nextStationNum]}`;

        // 次の駅が必ず下車する駅ならそのことを表示する
        if (getForcedList().includes(String(nextStationNum))) {
            const forcedDiv = $("<div></div>", {
                html: "<i class='bi bi-exclamation-triangle-fill'></i> 次は必ず下車する駅",
                class: "alert alert-warning alert-dismissible my-2 fade show",
                role: "alert",
            });
            forcedDiv.append('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>');
            $("#next-station-col > div > div > h2").after(forcedDiv);
        }

        $("#next-station").html(nextStation);
        $("#next-mission").html(nextMissionHtml);

        $("#change-nav").html(createChangeNav(currentStationName, nextStationName));

        addLocalStorage(nextStationNum, selectedVal);

        resolve();
    });
};

// 必ず停まる駅を取得
const getForcedList = () => {
    const jsonForced = json.必ず下車;
    const forcedList = [];
    // const jsonLen = Object.keys(jsonForced).length;
    $.each(jsonForced, function (index, value) {
        if (value != null) {
            forcedList.push(index);
        }
    });
    return forcedList;
};

// 2数が配列の同じ隙間に存在するかどうかを判別する関数を定義
const isNextForced = (n1, n2, array) => {
    const n1Num = Number(n1);
    const n2Num = Number(n2);
    for (i = 0; i < array.length; i++) {
        let valueNum = Number(array[i]);
        if (n1Num < valueNum && valueNum < n2Num) {
            return valueNum;
        }
    }
    return false;
};

// 駅ナンバーを決める関数を定義
const setNextStationNum = (sumDice, selectedVal) => {
    const sum = sumDice + selectedVal;
    const condition1 = isNextForced(selectedVal, sum, getForcedList());
    const condition2 = sum > $("#station-select > option[value]").length - 1;
    if (condition1) {
        return condition1;
    } else if (condition2) {
        return $("#station-select > option[value]").length - 1;
    } else {
        return sum;
    }
};

// ローカルストレージに追加する関数を定義
const addLocalStorage = (nextStationNum, selectedVal) => {
    // 現在の駅ナンバーをローカルストレージに追加
    localStorage.setItem("stationNum", nextStationNum);

    // 現在の駅ナンバーをこれまで訪れた駅のローカルストレージに追加
    const visitedKey = "visitedList";
    let visitedList = localStorage.getItem(visitedKey);
    if (visitedList == null) {
        visitedList = [selectedVal];
        localStorage.setItem(visitedKey, JSON.stringify(visitedList));
    } else {
        visitedList = JSON.parse(visitedList);
        visitedList.push(selectedVal);
        localStorage.setItem(visitedKey, JSON.stringify(visitedList));
    }
};

// ボタンを押せる／押せないようにする関数を定義
const changeBtn = () => {
    const currentMissionHtml = (num) => {
        return `【ミッション】<br>${json.ミッション[num]}`;
    };

    const condition1 = $("#station-select option:selected").text() == "現在の駅を選択";
    if (condition1) {
        $("#btn").attr("disabled", "");
        $("#current-station").text("");
        $("#current-mission").html("");
    } else {
        $("#btn").removeAttr("disabled");
        const selectedElem = $("#station-select option:selected");
        $("#current-station").text(selectedElem.text());
        $("#current-mission").html(currentMissionHtml(selectedElem.attr("value")));
    }
};

// 駅を選択すると動作
$("#station-select").on("change", changeBtn);

// 結果表示欄までスクロール
const scrollToResult = () => {
    const resultHeight = $("#current-station-col").offset().top;
    const navHeight = $(".navbar").outerHeight();
    $("html, body").animate({ scrollTop: resultHeight - navHeight - 2 });
};

// 結果表示欄を装飾
(() => {
    $("#result-container > div.col > div").addClass("border border-pink rounded");
    $("#result-container > div.col > div").css("height", "100%");
    $("#result-container > div.col > div > div").addClass("m-3");
    $('div[id*="station-col"] > div > div > p').addClass("my-2");
})();

// ウィンドウサイズに応じて結果欄の縦横を変更する
$(window).on("load resize", function () {
    const changeWidth = 550;
    const windowWidth = $(window).width();

    if (windowWidth < changeWidth) {
        $("#result-container").addClass("row-cols-1");
        $("#arrow").removeClass("col-1");
        $("#arrow").addClass("col");
        $("#arrow-icon").removeClass("bi-chevron-double-right");
        $("#arrow-icon").addClass("bi-chevron-double-down");
    } else {
        $("#result-container").removeClass("row-cols-1");
        $("#arrow").removeClass("col");
        $("#arrow").addClass("col-1");
        $("#arrow-icon").removeClass("bi-chevron-double-down");
        $("#arrow-icon").addClass("bi-chevron-double-right");
    }
});

// 現在の駅をリセットする関数を定義
const resetStation = () => {
    if (confirm("本当にリセットしますか？？？？？？？")) {
        // バックアップを作成
        localStorage.setItem("stationNumBackUp", localStorage.getItem("stationNum"));
        localStorage.setItem("visitedListBackUp", localStorage.getItem("visitedList"));
        // ローカルストレージを削除
        localStorage.removeItem("stationNum");
        localStorage.removeItem("visitedList");
        // 再読み込み
        location.reload();
    }
};

// バックアップを復元する関数を定義
const restoreBackUp = () => {
    if (confirm("バックアップを復元しますか？")) {
        // バックアップを復元
        localStorage.setItem("stationNum", localStorage.getItem("stationNumBackUp"));
        localStorage.setItem("visitedList", localStorage.getItem("visitedListBackUp"));
        // バックアップを削除
        localStorage.removeItem("stationNumBackUp");
        localStorage.removeItem("visitedListBackUp");
        // 再読み込み
        location.reload();
    }
};

// ボタンを押せる／押せないようにする
(() => {
    // ローカルストレージがないときは駅リセットボタンを押せないようにする
    if (localStorage.getItem("stationNum") == null) {
        $("#reset-station-btn").attr("disabled", "");
    }

    // バックアップがないときはバックアップを復元するボタンを押せないようにする
    if (localStorage.getItem("stationNumBackUp") == null) {
        $("#restore-backup-btn").attr("disabled", "");
    }
})();

// 乗換案内のリンクを表示する関数を定義
const createChangeNav = (currentStation, nextStation) => {
    const navLink = `https://transit.yahoo.co.jp/search/result?from=${currentStation}&to=${nextStation}`;
    const aButton = $("<a></a>", {
        class: "btn btn-primary",
        role: "button",
        href: navLink,
        html: "<i class='bi bi-info-circle-fill'></i> 乗換案内",
        target: "_blank",
        rel: "noopener noreferrer",
    });
    return aButton;
};

// ボタンのmarginを変更する関数を定義
const setBtnMargin = () => {
    const changeWidth = 575;
    const windowWidth = $(window).width();

    if (windowWidth <= changeWidth) {
        $(".btn-group").addClass("mt-3");
    } else {
        $(".btn-group").removeClass("mt-3");
    }
}

$(window).on("load resize", setBtnMargin);