//GameBoard module
const GameBoard =(function(){
    const GameBoard =[];

    return{};
}

)();

//Game flow control module
const GameFlowControl =(function(){
    

    return{};
}

)();

// control display module of the gameBoard on the DOM
const DisplayController =(function(){
    

    return{};
}

)();

//player creation 
const player = function(name){


    return{name,};
}

// a two player game
PlayerOne = new player("player One");
PlayerTwo = new player("player Tow");





// pubsub module
const pubsub = {
	subscriptions: {
	},
	subscribe: function(subscriptionName, fn) {
		this.subscriptions[subscriptionName] = this.subscriptions[subscriptionName] || [];
		this.subscriptions[subscriptionName].push(fn);
	},
	unsubscribe: function(subscriptionName, fn) {
		if (this.subscriptions[subscriptionName]) {
			const index = this.subscriptions.indexOf(fn);
			if (index !== -1) this.subscriptions[subscriptionName].splice(index, 1);
		}
	},
	publish: function(subscriptionName, data) {
		if (this.subscriptions[subscriptionName]) {
			this.subscriptions[subscriptionName].forEach(fn => { fn(data); });
		}
	}
};