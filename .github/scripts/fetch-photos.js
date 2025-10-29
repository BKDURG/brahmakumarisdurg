const fs = require('fs');
const path = require('path');
const https = require('https'); // Using built-in https module

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const OUTPUT_DIR = 'data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'photos.json');

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
        
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Main function to fetch photos
async function fetchPhotos() {
    console.log('Starting Telegram photo fetch...');
    
    // Validate environment variables
    if (!BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
    }
    
    if (!CHANNEL_ID) {
        throw new Error('TELEGRAM_CHANNEL_ID environment variable is not set');
    }
    
    console.log(`Bot token: ${BOT_TOKEN.substring(0, 10)}...`);
    console.log(`Channel ID: ${CHANNEL_ID}`);
    
    try {
        // Step 1: Verify bot token
        console.log('Step 1: Verifying bot token...');
        const botData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        
        if (!botData.ok) {
            throw new Error(`Bot verification failed: ${botData.description}`);
        }
        
        console.log(`✓ Bot verified: ${botData.result.username} (${botData.result.first_name})`);
        
        // Step 2: Get updates from Telegram
        console.log('Step 2: Fetching updates...');
        const updatesData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=100`);
        
        if (!updatesData.ok) {
            throw new Error(`Failed to fetch updates: ${updatesData.description}`);
        }
        
        console.log(`✓ Received ${updatesData.result.length} updates`);
        
        // Step 3: Filter messages with photos from the specified channel
        console.log('Step 3: Filtering photo messages...');
        const photoMessages = updatesData.result.filter(update => {
            if (!update.message || !update.message.photo) return false;
            
            // Check if message is from the correct channel
            const chatId = update.message.chat.id.toString();
            const targetChatId = CHANNEL_ID.replace('@', '').replace('-100', '');
            
            return chatId === targetChatId || chatId === '-' + targetChatId;
        });
        
        console.log(`✓ Found ${photoMessages.length} photo messages from channel`);
        
        if (photoMessages.length === 0) {
            console.log('No photo messages found in the channel');
            ensureDirectoryExists(OUTPUT_DIR);
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
            console.log('✓ Created empty photos file');
            return;
        }
        
        // Step 4: Extract photo information
        console.log('Step 4: Extracting photo information...');
        const photos = [];
        
        for (const [index, msg] of photoMessages.entries()) {
            try {
                const photoArray = msg.message.photo;
                const largestPhoto = photoArray[photoArray.length - 1];
                const caption = msg.message.caption || '';
                
                // Get file URL
                const fileData = await httpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${largestPhoto.file_id}`);
                
                if (fileData.ok) {
                    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
                    
                    photos.push({
                        id: largestPhoto.file_id,
                        url: fileUrl,
                        caption: caption,
                        date: msg.message.date,
                        message_id: msg.message_id
                    });
                    
                    console.log(`✓ Processed photo ${index + 1}/${photoMessages.length}`);
                } else {
                    console.error(`Failed to get file info for photo ${index + 1}: ${fileData.description}`);
                }
            } catch (error) {
                console.error(`Error processing photo ${index + 1}: ${error.message}`);
            }
        }
        
        // Sort by date (newest first)
        photos.sort((a, b) => b.date - a.date);
        
        // Step 5: Save photos to JSON file
        console.log('Step 5: Saving photos to file...');
        ensureDirectoryExists(OUTPUT_DIR);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photos, null, 2));
        
        console.log(`✓ Successfully saved ${photos.length} photos to ${OUTPUT_FILE}`);
        
        // Step 6: Create a backup
        const backupFile = path.join(OUTPUT_DIR, `photos-backup-${Date.now()}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(photos, null, 2));
        console.log(`✓ Created backup file: ${backupFile}`);
        
    } catch (error) {
        console.error('Error in fetchPhotos:', error.message);
        throw error;
    }
}

// Run the function
fetchPhotos().catch(error => {
    console.error('Script failed:', error.message);
    process.exit(1);
});
