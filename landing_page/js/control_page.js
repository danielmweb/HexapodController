class Move {
    static add_move_btn = `
    <div class="move-container">
        <div class="move" id="add-move-btn">
            <p class="tooltip-text">
                Adicionar movimento
            </p>
        </div>
    </div>`;
    constructor(id, description, icon, idIsMoveString = true) {
        this.id = id;
        this.description = description;
        this.icon = icon;
        this.idIsMoveString = idIsMoveString;
        if (idIsMoveString) {
            this.moveString = this.id + "#";
        } else {
            this.moveString = "";
        }
        this.domElement = `
        <div class="move-container">
            <div class="move" id="${this.id}">
                <p class="tooltip-text">
                    ${this.description}
                </p>
                <div class="options-keyboard-move-container">
                
                    <div class="remove-keyboard-move">
                    </div>
                    <div class="cancel-remove-keyboard-move">
                    </div>
                
                </div>
                
            </div>
        </div>`;
    }
}

class DisplayedMove {
    constructor(move, index = 0) {
        this.move = move;
        this.index = index;
        this.updateDomElement();
    }
    updateDomElement() {
        this.domElement = `
        <div class="displayed-move-container">
            <div class="option"></div>
            <div class="displayed-move" id="displayed-${this.move.id}ç${this.index}"></div>
            <div class="option remove-move-option"></div>
        </div>`;
    }
}

// let moves = [
//     new Move(
//         "rot_left",
//         "Vire à esquerda",
//         "styles/assets/icons/rotate_left.svg"
//     ),
//     new Move(
//         "move_forwards",
//         "Ande para frente",
//         "styles/assets/icons/arrow_forward.svg"
//     ),
//     new Move(
//         "rot_right",
//         "Vire à direita",
//         "styles/assets/icons/rotate_right.svg"
//     ),
//     new Move(
//         "move_left",
//         "Ande para esquerda",
//         "styles/assets/icons/arrow_left.svg"
//     ),
//     new Move(
//         "move_backwards",
//         "Ande para trás",
//         "styles/assets/icons/arrow_back.svg"
//     ),
//     new Move(
//         "move_right",
//         "Ande para direita",
//         "styles/assets/icons/arrow_right.svg"
//     )
// ];

let moves = [];

//this fills the moves keyboard with the moves from the array, and also append
//the add move btn at the end
function updateMoves() {
    $(".move-container").remove();

    moves.forEach((move) => {
        $(".moves-table").append(move.domElement);
        $("#" + move.id).css("background-image", `url("${move.icon}")`);
    });
    $(".moves-table").append(Move.add_move_btn);
}

//this fills the moves-display with the displayedMoves from the array.
function updateDisplayedMoves() {
    $(".displayed-move-container").remove();
    if (displayedMoves.length <= 0) {
        return;
    }
    displayedMoves.forEach((displayedMove, i) => {
        //add/update the index for all the moves
        displayedMoves[i].index = i;
        displayedMoves[i].updateDomElement();
        $(".moves-display").prepend(displayedMoves[i].domElement);
        let id =
            "#displayed-" +
            displayedMoves[i].move.id +
            "ç" +
            displayedMoves[i].index;

        $(id).css("background-image", `url("${displayedMoves[i].move.icon}")`);
    });

    $(".displayed-move").click((event) => {
        let id = event.target.id;

        //remove stuff from the previously selected displayed move
        removeHighlight(selected);
        hideOptions(selected);
        //check if i clicked twice on the same displayed move
        if (id == selected) {
            selected = undefined;
            return;
        }
        //add stuff to the current selected displayed move
        selected = id;
        addHighLight(selected);
        showOptions(selected);
    });
}
//the id of a displayed move has the following syntax: displayed-move_nameçindex
//being ç the separator between the index and the actual id
let displayedMoves = [];
let selected;
let wasHold = false;
let onMoveHold;

function addHighLight(id) {
    if (!id) {
        return;
    }

    $("#" + id).addClass("highlighted-displayed-move");
}

function showOptions(id) {
    if (!id) {
        return;
    }
    //makes the option visible
    $("#" + id)
        .parent()
        .children(".option")
        .show();

    //adds a click listener to the remove option
    $("#" + id)
        .parent()
        .children(".remove-move-option")
        .click(() => {
            $("#" + id)
                .parent()
                .remove();

            let index = id.split("ç")[1];
            selected = undefined;
            displayedMoves.splice(index, 1);
            updateDisplayedMoves();
            // setClickListeners(); this was adding multiple listeners to the same buttons what was causing
            //them to count the 'clicked' event many times and thus add a lot of moves at the same time
        });
}

