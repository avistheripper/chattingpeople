import socket from "./ws-client.js";
import {UserStore} from './storage.js';
import {ChatForm, ChatList, promptForUserName} from "./dom.js";


const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';


let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
	username = promptForUserName();
	userStore.set(username);
}


class ChatApp{
	constructor() {

		this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
		this.chatList = new ChatList(LIST_SELECTOR, username);

		socket.init("ws://localhost:3001");

		socket.registerOpenHandler(() => {
			this.chatForm.init((data) => {
				let message = new ChatMessage({message : data});
				socket.sendMessage(message.seralize());
			});
		});

		socket.registerMessageHandler((data) => {
			console.log(data);
			let message = new ChatMessage(data);
			this.chatList.drawMessage(message.seralize());
		});
		this.chatList.init();

		socket.registerCloseHandler(() => {
			console.log('Connection was closed, reboot server or try to hook up again');
		}); 
	}
}

class ChatMessage {
	constructor({
		message: m,
		user: u=username,
		timestamp: t=(new Date()).getTime()
	}) {
		this.message = m;
		this.user = u;
		this.timestamp = t;
	}
	seralize() {
		return {
			user: this.user,
			message: this.message,
			timestamp: this.timestamp
		};
	}
}

export default ChatApp;