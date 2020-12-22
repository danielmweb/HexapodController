async function sendPassword() {
    let password = $("#password-field").val();

    let req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
    };

    let resp = await fetch("/check-password", req);
    if (resp.statusText != "OK") {
        console.log("Wrong password");
        return;
    }
    console.log(resp);
    let html = await resp.text();

    $("#current-page").html(html).removeClass("landing-page");
    $("#current-page").html(html).addClass("control-page");
}

//submit the password using the button or pressing enter
$("#btnSubmitPw").on("click", sendPassword);
$("#password-field").keyup((event) => {
    if (event.key == "Enter") {
        sendPassword();
    }
});

//TEMPORARY CODE
window.onload = function () {
    document.getElementById("password-field").focus();
};
