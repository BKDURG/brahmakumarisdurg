const https = require('https');

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
async function testTelegramConnection() {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
    
    console.log('Testing Telegram connection...');
    
    if (!BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN is not set');
        return false;
    }
    
    if (!CHANNEL_ID) {
        console.error('❌ TELEGRAM_CHANNEL_ID is not set');
        return false;
    }
    
    try {
        // Test bot
        console.log('Testing bot connection...');
        const botData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        
        if (!botData.ok) {
            console.error(`❌ Bot connection failed: ${botData.description}`);
            return false;
        }
        
        console.log(`✅ Bot connected: ${botData.result.username}`);
        
        // Test updates
        console.log('Testing updates...');
        const updatesData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=5`);
        
        if (!updatesData.ok) {
            console.error(`❌ Updates failed: ${updatesData.description}`);
            return false;
        }
        
        console.log(`✅ Updates received: ${updatesData.result.length}`);
        
        // Check for photos
        const photoMessages = updatesData.result.filter(update => 
            update.message && update.message.photo
        );
        console.log(`✅ Photo messages found: ${photoMessages.length}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        return false;
    }
}

// Run the test
testTelegramConnection().then(success => {
    if (success) {
        console.log('✅ All tests passed!');
        process.exit(0);
    } else {
        console.log('❌ Tests failed!');
        process.exit(1);
    }
});
