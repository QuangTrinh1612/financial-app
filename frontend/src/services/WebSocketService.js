import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.socketConnected = false;
        this.subscribedTopics = new Map();
    }

    connect(onConnect) {
        const socket = new SockJS('/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect(
            {},
            frame => {
                this.socketConnected = true;
                console.log('Connected to WebSocket:', frame);
                if (onConnect) onConnect();
            },
            error => {
                console.error('Error connecting to WebSocket:', error);
                this.socketConnected = false;
                // Try to reconnect after 5 seconds
                setTimeout(() => this.connect(onConnect), 5000);
            }
        );
    }

    subscribe(topic, callback) {
        if (!this.socketConnected) {
            console.warn('WebSocket not connected. Cannot subscribe to:', topic);
            return false;
        }

        if (!this.subscribedTopics.has(topic)) {
            const subscription = this.stompClient.subscribe(topic, message => {
                const data = JSON.parse(message.body);
                callback(data);
            });

            this.subscribedTopics.set(topic, subscription);
            console.log('Subscribed to topic:', topic);
        }

        return true;
    }

    unsubscribe(topic) {
        if (this.subscribedTopics.has(topic)) {
            this.subscribedTopics.get(topic).unsubscribe();
            this.subscribedTopics.delete(topic);
            console.log('Unsubscribed from topic:', topic);
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
            this.socketConnected = false;
            this.subscribedTopics.clear();
            console.log('Disconnected from WebSocket');
        }
    }

    isConnected() {
        return this.socketConnected;
    }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;