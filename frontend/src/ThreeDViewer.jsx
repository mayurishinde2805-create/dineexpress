import React, { useState, useEffect, useRef } from 'react';

const ThreeDViewer = ({ modelUrl, posterUrl, itemName }) => {
    const [status, setStatus] = useState('Initializing...');
    const [error, setError] = useState(null);
    const modelRef = useRef(null);

    useEffect(() => {
        const mv = modelRef.current;
        if (!mv) return;

        const onLoad = () => {
            setStatus('Model Loaded ✅');
            console.log(`[3D] Loaded: ${itemName}`);
        };

        const onError = (e) => {
            setStatus('Load Failed ❌');
            const errorMsg = e.detail?.sourceError?.message || e.detail?.sourceError || 'Unknown Error';
            setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : String(errorMsg));
            console.error(`[3D] Error:`, e);
        };

        const onProgress = (e) => {
            const progress = Math.round(e.detail.totalProgress * 100);
            setStatus(`Loading: ${progress}%`);
        };

        mv.addEventListener('load', onLoad);
        mv.addEventListener('error', onError);
        mv.addEventListener('progress', onProgress);

        return () => {
            mv.removeEventListener('load', onLoad);
            mv.removeEventListener('error', onError);
            mv.removeEventListener('progress', onProgress);
        };
    }, [modelUrl, itemName]);

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', background: '#0a1c15', position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
            {/* Professional Status Overlay */}
            {status !== 'Model Loaded ✅' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    textAlign: 'center'
                }}>
                    <div className="v3-loader-spinner" style={{ border: '4px solid #d4af3733', borderTop: '4px solid #d4af37', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }}></div>
                    <div style={{ color: '#d4af37', fontSize: '14px', fontWeight: '600' }}>{status}</div>
                    {error && <div style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '5px' }}>{error}</div>}
                </div>
            )}

            <model-viewer
                key={modelUrl}
                ref={modelRef}
                src={modelUrl}
                poster={posterUrl}
                alt={itemName}
                auto-rotate
                camera-controls
                ar
                shadow-intensity="1"
                environment-image="neutral"
                exposure="1.0"
                loading="eager"
                reveal="auto"
                style={{ width: '100%', height: '100%', display: 'block', backgroundColor: 'transparent' }}
            >
                <div slot="poster" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={posterUrl} alt="Poster" style={{ maxWidth: '70%', transition: '0.3s' }} />
                </div>
            </model-viewer>
        </div>
    );
};

export default ThreeDViewer;
