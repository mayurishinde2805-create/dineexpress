const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// -------------------------------------------------------------
// DINE-EXPRESS: Image to 3D Converter (using Meshy.ai API)
// -------------------------------------------------------------
// Instructions:
// 1. Get a free API key from https://www.meshy.ai/
// 2. Add MESHY_API_KEY=your_meshy_api_key_here to your .env file
// 3. Run: node convert_to_3d.js <path_to_image.jpg>
// -------------------------------------------------------------

const MESHY_API_KEY = process.env.MESHY_API_KEY;

if (!MESHY_API_KEY) {
    console.error("❌ ERROR: MESHY_API_KEY is missing in your .env file.");
    console.error("👉 Please get one from https://www.meshy.ai/ and add it to backend/.env");
    process.exit(1);
}

const imagePath = process.argv[2];

if (!imagePath || !fs.existsSync(imagePath)) {
    console.error("❌ ERROR: Please provide a valid path to a 2D image.");
    console.error("👉 Example: node convert_to_3d.js ../frontend/public/images/pizza.jpg");
    process.exit(1);
}

const TARGET_DIR = path.join(__dirname, '..', 'frontend', 'public', 'models');
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Helper to convert local image to Base64 (Meshy requires standard URLs or Base64 Data URI)
function getBase64Image(file) {
    const bitmap = fs.readFileSync(file);
    const ext = path.extname(file).replace('.', '');
    return `data:image/${ext};base64,${Buffer.from(bitmap).toString('base64')}`;
}

async function convertImageTo3D() {
    try {
        console.log(`🚀 Starting 3D Conversion for: ${path.basename(imagePath)}`);
        const base64Image = getBase64Image(imagePath);

        // Step 1: Create the Task
        console.log(`📡 Sending image to Meshy AI...`);
        const createRes = await axios.post(
            'https://api.meshy.ai/v1/image-to-3d',
            { image_url: base64Image, enable_pbr: true },
            { headers: { 'Authorization': `Bearer ${MESHY_API_KEY}` } }
        );

        const taskId = createRes.data.result;
        console.log(`✅ Task Created! Task ID: ${taskId}`);
        console.log(`⏳ Waiting for AI to generate the model (this usually takes 1-3 minutes)...`);

        // Step 2: Poll for Completion
        let isProcessing = true;
        let modelUrl = null;

        while (isProcessing) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before checking again

            const statusRes = await axios.get(
                `https://api.meshy.ai/v1/image-to-3d/${taskId}`,
                { headers: { 'Authorization': `Bearer ${MESHY_API_KEY}` } }
            );

            const status = statusRes.data.status;
            const progress = statusRes.data.progress;

            process.stdout.write(`\r🔄 Status: ${status} (${progress}%)     `);

            if (status === 'SUCCEEDED') {
                isProcessing = false;
                modelUrl = statusRes.data.model_urls.glb;
                console.log(`\n🎉 3D Model Generation Complete!`);
            } else if (status === 'FAILED' || status === 'EXPIRED') {
                console.error(`\n❌ Task Failed with status: ${status}`);
                if (statusRes.data.task_error) console.error("Reason:", statusRes.data.task_error);
                process.exit(1);
            }
        }

        // Step 3: Download the .glb file
        const fileName = `${path.parse(imagePath).name}_3d.glb`;
        const savePath = path.join(TARGET_DIR, fileName);

        console.log(`⬇️  Downloading 3D model to: ${savePath}`);

        const response = await axios({
            method: 'GET',
            url: modelUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log(`✅ Success! Your 3D format is saved.`);
            console.log(`👉 You can now link this in your database as: /models/${fileName}`);
        });

        writer.on('error', (err) => {
            console.error('❌ Error saving file:', err);
        });

    } catch (err) {
        console.error('\n❌ ERROR:');
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

convertImageTo3D();
