import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Center, useTexture } from '@react-three/drei';
import API_BASE_URL from '../apiConfig';

// Internal component for the actual mesh
const DepthPlane = ({ imageUrl, depthUrl }) => {
    // Load both textures
    // useTexture from drei simplifies the TextureLoader process and handles suspense
    const [colorMap, displacementMap] = useTexture([imageUrl, depthUrl]);

    const materialRef = useRef();

    useFrame((state) => {
        // Optional: slight animation float
        if (materialRef.current) {
            // we could animate displacementScale if we wanted a breathing effect
        }
    });

    return (
        <mesh>
            {/* High segment count is necessary for smooth displacement mapping */}
            <planeGeometry args={[5, 5, 128, 128]} />
            <meshStandardMaterial
                ref={materialRef}
                map={colorMap}
                displacementMap={displacementMap}
                displacementScale={1.2} // Increased for a more 'proper' pop
                roughness={0.4} // Lowered for a more premium, glossy food look
                metalness={0.05}
            />
        </mesh>
    );
};

export default function DepthImage3D({ image, depthMapCanvas }) {
    // Convert the depth map HTMLCanvasElement to a data URL that TextureLoader can read
    const depthUrl = useMemo(() => {
        if (!depthMapCanvas) return null;
        return depthMapCanvas.toDataURL();
    }, [depthMapCanvas]);

    if (!image || !depthUrl) {
        return <div className="depth-loading">Loading Depth Data...</div>;
    }

    // Standardize URL: use API_BASE_URL and ensure consistent path normalization
    const normalizedPath = image.image_url.startsWith('/') ? image.image_url.slice(1) : image.image_url;
    const imageUrl = image.image_url.startsWith('http')
        ? image.image_url
        : `${API_BASE_URL}/images/${normalizedPath}?v=${Date.now()}`;

    return (
        <div style={{ width: '100%', height: '500px', background: '#0a1c15', borderRadius: '15px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                <React.Suspense fallback={<mesh><planeGeometry args={[5, 5]} /><meshStandardMaterial map={new TextureLoader().load(imageUrl)} /></mesh>}>
                    <Center>
                        <DepthPlane imageUrl={imageUrl} depthUrl={depthUrl} />
                    </Center>
                </React.Suspense>
                {/* OrbitControls let the user drag to rotate/tilt */}
                <OrbitControls
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
