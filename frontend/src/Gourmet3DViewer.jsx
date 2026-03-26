import React, { useState, useEffect } from 'react';
import { generateDepthMapCanvas } from './utils/depthEstimator';
import DepthImage3D from './components/DepthImage3D';
import API_BASE_URL from './apiConfig';

const Gourmet3DViewer = ({ image, itemName }) => {
    const [depthCanvas, setDepthCanvas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        setLoading(true);
        setError(null);

        const loadDepth = async () => {
            try {
                // Construct URL
                const src = image.image_url.startsWith('http')
                    ? image.image_url
                    : `${API_BASE_URL}/images/${image.image_url.startsWith('/') ? image.image_url.slice(1) : image.image_url}?v=${Date.now()}`;

                // Use fetch instead of Image tag for better CORS handling
                const response = await fetch(src);
                if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch image`);
                
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);

                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = objectURL;

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = () => reject(new Error(`Failed to process bitmap for: ${image.image_url}`));
                });

                if (isCancelled) {
                    URL.revokeObjectURL(objectURL);
                    return;
                }

                const canvas = await generateDepthMapCanvas(img);
                URL.revokeObjectURL(objectURL);

                if (!isCancelled) {
                    setDepthCanvas(canvas);
                    setLoading(false);
                }
            } catch (err) {
                console.error("3D Viewer Error:", err);
                if (!isCancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        loadDepth();

        return () => {
            isCancelled = true;
        };
    }, [image.image_url]);

    if (loading) {
        return (
            <div className="v3-loader-mini">
                <div className="spinner-gold"></div>
                <p>Generating 3D Depth...</p>
            </div>
        );
    }

    if (error && !depthCanvas) {
        return (
            <div className="v3-loader-mini">
                <p style={{ color: '#ff4d4d' }}>3D Initialization Failed</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <DepthImage3D image={image} depthMapCanvas={depthCanvas} />
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(212, 175, 55, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '50px',
                border: '1px solid #d4af37',
                color: '#d4af37',
                fontSize: '0.8rem',
                fontWeight: '800',
                pointerEvents: 'none',
                zIndex: 10
            }}>
                DRAG TO ROTATE • SCROLL TO ZOOM
            </div>
        </div>
    );
};

export default Gourmet3DViewer;
