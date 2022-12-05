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

})();

// control display module of the gameBoard on the DOM
let DisplayController = (function () {
    let GameDisplayData = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    const spot = document.querySelectorAll(".spot");



    pubsub.subscribe("GameData", GetGameData);

    function GetGameData(data) {
        GameDisplayData = data;
        DisplayBoard();
    }

    function DisplayBoard() {
        for (let i = 0; i < GameDisplayData.length; i++) {
            spot[i].textContent = GameDisplayData[i];
        }
    }

})();

//GameBoard module
let GameBoard = (function () {

    let Game = {
        BoardData: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        playerChoice: "",
        init: function () {
            AddGlobalEventListener("click", "#O", PlayerMarkChoice);
            AddGlobalEventListener("click", "#X", PlayerMarkChoice);
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
        UnlockPlayerChoice();
        RefreshPublishedData();
    }

    function UnlockPlayerChoice() {
        document.getElementById("X").removeAttribute("disabled");
        document.getElementById("O").removeAttribute("disabled");
    }

    function lockPlayerChoice() {
        document.getElementById("X").setAttribute("disabled", "");
        document.getElementById("O").setAttribute("disabled", "");
    }

    function PlayerMarkChoice(e) {
        Game.playerChoice = e.target.id;
    }

    function UpdateGameBoardData(e) {
        Game.BoardData[e.target.id] = Game.playerChoice;

        if (Game.playerChoice) {
            lockPlayerChoice();
            RefreshPublishedData();
        }
    }
    function RefreshPublishedData() {
        pubsub.publish("GameData", Game.BoardData);
    }
    Game.init();
})();


