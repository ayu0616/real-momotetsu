const nowTime = $('#now-time');

let date1 = new Date();
let date2 = date1.getFullYear() + "年" +
            (date1.getMonth() + 1)  + "月" +
            date1.getDate() + "日" +
            date1.getHours() + "時" +
            date1.getMinutes() + "分" +
            date1.getSeconds() + "秒" +
            date1.getMilliseconds() + "ミリ秒" +
console.log(date2);