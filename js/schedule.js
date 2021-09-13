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
})();