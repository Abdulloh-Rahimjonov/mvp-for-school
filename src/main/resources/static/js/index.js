document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM yuklandi - JavaScript ishga tushdi');

    const loginBtn = document.getElementById('loginBtn');
    const ctaLoginBtn = document.getElementById('ctaLoginBtn');
    const modal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.getElementById('contactForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Login tugmasi bosildi');
            openModal();
        });
    }

    if (ctaLoginBtn) {
        ctaLoginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('CTA tugmasi bosildi');
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closeModal();
        });
    }

    function openModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('Modal ochildi');
        }
    }

    function closeModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('Modal yopildi');
        }
    }

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Login form submit qilindi');

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            console.log('Username:', username);
            console.log('Password:', password);
            console.log('Role:', role);

            if (!username || !password || !role) {
                showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error');
                return;
            }

            // Rolega qarab redirect
            let redirectUrl = '';
            let roleName = '';

            switch (role) {
                case 'director':
                    redirectUrl = 'html/director.html';
                    roleName = 'Director';
                    break;
                case 'manager':
                    redirectUrl = 'html/manager.html';
                    roleName = 'Manager';
                    break;
                case 'cashier':
                    redirectUrl = 'html/cashier.html';
                    roleName = 'Cashier';
                    break;
                case 'teacher':
                    redirectUrl = 'html/teacher.html';
                    roleName = 'Teacher';
                    break;
                default:
                    showNotification('Noto\'g\'ri role tanlandi', 'error');
                    return;
            }

            showNotification(`Xush kelibsiz, ${roleName}!`, 'success');

            closeModal();

            setTimeout(function () {
                console.log('Redirect:', redirectUrl);
                window.location.href = redirectUrl;
            }, 1000);
        });
    }

    function showNotification(message, type = 'info') {
        // Notification elementini yaratish
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;


        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';

        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border-left: 4px solid;
            }
            .notification.success {
                border-left-color: #2ecc71;
            }
            .notification.success i {
                color: #2ecc71;
            }
            .notification.error {
                border-left-color: #e74c3c;
            }
            .notification.error i {
                color: #e74c3c;
            }
            .notification.info {
                border-left-color: #3498db;
            }
            .notification.info i {
                color: #3498db;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // 3 soniyadan keyin o'chirish
        setTimeout(function () {
            notification.remove();
        }, 3000);
    }


    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Mobile menuni yopish
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            if (name && email && message) {
                showNotification('Xabaringiz yuborildi!', 'success');
                this.reset();
            } else {
                showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error');
            }
        });
    }

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
    });

    console.log('Barcha event listenerlar qo\'shildi');
});