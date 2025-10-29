const https = require('https');

// Replace with your actual bot token and channel ID
const BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'; // Replace with your actual bot token
const CHANNEL_ID = '@yourchannel'; // Replace with your channel ID

async function testTelegram() {
    try {
        // Test bot
        console.log('Testing bot connection...');
        const botResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        const botData = await botResponse.json();
        console.log('Bot test:', botData.ok ? 'Success' : 'Failed');
        
        if (botData.ok) {
            console.log('Bot name:', botData.result.username);
            
            // Test updates
            console.log('Testing updates...');
            const updatesResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=5`);
            const updatesData = await updatesResponse.json();
            console.log('Updates test:', updatesData.ok ? 'Success' : 'Failed');
            console.log('Updates count:', updatesData.result.length);
            
            // Check for photos
            const photoMessages = updatesData.result.filter(update => 
                update.message && update.message.photo
            );
            console.log('Photo messages found:', photoMessages.length);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testTelegram();
