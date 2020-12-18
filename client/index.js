async function sendPost() {
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ msg: "Testing" })
    };

    let resp = await fetch("/test", request);
    let data = await resp.json();
    console.log(data);
}
