const socket = io();

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
    resp = await resp.text();

    if (!resp) {
        console.log("wrong password");
        return;
    }

    //replaces the login screen with the control ui received from the sever

    $("head").append(
        `<link rel="stylesheet" href="styles/robot_control.css" />`
    );
    $(".background").html(resp);
    $("body").append(`<script src="js/control_page.js">`);
}

//submit the password using the button or pressing enter
function submit() {
    sendPassword();
}

$("#btnSubmitPw").on("click", submit);
$("#password-field").keyup((event) => {
    if (event.key == "Enter") {
        submit();
    }
});

// //TEMPORARY CODE
// window.onload = function () {
//     document.getElementById("password-field").focus();
// };
