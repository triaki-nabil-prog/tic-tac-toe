
// pubsub module
let pubsub = {

    subscriptions: {
        GameData: []
    },

    subscribe: function (subscriptionName, fn) {
        this.subscriptions[subscriptionName] = this.subscriptions[subscriptionName] || [];
        this.subscriptions[subscriptionName].push(fn);
    },

    unsubscribe: function (subscriptionName, fn) {
        if (this.subscriptions[subscriptionName]) {
            const index = this.subscriptions.indexOf(fn);
            if (index !== -1) this.subscriptions[subscriptionName].splice(index, 1);
        }
    },

    publish: function (subscriptionName, data) {
        if (this.subscriptions[subscriptionName]) {
            this.subscriptions[subscriptionName].forEach(fn => { fn(data); });
        }
    }
};

//Game flow control module
let GameFlowControl = (function () {

    let GameFlow = {
        init: function () {
            pubsub.subscribe("DisplayData", isVictory);
        },
    }

    function isVictory(spot) {
        let combs = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let comb of combs) {
            if (
                spot[comb[0]].textContent == spot[comb[1]].textContent &&
                spot[comb[1]].textContent == spot[comb[2]].textContent &&
                spot[comb[0]].textContent != ''
            ) {
                if (spot[comb[2]].textContent == 'X' || spot[comb[2]].textContent == 'O') {
                    pubsub.publish("Winner", spot[comb[2]].textContent);
                }
            }
        }
    }

    GameFlow.init();
})();

// control display module of the gameBoard on the DOM
let DisplayGameBoardData = (function () {

    let GameBoard = {
        GameDisplayData: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        spot: document.querySelectorAll(".spot"),
        win: document.querySelector(".winner"),
        init: function () {
            pubsub.subscribe("ResetDisplay", Reset);
            pubsub.subscribe("GameData", DisplayBoard);
            pubsub.subscribe("Winner", WinnerDisplay);
        }
    }

    function DisplayBoard(data) {
        GameBoard.GameDisplayData = data;
        for (let i = 0; i < GameBoard.GameDisplayData.length; i++) {
            GameBoard.spot[i].textContent = GameBoard.GameDisplayData[i];
            pubsub.publish("DisplayData", GameBoard.spot)
        }
    }

    function WinnerDisplay(data) {
        if (data == "X") {
            GameBoard.win.classList.add("winner-display");
            GameBoard.win.textContent = "Winner is player ONE";
            lockGameBoard();
        }
        else if (data == "O") {
            GameBoard.win.classList.add("winner-display");
            GameBoard.win.textContent = "Winner is player TWO";
            lockGameBoard();
        }
    }

    function lockGameBoard() {
        GameBoard.spot.forEach(function (element) {
            element.classList.add("disabled-spot");
        });
    }

    function UnlockGameBoard() {
        GameBoard.spot.forEach(function (element) {
            element.classList.remove("disabled-spot");
        });
    }

    function Reset() {
        GameBoard.win.textContent = "";
        GameBoard.win.classList.remove("winner-display");
        UnlockGameBoard();
    }

    GameBoard.init();
})();

//GameBoard module
let GetGameBoardData = (function () {

    let Game = {
        BoardData: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        playerOneChoice: "",
        playerTwoChoice: "",
        played: 0,
        init: function () {
            AddGlobalEventListener("click", "#O", PlayerTwoChoice);
            AddGlobalEventListener("click", "#X", PlayerOneChoice);
            AddGlobalEventListener("click", ".spot", UpdateGameBoardData);
            AddGlobalEventListener("click", "#reset", ResetData);
        }
    }

    function AddGlobalEventListener(type, selector, callback) {
        document.addEventListener(type, (e) => {
            if (e.target.matches(selector)) {
                callback(e);
            }
        });
    }

    function ResetData() {
        Game.BoardData = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        Game.played = 0;
        Game.playerOneChoice = "";
        Game.playerTwoChoice = "";
        UnlockPlayerChoice();
        RefreshPublishedData();
        pubsub.publish("ResetDisplay", "");
        const enable = document.querySelectorAll(".disabled-spot");
        enable.forEach(function (element) {
            element.classList.remove("disabled-spot");
        })
    }

    function UnlockPlayerChoice() {
        const x = document.getElementById("X");
        const o = document.getElementById("O");
        x.removeAttribute("disabled")
        o.removeAttribute("disabled");
        x.textContent = "X";
        o.textContent = "O";
    }

    function lockPlayerOneChoice() {
        document.getElementById("X").setAttribute("disabled", "");
    }

    function lockPlayerTwoChoice() {
        document.getElementById("O").setAttribute("disabled", "");
    }

    function PlayerOneChoice(e) {
        Game.playerOneChoice = e.target.id;
        e.target.textContent = "Player One: X";
        lockPlayerOneChoice();
    }

    function PlayerTwoChoice(e) {
        Game.playerTwoChoice = e.target.id;
        e.target.textContent = "Player Two: O";
        lockPlayerTwoChoice();
    }

    function UpdateGameBoardData(e) {
        if (Game.playerOneChoice && Game.played % 2 == 0) {
            Game.BoardData[e.target.id] = Game.playerOneChoice;
            Game.played++;
            e.target.classList.add("disabled-spot");
        }
        else if (Game.playerTwoChoice && !Game.played % 2 == 0) {
            Game.BoardData[e.target.id] = Game.playerTwoChoice;
            Game.played++;
            e.target.classList.add("disabled-spot");
        }
        RefreshPublishedData();
    }

    function RefreshPublishedData() {
        pubsub.publish("GameData", Game.BoardData);
    }

    Game.init();
})();


