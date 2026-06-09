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

    // Form Submission & Confirmation Modal Logic
    const contactForm = document.getElementById('contact-form');
    
    // Modal elements
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');
    
    // Modal buttons
    const btnCloseModalX = document.getElementById('btn-close-modal-x');
    const btnModalBack = document.getElementById('btn-modal-back');
    const btnModalSubmit = document.getElementById('btn-modal-submit');
    const btnModalCloseOk = document.getElementById('btn-modal-close-ok');
    
    // Form fields to verify
    const formFields = [
        { id: 'name', confirmId: 'confirm-name', label: 'お名前' },
            { id: 'email', confirmId: 'confirm-email', label: 'メールアドレス' },
        { id: 'age', confirmId: 'confirm-age', label: 'ご年齢', suffix: '歳' },
        { id: 'gender', confirmId: 'confirm-gender', label: '性別' },
        { id: 'address', confirmId: 'confirm-address', label: 'お住まい' },
        { id: 'occupation', confirmId: 'confirm-occupation', label: 'ご職業' },
        { id: 'experience', confirmId: 'confirm-experience', label: '競技歴' },
        { id: 'exercise', confirmId: 'confirm-exercise', label: '最近の運動状況' },
        { id: 'start_date', confirmId: 'confirm-start-date', label: '参加希望日時' },
        { id: 'message', confirmId: 'confirm-message', label: 'メッセージ' }
    ];

    if (contactForm && confirmModal && successModal) {
        // Intercept form submit to show confirmation modal
        contactForm.removeAttribute('onsubmit');
        contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // スマートフォン向けカスタム・バリデーションチェック
    const requiredInputs = contactForm.querySelectorAll('[required]');
    let missingFields = [];
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            // 未入力の項目のラベル名を取得
            const labelEl = contactForm.querySelector(`label[for="${input.id}"]`);
            const fieldName = labelEl ? labelEl.textContent.replace('（ふりがな）', '').replace('（連絡先）', '') : '未設定項目';
            missingFields.push(fieldName);
        }
    });
    
    // 未入力の必須項目がある場合、スマホでも確実にポップアップで警告する
    if (missingFields.length > 0) {
        alert(`未入力の必須項目があります：\n\n・${missingFields.join('\n・')}\n\nすべての項目を入力してから、再度送信してください。`);
        
        // 最初の未入力項目にカーソル（フォーカス）を自動で移動させる
        const firstEmptyInput = Array.from(requiredInputs).find(input => !input.value.trim());
        if (firstEmptyInput) {
            firstEmptyInput.focus();
            firstEmptyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
            
            // Populate confirmation modal details
            formFields.forEach(field => {
                const inputEl = document.getElementById(field.id);
                const confirmEl = document.getElementById(field.confirmId);
                if (inputEl && confirmEl) {
                    let val = inputEl.value.trim();
                    if (!val) {
                        val = '（未入力）';
                    } else if (field.id === 'gender') {
                        // Display text for selected option
                        val = inputEl.options[inputEl.selectedIndex].text;
                    }
                    
                    if (field.suffix && val !== '（未入力）') {
                        val += field.suffix;
                    }
                    
                    confirmEl.textContent = val;
                }
            });
            
            // Show confirmation modal
            confirmModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Disable background scrolling
        });

        // Close confirmation modal
        const closeConfirmModal = () => {
            confirmModal.style.display = 'none';
            document.body.style.overflow = ''; // Enable background scrolling
        };

        if (btnCloseModalX) btnCloseModalX.addEventListener('click', closeConfirmModal);
        if (btnModalBack) btnModalBack.addEventListener('click', closeConfirmModal);

        // Submit form data securely
        if (btnModalSubmit) {
            btnModalSubmit.addEventListener('click', async () => {
                // Change button state to loading
                const originalBtnText = btnModalSubmit.textContent;
                btnModalSubmit.textContent = '送信中...';
                btnModalSubmit.disabled = true;

                const formData = new FormData(contactForm);
                const accessKey = formData.get('access_key');
                
                // Check if honeypot is filled (spam protection)
                const botCheck = formData.get('botcheck');
                if (botCheck) {
                    console.warn('Bot submission detected.');
                    closeConfirmModal();
                    alert('送信に失敗しました。');
                    return;
                }

                try {
                    // If it is a placeholder key, simulate API call for demo purposes
                    if (accessKey === 'YOUR_ACCESS_KEY_PLACEHOLDER') {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log('Demo submission successful. Form values:', Object.fromEntries(formData.entries()));
                    } else {
                        // Actual Web3Forms API submission
                        const response = await fetch('https://api.web3forms.com/submit', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        if (!response.ok || !result.success) {
                            throw new Error(result.message || 'API submission failed');
                        }
                    }
                    
                    // Hide confirmation modal
                    closeConfirmModal();
                    
                    // Show success modal
                    successModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Reset form
                    contactForm.reset();
                    
                } catch (err) {
                    console.error('Submission error:', err);
                    alert('申し訳ありません。送信中にエラーが発生しました。時間をおいて再度お試しください。');
                } finally {
                    // Restore button state
                    btnModalSubmit.textContent = originalBtnText;
                    btnModalSubmit.disabled = false;
                }
            });
        }

        // Close success modal
        if (btnModalCloseOk) {
            btnModalCloseOk.addEventListener('click', () => {
                successModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modals on clicking outside modal content
        window.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                closeConfirmModal();
            } else if (e.target === successModal) {
                successModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
   // 開催予定（土曜日）の自動生成機能
    const scheduleGrid = document.getElementById('schedule-grid');
    if (scheduleGrid) {
        // ★ お休みしたい日付（YYYY/MM/DD 形式）をここに登録します
        const inactiveDates = [
            
        ];

        const displayCount = 9; 
        const upcomingSaturdays = getUpcomingSaturdays(displayCount, inactiveDates);
        
        scheduleGrid.innerHTML = '';
        upcomingSaturdays.forEach(schedule => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            
            if (schedule.isInactive) {
                // お休みの週のスタイル・テキスト
                item.textContent = `${schedule.dateStr} 【休み】`;
                item.style.opacity = '0.5';             // 表示を薄くする
                item.style.textDecoration = 'line-through'; // 取り消し線を引く（お好みで）
            } else {
                item.textContent = schedule.dateStr;
            }
            
            scheduleGrid.appendChild(item);
        });
    }

    function getUpcomingSaturdays(count, inactiveDates = []) {
        const schedules = [];
        const today = new Date();
        const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        let daysToSaturday = (6 - current.getDay() + 7) % 7;
        if (today.getDay() === 6 && today.getHours() >= 21) {
            daysToSaturday = 7;
        }
        
        current.setDate(current.getDate() + daysToSaturday);
        
        for (let i = 0; i < count; i++) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            const day = String(current.getDate()).padStart(2, '0');
            
            const dateStrWithoutEra = `${year}/${month}/${day}`;
            const dateStr = `${dateStrWithoutEra} (土)`;
            
            // お休みリストに含まれているかチェック
            const isInactive = inactiveDates.includes(dateStrWithoutEra);
            
            schedules.push({
                dateStr: dateStr,
                isInactive: isInactive
            });
            
            current.setDate(current.getDate() + 7);
        }
        
        return schedules;
    }
});
