const axios = require('axios');
const RESEND_API_KEY = "re_GYm9zjt4_HLoo34hKcCRb4eoHxGiQDXFU";
const to = "mayushinde234@gmail.com";

console.log("Testing Resend API Key...");
axios.post('https://api.resend.com/emails', {
  from: 'DineExpress <onboarding@resend.dev>',
  to: [to],
  subject: 'DineExpress Auto-Test',
  html: '<p>If you see this, Resend is working flawlessly!</p>'
}, {
  headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }
}).then(res => {
  console.log("✅ SUCCESS! Email accepted by Resend:", res.data);
}).catch(err => {
  console.log("❌ ERROR:", JSON.stringify(err.response?.data, null, 2) || err.message);
});
