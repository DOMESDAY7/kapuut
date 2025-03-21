import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextProps {
    ws: WebSocket | null;
    sendMessage: (msg: any) => void;
    lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextProps>({
    ws: null,
    sendMessage: () => { },
    lastMessage: null,
});

const wsURL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3000";

export const WebSocketProvider: React.FC<{ lobbyCode: string, children: React.ReactNode }> = ({ lobbyCode, children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        if (!lobbyCode) return;

        const socket = new WebSocket(`${wsURL}/lobby/${lobbyCode}`);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Message from server:", data);
                setLastMessage(data);
            } catch (error) {
                console.error("Failed to parse message:", error);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [lobbyCode]);

    const sendMessage = (msg: any) => {
        
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
        }
    };

    return (
        <WebSocketContext.Provider value={{ ws, sendMessage, lastMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);