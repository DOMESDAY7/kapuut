export const APP_NAME = "kapuut";
export const avatarList =
    ["🥸", "😍", "🤩", "🤑", "🥳"]
export const baseUrlAPI = import.meta.env.VITE_API_URL ?? "http://localhost";

const getWebSocketUrl = () => {
    // Priority to environment variable if it exists
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }

    // Alternatively, build the URL from the current location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host; // Already in hostname:port format

    return `${protocol}//${host}/socket`;
};


export const wsURL = getWebSocketUrl();