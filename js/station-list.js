const changeForcedColor = (elem) => {
    if(elem.text() != "") {
        elem.parent().addClass('table-warning');
    }
}

const createTable = () => {
    const tbody = $('#tbody');
    $.getJSON("山陽本線（岡山→宮島口）.json", function(json) {
        const jsonNumber = json.Number
        const jsonStation = json.駅
        const jsonForced = json.必ず下車
        const jsonMission = json.ミッション
        const len = Object.keys(jsonNumber).length - 1
        for(i = 0; i <= len; i ++) {
            let tr = $('<tr></tr>');
            let td1 = $('<td></td>', {
                text: jsonNumber[i],
                'class': 'number align-middle'
            });
            let td2 = $('<td></td>', {
                text: jsonStation[i],
                'class': 'station align-middle'
            });
            let td3 = $('<td></td>', {
                text: jsonForced[i],
                'class': 'forced align-middle'
            });
            let td4 = $('<td></td>', {
                text: jsonMission[i],
                'class': 'align-middles'
            });
            tr.append(td1, td2, td3, td4);
            tbody.append(tr);
            changeForcedColor(td3)
        }
    });
}

const changeStationWidth = () => {
    const stationElems = $('.station');
    stationElems.width('64');
}

createTable()

$(document).ready(function() {
    changeStationWidth()
});