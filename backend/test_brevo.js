require('dotenv').config();
const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const to = "mayushinde234+customer@gmail.com";

console.log("Testing Brevo API Key...");
axios.post('https://api.brevo.com/v3/smtp/email', {
  sender: { name: "DineExpress", email: process.env.EMAIL_USER || "mayurishinde2805@gmail.com" },
  to: [{ email: to }],
  subject: "DineExpress Brevo Auto-Test",
  htmlContent: "<p>If you see this, Brevo is working flawlessly!</p>"
}, {
  headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' }
}).then(res => {
  console.log("✅ SUCCESS! Email accepted by Brevo:", res.data);
}).catch(err => {
  console.log("❌ ERROR:", JSON.stringify(err.response?.data, null, 2) || err.message);
});
