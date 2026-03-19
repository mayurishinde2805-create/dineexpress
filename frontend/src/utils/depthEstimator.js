import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import * as depthEstimation from '@tensorflow-models/depth-estimation';

let model = null;

// Ensure TensorFlow.js backend is set up
export const initializeModel = async () => {
    if (model) return model;

    console.log("Initializing Depth Estimation Model...");
    try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log("WebGL backend ready");
    } catch (e) {
        console.warn("WebGL failed, falling back to WASM");
        await tf.setBackend('wasm');
        await tf.ready();
    }

    try {
        // Load the ARPortraitDepth model (Stable version for this package)
        const estimator = depthEstimation.SupportedModels.ARPortraitDepth;
        const modelConfig = {
            outputDepthRange: [0, 1]
        };

        model = await depthEstimation.createEstimator(estimator, modelConfig);
        console.log("AI Model loaded successfully. Warming up...");

        // Warm up the model to prepare GPU kernels
        const warmUpCanvas = document.createElement('canvas');
        warmUpCanvas.width = 128;
        warmUpCanvas.height = 128;
        try {
            await model.estimateDepth(warmUpCanvas, { minDepth: 0, maxDepth: 1 });
            console.log("Model warmed up");
        } catch (e) {
            console.warn("Warming failed, but model might still work:", e);
        }

        return model;
    } catch (error) {
        console.error("Error loading depth model:", error);
        throw error;
    }
};

/**
 * Resizes an image to a specific dimension to speed up AI processing
 */
const resizeImageForAI = (imageElement, maxDimension = 512) => {
    const canvas = document.createElement('canvas');
    let width = imageElement.naturalWidth || imageElement.width;
    let height = imageElement.naturalHeight || imageElement.height;

    if (width > height) {
        if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
        }
    } else {
        if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
        }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, width, height);
    return canvas;
};

/**
 * Creates a synthetic radial gradient depth map as a premium fallback
 * This makes the center of the image 'pop' out, which looks great for plates of food.
 */
const createFallbackDepthMap = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create a radial gradient (white in center, black at edges)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) / 1.5;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'white');    // Nearest
    gradient.addColorStop(0.7, '#888');   // Middle ground
    gradient.addColorStop(1, 'black');    // Farthest

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return canvas;
};

/**
 * Generates a Depth Map Canvas from an Image Element
 * @param {HTMLImageElement} imageElement 
 * @returns {Promise<HTMLCanvasElement>} 
 */
export const generateDepthMapCanvas = async (imageElement) => {
    if (!model) await initializeModel();

    try {
        const start = performance.now();
        console.log(`[${new Date().toLocaleTimeString()}] Starting depth estimation...`);

        // Performance Optimization: Resize the image before processing
        const resizerStart = performance.now();
        const resizedCanvas = resizeImageForAI(imageElement);
        console.log(`Image resized in ${(performance.now() - resizerStart).toFixed(2)}ms`);

        const estimationConfig = {
            minDepth: 0,
            maxDepth: 1
        };

        // Run inference with a timeout
        const estimatePromise = model.estimateDepth(resizedCanvas, estimationConfig);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000));

        const depthMap = await Promise.race([estimatePromise, timeoutPromise]);

        const end = performance.now();
        console.log(`[${new Date().toLocaleTimeString()}] Estimation finished in ${((end - start) / 1000).toFixed(2)}s`);

        if (depthMap) {
            // depthMap.toCanvas() returns an HTMLCanvasElement with the grayscale depth map drawn on it.
            return await depthMap.toCanvas();
        } else {
            console.warn("AI returned null, using smart fallback");
            return createFallbackDepthMap(resizedCanvas.width, resizedCanvas.height);
        }

    } catch (error) {
        console.error("Failed to estimate depth, using fallback:", error);
        // If AI fails completely (timeout/error), return the fallback so the user still sees 3D
        return createFallbackDepthMap(512, 512);
    }
};
