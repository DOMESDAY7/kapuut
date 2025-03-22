export const APP_NAME = "kapuut";
export const avatarList =
    ["🥸", "😍", "🤩", "🤑", "🥳"]
export const baseUrlAPI = import.meta.env.VITE_API_URL ?? "http://localhost";

const getWebSocketUrl = () => {
    // Priorité à la variable d'environnement si elle existe
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }

    // Sinon, construire l'URL à partir de la location actuelle
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host; // Déjà au format hostname:port

    return `${protocol}//${host}/socket`;
};


export const wsURL = getWebSocketUrl();