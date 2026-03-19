import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from './apiConfig';
import { initializeModel, generateDepthMapCanvas } from './utils/depthEstimator';
import DepthImage3D from './components/DepthImage3D';
import './gallery3d.css';

export default function Gallery3D() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [depthCanvas, setDepthCanvas] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isEstimating, setIsEstimating] = useState(false);
    const [estimationStatus, setEstimationStatus] = useState("");
    const [depthCache, setDepthCache] = useState({}); // Cache for generated depth maps
    const [debugLogs, setDebugLogs] = useState([]);

    const logDebug = (msg) => {
        setDebugLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
        console.log(`[Diagnostic] ${msg}`);
    };

    // Hidden image ref used for TF.js processing
    const hiddenImageRef = useRef(null);

    useEffect(() => {
        // Fetch gallery images from DB
        axios.get(`${API_BASE_URL}/api/gallery/images`)
            .then(res => {
                logDebug(`Fetched ${res.data.length} images`);
                setImages(res.data);
                if (res.data.length > 0) {
                    handleSelectImage(res.data[0]);
                }
            })
            .catch(err => {
                logDebug(`Failed to fetch images: ${err.message}`);
                console.error("Error fetching gallery:", err);
            });

        // Background loading of the AI Model
        logDebug("Initializing AI Model...");
        initializeModel()
            .then(() => {
                logDebug("AI Model Ready");
                setIsModelLoading(false);
            })
            .catch(err => {
                logDebug(`Model Initialization Error: ${err.message}`);
                console.error("Model failure:", err);
                setIsModelLoading(false);
            });
    }, []);

    const handleSelectImage = async (image) => {
        setSelectedImage(image);

        // Check cache first
        if (depthCache[image.id]) {
            setDepthCanvas(depthCache[image.id]);
            setIsEstimating(false);
            return;
        }

        setDepthCanvas(null); // Reset while processing

        if (isModelLoading) {
            return;
        }

        startEstimation(image);
    };

    // Ensure we process when model finally loads if an image was selected
    useEffect(() => {
        if (!isModelLoading && selectedImage && !depthCanvas && !isEstimating) {
            startEstimation(selectedImage);
        }
    }, [isModelLoading, selectedImage]);

    const startEstimation = (image) => {
        setIsEstimating(true);
        setEstimationStatus("Loading image...");
        // We set the src of our hidden image to trigger onload which we handle in the DOM
        if (hiddenImageRef.current) {
            logDebug(`Processing image: ${image.name}`);
            hiddenImageRef.current.crossOrigin = "anonymous";

            // Standardize URL: if it's a local /images/ path, route it through the backend /uploads proxy for CORS
            let imgUrl = image.image_url;
            if (!imgUrl.startsWith('http')) {
                const path = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
                // Map /images/ to /uploads/ which is served by the backend with CORS headers
                const standardizedPath = path.replace('/images/', '/uploads/');
                imgUrl = `${API_BASE_URL}${standardizedPath}`;
            }

            hiddenImageRef.current.src = imgUrl;
        }
    };

    const handleImageLoadForAI = async () => {
        if (!hiddenImageRef.current) return;
        logDebug("Image bitmap loaded into memory");
        try {
            setEstimationStatus("Analyzing image depth...");
            logDebug("Starting TF.js inference...");
            const canvas = await generateDepthMapCanvas(hiddenImageRef.current);
            if (canvas) {
                logDebug("3D Depth map ready (AI or Enhanced Fallback)");
                setEstimationStatus("Finalizing 3D mesh...");

                // Store in cache
                setDepthCache(prev => ({ ...prev, [selectedImage.id]: canvas }));
                setDepthCanvas(canvas);
            } else {
                logDebug("AI returned null result");
                setEstimationStatus("AI failed to analyze this image.");
            }
        } catch (error) {
            logDebug(`Estimation Error: ${error.message}`);
            setEstimationStatus("Error: AI model timed out.");
        } finally {
            setIsEstimating(false);
        }
    };

    const handleImageError = () => {
        logDebug("Error: Image failed to load. Check CORS/Network.");
        setIsEstimating(false);
        setEstimationStatus("Failed to load image asset.");
    };

    return (
        <div className="gallery-3d-container">
            <header className="g3d-header">
                <h1>Interactive 3D Depth Gallery</h1>
                <p>Powered by AI Depth Estimation & React Three Fiber</p>
                {isModelLoading && <div className="g3d-model-badge loading">Loading AI Model (~20MB)...</div>}
                {!isModelLoading && <div className="g3d-model-badge ready">AI Model Ready</div>}
            </header>

            {/* Hidden image element purely for passing DOM node to TF.js */}
            <img
                ref={hiddenImageRef}
                alt="hidden processing"
                style={{ display: 'none' }}
                onLoad={handleImageLoadForAI}
                onError={handleImageError}
            />

            <div className="g3d-main-content">
                <div className="g3d-viewer-area">
                    {selectedImage ? (
                        <div className="viewer-wrapper">
                            {isEstimating ? (
                                <div className="estimating-overlay">
                                    <div className="spinner"></div>
                                    <span>{estimationStatus}</span>
                                </div>
                            ) : null}

                            {depthCanvas ? (
                                <DepthImage3D image={selectedImage} depthMapCanvas={depthCanvas} />
                            ) : (
                                <div className="viewer-placeholder">
                                    <img
                                        src={selectedImage.image_url.startsWith('http') ? selectedImage.image_url : `${API_BASE_URL}${selectedImage.image_url.replace('/images/', '/uploads/')}`}
                                        alt={selectedImage.name}
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            )}
                            <div className="viewer-instructions">
                                🖱️ Click and drag to rotate • Scroll to zoom
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">Select an image to view in 3D</div>
                    )}
                </div>

                <div className="g3d-thumbnails">
                    <h3>Gallery</h3>
                    <div className="thumbs-grid">
                        {images.map(img => (
                            <div
                                key={img.id}
                                className={`thumb-card ${selectedImage?.id === img.id ? 'active' : ''}`}
                                onClick={() => handleSelectImage(img)}
                            >
                                <img
                                    src={img.image_url.startsWith('http') ? img.image_url : `${API_BASE_URL}${img.image_url.replace('/images/', '/uploads/')}`}
                                    alt={img.name}
                                    crossOrigin="anonymous"
                                />
                                <div className="thumb-name">{img.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="g3d-debug-panel">
                <h4>Diagnostic Logs</h4>
                <div className="debug-log-list">
                    {debugLogs.length === 0 && <p>Waiting for activity...</p>}
                    {debugLogs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
                </div>
            </div>
        </div>
    );
}
