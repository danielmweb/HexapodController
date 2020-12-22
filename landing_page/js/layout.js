function resizeBody() {
    $("body").height(window.innerHeight);
    $("body").width(window.innerWidth);
}
window.addEventListener("resize", resizeBody);
resizeBody();

$(".access-card").hover(
    () => {
        //entered
        let lens = $(".lens-layer");
        if (lens.width() < 800) {
            return;
        }
        lens.css("background-color", "rgba(5, 5, 5, 0.5)");
    },
    () => {
        //exited
        let lens = $(".lens-layer");
        if (lens.width() < 800) {
            return;
        }
        lens.css("background-color", "rgba(5, 5, 5, 0.0)");
    }
);
