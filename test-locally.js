const https = require('https');

// Replace these with your actual values
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const CHANNEL_ID = '@yourchannel';

// Helper function for HTTPS requests
function httpsRequest(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`JSON parsing error: ${error.message}`));
                }
            });
        });
        
        request.on('error', (error) => {
            reject(new Error(`Request error: ${error.message}`));
        });
    });
}

// Test function
async function testTelegram() {
    console.log('Testing Telegram connection locally...');
    
    try {
        // Test bot
        console.log('Testing bot connection...');
        const botData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        
        if (!botData.ok) {
            console.error(`❌ Bot connection failed: ${botData.description}`);
            return;
        }
        
        console.log(`✅ Bot connected: ${botData.result.username}`);
        
        // Test updates
        console.log('Testing updates...');
        const updatesData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=5`);
        
        if (!updatesData.ok) {
            console.error(`❌ Updates failed: ${updatesData.description}`);
            return;
        }
        
        console.log(`✅ Updates received: ${updatesData.result.length}`);
        
        // Check for photos
        const photoMessages = updatesData.result.filter(update => 
            update.message && update.message.photo
        );
        console.log(`✅ Photo messages found: ${photoMessages.length}`);
        
        // Show details of photo messages
        photoMessages.forEach((update, index) => {
            const msg = update.message;
            console.log(`Photo ${index + 1}:`);
            console.log(`  - Chat ID: ${msg.chat.id}`);
            console.log(`  - Date: ${new Date(msg.date * 1000).toLocaleString()}`);
            console.log(`  - Caption: ${msg.caption || 'No caption'}`);
        });
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
    }
}

// Run the test
testTelegram();
