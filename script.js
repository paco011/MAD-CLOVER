document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Recruit Section Tabs Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close other open FAQ items for clean experience
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }
            });
            
            // Toggle active state
            if (isActive) {
                item.classList.remove('active');
                if (answer) answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Remove direct onsubmit from HTML to manage it cleanly here
        contactForm.removeAttribute('onsubmit');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('体験参加のご応募ありがとうございます！内容が確認されました。\n※この画面はデモ表示です。直接応募される場合はフォーム下部の「メールアドレスを表示する」ボタンからご連絡ください。');
            contactForm.reset();
        });
    }

    // Secure Email Reveal Logic
    const btnRevealEmail = document.getElementById('btn-reveal-email');
    const revealedEmailContainer = document.getElementById('revealed-email-container');
    
    if (btnRevealEmail && revealedEmailContainer) {
        // Base64 encoded email: fujimino.basket@gmail.com
        const encodedEmail = 'ZnVqaW1pbm8uYmFza2V0QGdtYWlsLmNvbQ==';
        
        btnRevealEmail.addEventListener('click', () => {
            const email = atob(encodedEmail);
            
            // Render clickable mailto link
            revealedEmailContainer.innerHTML = `
                <a href="mailto:${email}" title="メールを送る">
                    <i class="ph ph-envelope-simple-open"></i>
                    <strong>${email}</strong>
                </a>
            `;
            
            // Hide reveal button and show revealed email
            btnRevealEmail.style.display = 'none';
            revealedEmailContainer.style.display = 'inline-block';
        });
    }
});
