$(function () {
    $(".list-group > a").addClass("text-dark text-decoration-none");
    const listGroupItems = $(".list-group > a > li");
    listGroupItems.addClass("list-group-item");

    listGroupItems.hover(
        function () {
            $(this).css("background-color", "#F2F2F2");
        },
        function () {
            $(this).css("background-color", "");
        }
    );

    const divFlex = $(".list-group-item > div");
    divFlex.addClass("d-flex justify-content-between");

    divFlex.each(function (index) {
        if (index % 2 == 1) {
            $(this).addClass("flex-row-reverse");
        }
    });

    const listIcons = $("div.d-flex > div > img");
    const iconSize = 150;
    listIcons.css({
        width: iconSize,
        height: iconSize,
    });

    const setIconMaxSize = () => {
        const maxSize = $(window).width() / 4;
        listIcons.css({
            "max-width": maxSize,
            "max-height": maxSize,
        });
    };

    setIconMaxSize()
    $(window).on("resize", setIconMaxSize);

    $('.d-flex > div:nth-child(2)').addClass('align-self-center')
});
