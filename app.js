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
    pubsub.subscribe("GameData", render);
    function render(data) {
        console.log("render" + data); // getting game data from the gameboard
    }
})();







// control display module of the gameBoard on the DOM
let DisplayController = (function () {

    pubsub.subscribe("GameData", render);

    function render(data) {
        console.log("render" + data); // getting game data from the gameboard
    }


})();





//GameBoard module
let GameBoard = (function () {
    let GameBoardData = ["X", "O", "O", "X", "O", "O", "X", "O", "O"];
    pubsub.publish("GameData", GameBoardData);


})();








//player creation 
let player = function (name) {
    return { name, };
}

// a two player game
PlayerOne = new player("player One");
PlayerTwo = new player("player Tow");
