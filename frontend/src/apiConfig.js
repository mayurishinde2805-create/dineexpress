const getApiUrl = () => {
    if (typeof window !== "undefined") {
        // If the frontend is accessed via localhost, connect to localhost backend
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "http://localhost:4000";
        }
        // If accessed via localtunnel, we would need a backend localtunnel link, but fallback to network IP for now.
        if (window.location.hostname.includes("loca.lt")) {
            return "http://localhost:4000"; // Local tunnel proxies headers, but client tries to reach this
        }
    }
    return "http://192.168.0.102:4000";
};

const API_BASE_URL = getApiUrl();
export default API_BASE_URL;
