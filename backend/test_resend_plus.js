const axios = require('axios');
require('dotenv').config();

const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_GYm9zjt4_HLoo34hKcCRb4eoHxGiQDXFU";
const to = "mayushinde234+admin@gmail.com";

console.log("Testing Resend API Key with +admin...");
axios.post('https://api.resend.com/emails', {
  from: 'DineExpress <onboarding@resend.dev>',
  to: [to],
  subject: 'DineExpress + Trick Test',
  html: '<p>Testing Gmail + Trick!</p>'
}, {
  headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }
}).then(res => {
  console.log("✅ SUCCESS! Email accepted by Resend:", res.data);
}).catch(err => {
  console.log("❌ ERROR:", JSON.stringify(err.response?.data, null, 2) || err.message);
});
