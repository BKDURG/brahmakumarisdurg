const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const OUTPUT_DIR = 'data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'photos.json');

async function fetchPhotos() {
    console.log('Fetching photos from Telegram...');
    
    try {
        // Get updates from Telegram
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=100`);
        const data = await response.json();
        
        if (!data.ok) {
            throw new Error(`Telegram API error: ${data.description}`);
        }
        
        console.log(`Received ${data.result.length} updates`);
        
        // Filter messages with photos from the specified channel
        const photoMessages = data.result.filter(update => {
            if (!update.message || !update.message.photo) return false;
            
            // Check if message is from the correct channel
            const chatId = update.message.chat.id.toString();
            const targetChatId = CHANNEL_ID.replace('@', '').replace('-100', '');
            
            return chatId === targetChatId || chatId === '-' + targetChatId;
        });
        
        console.log(`Found ${photoMessages.length} photo messages`);
        
        if (photoMessages.length === 0) {
            console.log('No photo messages found in the channel');
            return;
        }
        
        // Extract photo information
        const photos = [];
        
        for (const msg of photoMessages) {
            const photoArray = msg.message.photo;
            const largestPhoto = photoArray[photoArray.length - 1];
            const caption = msg.message.caption || '';
            
            // Get file URL
            const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${largestPhoto.file_id}`);
            const fileData = await fileResponse.json();
            
            if (fileData.ok) {
                const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
                
                photos.push({
                    id: largestPhoto.file_id,
                    url: fileUrl,
                    caption: caption,
                    date: msg.message.date
                });
            }
        }
        
        // Sort by date (newest first)
        photos.sort((a, b) => b.date - a.date);
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        // Save photos to JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
        
        console.log(`Successfully saved ${photos.length} photos to ${OUTPUT_FILE}`);
        
    } catch (error) {
        console.error('Error fetching photos:', error);
        process.exit(1);
    }
}

// Run the function
fetchPhotos();
