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

showClock()
setInterval('showClock()',1000);