function removeHighlight(id) {
    if (!id) {
        return;
    }

    $("#" + id).removeClass("highlighted-displayed-move");
}

function hideOptions(id) {
    if (!id) {
        return;
    }
    $("#" + id)
        .parent()
        .children(".option")
        .hide()
        .off("click");
}

//this listener is being set twice
function setMoveClickListener(selector) {
    $(selector).click((event) => {
        let targetId = event.target.id;
        //return if the move clicked was the add btn
        if (targetId == "add-move-btn") {
            return;
        }
        //if the move pressed is a custom move, then decode it into basic moves and
        //display the basic moves on the moves-diplay container

        let clickedMoveIndex = moves.findIndex((move) => {
            return move.id == targetId;
        });

        if (clickedMoveIndex == -1) {
            return; //if no id matches, then just get out of here
        }
        if (targetId.search("custom") != -1) {
            let basicMoves = moves[clickedMoveIndex].moveString.split("#");
            basicMoves.pop(); //the last element of the array is an empty string, so we dump it here

            basicMoves.forEach((basicMove) => {
                //find the index of the corresponding basicMove inside the moves array
                let moveIndex = moves.findIndex((move) => {
                    return move.id == basicMove;
                });
                //add the corresponding move to the displayedMoves array
                displayedMoves.push(new DisplayedMove(moves[moveIndex]));
            });
        } else {
            displayedMoves.push(new DisplayedMove(moves[clickedMoveIndex]));
        }

        updateDisplayedMoves();
    });
}

function setClickListeners() {
    setMoveClickListener(".move"); //set the listener for all the moves

    $(".move").on("mousedown", (event) => {
        let moveId = event.target.id;
        if (moveId.search("custom") == -1) {
            return; //if this is not a custom move, then you cant remove it
        }
        //makes the options for the move appear if the button is held for 1.5sec
        onMoveHold = setTimeout(() => {
            //remove the listener from the move displaying the options
            let moveSelector = "#" + moveId;
            // console.log($(moveSelector));
            $(moveSelector).off("click");
            // console.log($(moveSelector));
            let optionsContainer = $("#" + moveId).children(
                ".options-keyboard-move-container"
            );

            //hide the tooltip

            let tooltipSelector = "#" + moveId + " .tooltip-text";
            $(tooltipSelector).css("display", "none");

            //show the options for that move
            optionsContainer.css("visibility", "visible");

            //set the listeners for the options

            optionsContainer
                .children(".cancel-remove-keyboard-move")
                .click(() => {
                    //hide the options and set the listener back when cancel is clicked
                    console.log("clicked cancel");

                    optionsContainer.css("visibility", "hidden");
                    $(tooltipSelector).css("display", "block");

                    //remove the listeners from the options
                    optionsContainer
                        .children(".cancel-remove-keyboard-move")
                        .off("click");
                    optionsContainer
                        .children(".remove-keyboard-move")
                        .off("click");

                    //add back the listener to the move
                    setMoveClickListener(moveSelector);
                });

            optionsContainer.children(".remove-keyboard-move").click(() => {
                console.log("Clicked remove");
                $(tooltipSelector).css("display", "block");

                //remove the move from the array
                let index = moves.findIndex((move) => {
                    return move.id == moveId;
                });

                moves.splice(index, 1);

                sendMoves(getMovesFromServer);
            });
        }, 1500);
    });

    $(".move").on("mouseup", (event) => {
        clearInterval(onMoveHold); // cancel the function if the button is left before 1.5sec
    });

    //click listener for the button which toggles the description bar that appears
    //after you've clicked to add a new move

    $("#add-move-btn").click(() => {
        let descBar = $(".desc-bar-container");
        descBar.fadeIn();
    });
}

let idCount = 0;

async function getMovesFromServer() {
    let resp = await fetch("/moves");
    movesTemp = await resp.json();
    moves = [];
    movesTemp.forEach((moveTemp) => {
        let newMove = new Move(
            moveTemp.id,
            moveTemp.description,
            moveTemp.icon,
            moveTemp.idIsMoveString
        );
        if (!moveTemp.idIsMoveString) {
            newMove.moveString = moveTemp.moveString;
        }
        moves.push(newMove);
    });
    let lastCustom;
    moves.forEach((move) => {
        if (move.id.search("custom") != -1) {
            lastCustom = move.id;
        }
    });

    if (lastCustom) {
        idCount = parseInt(lastCustom.replace("custom", "")) + 1;

        console.log("id count: ", idCount);
    }

    updateMoves();

    setClickListeners();
}

