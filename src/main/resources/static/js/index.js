document.addEventListener('DOMContentLoaded', () => {
    // Elements for Modal
    const modal = document.getElementById('login-modal');
    const heroLoginBtn = document.getElementById('hero-login-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('login-form');

    // Open Modal function
    const openModal = () => {
        modal.classList.remove('hidden'); // In case it has display:none logic
        // Slight delay to ensure CSS transition triggers properly
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    };

    // Close Modal function
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            // Optional: reset form fields when closed
            loginForm.reset();
        }, 300); // 300ms matches CSS transition time
    };

    // Event Listeners for opening modal
    if(heroLoginBtn) heroLoginBtn.addEventListener('click', openModal);
    if(navLoginBtn) navLoginBtn.addEventListener('click', openModal);

    // Event Listener for closing modal via X button
    if(closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle Form Submission (MVP Mock Login)
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload

            // Get selected role
            const roleSelect = document.getElementById('role');
            const selectedRole = roleSelect.value;

            const btn = loginForm.querySelector('button[type="submit"]');

            // Add a little fake loading animation
            const originalText = btn.innerText;
            btn.innerText = "Authenticating...";
            btn.style.opacity = "0.8";

            // Mock authentication delay (600ms)
            setTimeout(() => {
                if (selectedRole) {
                    // Redirect to the appropriate dashboard
                    window.location.href = 'html/' + selectedRole + '.html';
                } else {
                    alert("Please select a role.");
                    btn.innerText = originalText;
                    btn.style.opacity = "1";
                }
            }, 600);
        });
    }
});
