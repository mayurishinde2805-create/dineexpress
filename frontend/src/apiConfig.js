const getApiUrl = () => {
    // Check for Production Environment Variable first
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    if (typeof window !== "undefined") {
        // Localhost logic
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return "http://localhost:4000";
        }
        
        // Localtunnel logic
        if (window.location.hostname.includes("loca.lt")) {
            return "http://localhost:4000";
        }
    }
    
    // Default Production / Dev Fallback
    const host = window.location.hostname;
    if (host.includes("onrender.com")) {
        // If frontend is dineexpress-frontend-xxxx.onrender.com, backend is dineexpress-backend-xxxx.onrender.com
        const base = host.split("-frontend")[0] || "dineexpress";
        const suffix = host.split("-frontend")[1] || "";
        return `https://${base}-backend${suffix}`;
    }
    
    return "https://dineexpress-backend.onrender.com";

};

const API_BASE_URL = getApiUrl();
export default API_BASE_URL;