getMovesFromServer();
//need to update this

$(".btn-create-desc").click(() => {
    //if theres no displayed move then get outta here
    if (displayedMoves.length <= 0) {
        return;
    }

    let descBar = $(".desc-bar-container");
    descBar.fadeOut();

    let desc = $("#desc-field").val();
    $("#desc-field").val("");
    //creates a new Move object and set it up
    let customIcon = "styles/assets/icons/custom_move.svg";
    let customId = "custom" + idCount;
    let newMove = new Move(customId, desc, customIcon, false);

    //set the moveString of the custom move to be a colletion of all of the
    //displayed moves
    displayedMoves.forEach((displayedMove) => {
        newMove.moveString += displayedMove.move.moveString;
    });

    moves.push(newMove);

    updateMoves();
    setClickListeners();
    idCount++;

    //send the moves array to the server
    sendMoves();
});

$(".cancel-add-custom").click(() => {
    let descBar = $(".desc-bar-container");
    descBar.fadeOut();
});

async function sendMoves(callback) {
    let req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(moves)
    };
    let resp = await fetch("/save-moves", req);
    let status = await resp.text();
    console.log("status: ", status);
    if (callback) {
        callback();
    }
}

$(".btn-clear-moves").click(() => {
    displayedMoves = [];
    updateDisplayedMoves();
});

let isUp;
$(".btn-move-robot").click(async function () {
    let data = {
        moveStrings: ""
    };
    if (displayedMoves.length <= 0) {
        colorEffect(".btn-move-robot", "#ff0000");
        return; //if theres no displayed move then get out of here
    }
    //concatenates all the displayed moves into a variable
    displayedMoves.forEach((displayedMove) => {
        data.moveStrings += displayedMove.move.moveString;
    });
    //send value of the variable to the server
    let req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    //console.log("sending: ", data);
    let resp;
    try {
        resp = await fetch("/move-stream", req);
        resp = await resp.json();
        isUp = resp.isUp;
    } catch (error) {
        console.log("Could not read response from server");
        colorEffect(".btn-move-robot", "#ff0000");
    }
    //if the robot is not up then flash red the getUp btn

    if (resp.isUp == "0") {
        colorEffect(".btn-getUp", "#ff0000");
    } else {
        colorEffect(".btn-move-robot", "#00ff00");
    }
});

function colorEffect(selector, effectColor, endColor) {
    endColor =
        endColor == undefined ? $(selector).css("background-color") : endColor;
    $(selector).animate({ backgroundColor: effectColor }, 250, "swing", () => {
        $(selector).animate({ backgroundColor: endColor }, 250);
    });
}
async function sendCommand(cmd) {
    let req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command: cmd })
    };

    let resp = await fetch("/command", req);
    resp = await resp.text();
    //console.log("Received from command: ", resp);
}

async function updateIsUp(move) {
    try {
        let resp = await fetch("/is-up");
        resp = await resp.json();
        isUp = resp.isUp;
        console.log("isUp: ", isUp);
        if (move == "up") {
            checkGetUp();
        } else if (move == "down") {
            checkGetDown();
        }
    } catch (error) {
        console.log("Couldn't update isUp");
    }
}

function checkGetUp() {
    if (isUp == "0") {
        colorEffect(".btn-getUp", "#00ff00"); //green
        sendCommand("getUp");
    } else {
        colorEffect(".btn-getUp", "#ff0000"); //red
    }
}

$(".btn-getUp").click(() => {
    updateIsUp("up");
});

function checkGetDown() {
    if (isUp == "1") {
        colorEffect(".btn-getDown", "#00ff00"); //green
        sendCommand("getDown");
    } else {
        //update isUp when clicking
        colorEffect(".btn-getDown", "#ff0000"); //red
    }
}

$(".btn-getDown").click(() => {
    updateIsUp("down");
});

$(".btn-cancel-robot-move").click(() => {
    //send cancel
    let req = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cancel: "yes" }) //this is cancel
    };

    fetch("/cancel", req);
});
/*

Each move is going to be represented as an object which has the property 
moveString that contains a string that represents that move. The string is 
going to be formatted according to the way that the decoder on the robot works,
so the move starts with ends with #, for example: move_right#.

The move object also is going to have its description and its icon.

all the moves are going to be stored in an array of moves.

*/
