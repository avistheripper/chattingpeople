let socket;

function init(url) {
	socket = new WebSocket(url);
	console.log('connecting...');
}

function registerOpenHandler(handlerFunction){

	socket.onopen = () => {
		console.log('connection opened throught the WebSocket');
		handlerFunction();
	}

}

function registerMessageHandler(handlerFunction) {
	socket.onmessage = (e) => {
		console.log('message ', e.data);
		let data = JSON.parse(e.data);
		handlerFunction(data);
	}
}

function sendMessage(payload) {
	socket.send(JSON.stringify(payload));
}

function registerCloseHandler(handlerFunction) {
	socket.onclose= () => {
		console.log('connection is about to be closed');
		handlerFunction();
	}
}


export default{
	init,
	registerOpenHandler,
	registerMessageHandler,
	sendMessage,
	registerCloseHandler
}