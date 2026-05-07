import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

let stompClient = null;
let connectPromise = null;

function buildClient() {
  return new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {}
  });
}

export function ensureRealtimeConnected() {
  if (stompClient?.connected) {
    return Promise.resolve(stompClient);
  }

  if (connectPromise) {
    return connectPromise;
  }

  stompClient = buildClient();
  connectPromise = new Promise((resolve, reject) => {
    stompClient.onConnect = () => {
      resolve(stompClient);
      connectPromise = null;
    };

    stompClient.onStompError = (frame) => {
      reject(new Error(frame?.headers?.message || 'STOMP broker error'));
      connectPromise = null;
    };

    stompClient.onWebSocketError = (event) => {
      reject(new Error(event?.message || 'WebSocket error'));
      connectPromise = null;
    };

    stompClient.activate();
  });

  return connectPromise;
}

export async function subscribeTopic(destination, onMessage) {
  const client = await ensureRealtimeConnected();
  const subscription = client.subscribe(destination, (message) => {
    try {
      onMessage(JSON.parse(message.body));
    } catch {
      onMessage(message.body);
    }
  });

  return () => subscription.unsubscribe();
}

/**
 * Disconnect từ STOMP server
 * Gọi khi: user logout, tắt app, hoặc không cần realtime nữa
 */
export function disconnectRealtime() {
  if (stompClient?.connected) {
    stompClient.deactivate();
    stompClient = null;
  }
  connectPromise = null;
}

/**
 * Publish message tới một destination (gửi tin nhắn)
 * @param {string} destination - Destination path (e.g., /app/chat/send)
 * @param {object} body - Message body sẽ được stringify
 */
export async function publishMessage(destination, body) {
  const client = await ensureRealtimeConnected();
  client.publish({
    destination,
    body: JSON.stringify(body)
  });
}

/**
 * Get current connection status
 */
export function isConnected() {
  return stompClient?.connected ?? false;
}

/**
 * Setup auto-reconnect listener
 * Gọi 1 lần lúc app init để tự động reconnect khi mất kết nối
 */
export function setupAutoReconnect(onReconnect) {
  if (!stompClient) return;
  
  stompClient.onDisconnect = (frame) => {
    console.log('Disconnected from STOMP:', frame);
    stompClient = null;
    connectPromise = null;
    if (onReconnect) {
      setTimeout(() => onReconnect(), 3000);
    }
  };
}
