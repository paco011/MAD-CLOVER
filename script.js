// ==========================================================================
// 1. ホームページ管理用設定（お休みしたい日をここに登録します）
// ==========================================================================
// ★お休みしたい土曜日を以下のように登録できます。
// 表記は「2026/06/20」でも「2026-6-20」でも動作します。
// 理由を書きたい場合は、{ date: "日付", reason: "理由" } の形式で書けます。
const INACTIVE_DATES = [
    { date: "2026/12/26", reason: "年末年始" }
];

// 表示する土曜日の件数（標準は8週分）
const DISPLAY_SCHEDULE_COUNT = 6;


// ==========================================================================
// 2. ホームページ基本動作ロジック（ここより下は通常書き換える必要はありません）
// ==========================================================================
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

    // 開催予定（土曜日）の自動生成機能
    const scheduleGrid = document.getElementById('schedule-grid');
    if (scheduleGrid) {
        const upcomingSaturdays = getUpcomingSaturdays(DISPLAY_SCHEDULE_COUNT, INACTIVE_DATES);
        
        scheduleGrid.innerHTML = '';
        upcomingSaturdays.forEach(schedule => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            
            if (schedule.isInactive) {
                const reasonText = schedule.reason ? `【休み：${schedule.reason}】` : '【お休み】';
                item.textContent = `${schedule.dateStr} ${reasonText}`;
                item.style.opacity = '0.5';
                item.style.textDecoration = 'line-through';
                item.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            } else {
                item.textContent = schedule.dateStr;
            }
            scheduleGrid.appendChild(item);
        });
    }

    // 日付フォーマット正規化用関数（スラッシュや一桁月日を統一する）
    function normalizeDateStr(dateInput) {
        if (!dateInput) return '';
        
        let dateTarget = '';
        if (typeof dateInput === 'string') {
            dateTarget = dateInput;
        } else if (typeof dateInput === 'object' && dateInput.date) {
            dateTarget = dateInput.date;
        }

        const cleanStr = dateTarget.replace(/-/g, '/'); // ハイフン区切りをスラッシュに
        const parts = cleanStr.split('/');
        if (parts.length !== 3) return '';

        const y = parts[0];
        const m = String(parseInt(parts[1], 10)).padStart(2, '0');
        const d = String(parseInt(parts[2], 10)).padStart(2, '0');
        return `${y}/${m}/${d}`;
    }

    function getUpcomingSaturdays(count, inactiveList = []) {
        const schedules = [];
        const today = new Date();
        const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 直近の土曜日までの日数を計算
        let daysToSaturday = (6 - current.getDay() + 7) % 7;
        // 土曜日の21時を過ぎていたら、次の週の土曜日を基準にする
        if (today.getDay() === 6 && today.getHours() >= 21) {
            daysToSaturday = 7;
        }
        
        current.setDate(current.getDate() + daysToSaturday);
        
        // 比較用にお休みリストをパース・正規化してマップ化
        const inactiveMap = {};
        inactiveList.forEach(item => {
            const normKey = normalizeDateStr(item);
            if (normKey) {
                inactiveMap[normKey] = typeof item === 'object' ? (item.reason || '') : '';
            }
        });
        
        for (let i = 0; i < count; i++) {
            const year = current.getFullYear();
            const month = String(current.getMonth() + 1).padStart(2, '0');
            const day = String(current.getDate()).padStart(2, '0');
            
            const dateKey = `${year}/${month}/${day}`;
            const dateStr = `${year}/${month}/${day} (土)`;
            const isInactive = dateKey in inactiveMap;
            
            schedules.push({
                dateStr: dateStr,
                isInactive: isInactive,
                reason: isInactive ? inactiveMap[dateKey] : ''
            });
            
            current.setDate(current.getDate() + 7);
        }
        return schedules;
    }

    // ==========================================================================
    // Form Submission & Confirmation Modal Logic (バリデーション強化版)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const confirmModal = document.getElementById('confirm-modal');
    const successModal = document.getElementById('success-modal');
    
    const btnCloseModalX = document.getElementById('btn-close-modal-x');
    const btnModalBack = document.getElementById('btn-modal-back');
    const btnModalSubmit = document.getElementById('btn-modal-submit');
    const btnModalCloseOk = document.getElementById('btn-modal-close-ok');
    
// script.js 内の formFields（新：全6項目の統合スリム版）
    const formFields = [
        { id: 'name', confirmId: 'confirm-name', label: 'お名前' },
        { id: 'email', confirmId: 'confirm-email', label: 'メールアドレス' },
        { id: 'gender', confirmId: 'confirm-gender', label: '性別' },
        { id: 'profile', confirmId: 'confirm-profile', label: '年齢・住まい・職業等' }, // ★ 新統合項目
        { id: 'start_date', confirmId: 'confirm-start-date', label: '参加希望日時' },
        { id: 'message', confirmId: 'confirm-message', label: 'メッセージ' }
    ];

    if (contactForm && confirmModal && successModal) {
        contactForm.removeAttribute('onsubmit');
        
        // --- 共通エラー表示関数 ---
        const showError = (input, message) => {
            let errorEl = input.parentNode.querySelector('.error-text');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-text';
                input.parentNode.appendChild(errorEl);
            }
            errorEl.textContent = message;
            input.classList.add('input-error');
        };

        const clearError = (input) => {
            const errorEl = input.parentNode.querySelector('.error-text');
            if (errorEl) {
                errorEl.remove();
            }
            input.classList.remove('input-error');
        };

        // --- 各項目の個別判定ロジック ---
        const validateField = (input) => {
            const val = input.value.trim();
            const id = input.id;

            // 1. 必須チェック
            if (input.hasAttribute('required') && val === '') {
                const labelEl = contactForm.querySelector(`label[for="${id}"]`);
                const name = labelEl ? labelEl.textContent.replace('（ふりがな）', '').replace('（連絡先）', '') : '項目';
                showError(input, `${name}を入力してください。`);
                return false;
            }

            // 2. メールアドレス形式チェック（正規表現）
            if (id === 'email' && val !== '') {
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!emailRegex.test(val)) {
                    showError(input, '有効なメールアドレスの形式で入力してください。');
                    return false;
                }
            }

            // 3. 年齢の妥当性チェック
            if (id === 'age' && val !== '') {
                const ageNum = parseInt(val, 10);
                if (isNaN(ageNum) || ageNum < 15 || ageNum > 85) {
                    showError(input, '15歳から85歳までの半角数字（整数）で入力してください。');
                    return false;
                }
            }

            // 4. メッセージ欄のURLスパム判定
            if (id === 'message' && val !== '') {
                const urlCount = (val.match(/https?:\/\//gi) || []).length;
                if (urlCount > 1) { // 複数のURLリンクがある場合は自動スパムと判定
                    showError(input, 'セキュリティ保護のため、リンク（URL）の複数貼り付けは禁止されています。');
                    return false;
                }
            }

            // エラーがない場合はクリア
            clearError(input);
            return true;
        };

        // --- リアルタイム判定のバインド ---
        const inputsToValidate = contactForm.querySelectorAll('input, select, textarea');
        inputsToValidate.forEach(input => {
            // フォーカスが外れたとき（blur）
            input.addEventListener('blur', () => {
                validateField(input);
            });
            // 選択式項目や入力が変更されたとき（input / change）
            input.addEventListener('input', () => {
                const errorEl = input.parentNode.querySelector('.error-text');
                if (errorEl) {
                    validateField(input); // すでにエラーが出ている場合はリアルタイムにエラー消去を走らせる
                }
            });
        });

        // --- フォーム送信時のチェック ---
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isAllValid = true;
            let firstInvalidInput = null;

            // すべての入力項目を一斉に検査
            inputsToValidate.forEach(input => {
                const isValid = validateField(input);
                if (!isValid) {
                    isAllValid = false;
                    if (!firstInvalidInput) {
                        firstInvalidInput = input;
                    }
                }
            });
            
            // エラーが存在する場合は、最初のエラー項目へフォーカスを当ててスムーズスクロール
            if (!isAllValid) {
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                    firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // 確認モーダル（テーブル）へデータを挿入
            formFields.forEach(field => {
                const inputEl = document.getElementById(field.id);
                const confirmEl = document.getElementById(field.confirmId);
                if (inputEl && confirmEl) {
                    let val = inputEl.value.trim();
                    if (!val) {
                        val = '（未入力）';
                    } else if (field.id === 'gender') {
                        val = inputEl.options[inputEl.selectedIndex].text;
                    }
                    
                    if (field.suffix && val !== '（未入力）') {
                        val += field.suffix;
                    }
                    
                    confirmEl.textContent = val;
                }
            });
            
            // 確認モーダルを開く
            confirmModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        // 確認モーダルを閉じる処理
        const closeConfirmModal = () => {
            confirmModal.style.display = 'none';
            document.body.style.overflow = '';
        };

        if (btnCloseModalX) btnCloseModalX.addEventListener('click', closeConfirmModal);
        if (btnModalBack) btnModalBack.addEventListener('click', closeConfirmModal);

        // APIデータ送信処理
        if (btnModalSubmit) {
            btnModalSubmit.addEventListener('click', async () => {
                const originalBtnText = btnModalSubmit.textContent;
                btnModalSubmit.textContent = '送信中...';
                btnModalSubmit.disabled = true;

                const formData = new FormData(contactForm);
                const accessKey = formData.get('access_key');
                
                const botCheck = formData.get('botcheck');
                if (botCheck) {
                    console.warn('Bot submission detected.');
                    closeConfirmModal();
                    alert('送信に失敗しました。');
                    return;
                }

                try {
                    if (accessKey === 'YOUR_ACCESS_KEY_PLACEHOLDER') {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log('Demo submission successful. Form values:', Object.fromEntries(formData.entries()));
                    } else {
                        const response = await fetch('https://api.web3forms.com/submit', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        if (!response.ok || !result.success) {
                            throw new Error(result.message || 'API submission failed');
                        }
                    }
                    
                    closeConfirmModal();
                    successModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    contactForm.reset();
                    
                } catch (err) {
                    console.error('Submission error:', err);
                    alert('申し訳ありません。送信中にエラーが発生しました。時間をおいて再度お試しください。');
                } finally {
                    btnModalSubmit.textContent = originalBtnText;
                    btnModalSubmit.disabled = false;
                }
            });
        }

        if (btnModalCloseOk) {
            btnModalCloseOk.addEventListener('click', () => {
                successModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
       window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        } else if (e.target === successModal) {
            successModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // --- スケジュールと持ち物のセクション一括開閉（アコーディオン）制御（全デバイス対応） ---
    const sectionTitles = document.querySelectorAll('.details-title');
    sectionTitles.forEach(title => {
        title.addEventListener('click', () => {
            // PCでもスマホでも、クリックされたら親コンテナに開閉クラスを切り替える
            const container = title.parentElement;
            if (container) {
                container.classList.toggle('is-expanded');
            }
        });
        // --- スマホ・PC共通：応募フォームカードの展開（スライド）制御 ---
    const btnOpenForm = document.getElementById('btn-open-form');
    const formCtaContainer = document.getElementById('form-cta-container');
    const formExpandContainer = document.getElementById('form-expand-container');

    if (btnOpenForm && formCtaContainer && formExpandContainer) {
        btnOpenForm.addEventListener('click', () => {
            // CTAボタンエリアを非表示にし、フォームエリアを滑らかに展開する
            formCtaContainer.style.maxHeight = '0';
            formCtaContainer.style.opacity = '0';
            formCtaContainer.style.overflow = 'hidden';
            formCtaContainer.style.marginBottom = '0';

            formExpandContainer.style.maxHeight = '1500px'; // フォーム全体が収まる高さ
            formExpandContainer.style.opacity = '1';
        });
    }
    });

   // --- プライバシーポリシーモーダルの開閉制御（フッター整理後） ---
    const privacyModal = document.getElementById('privacy-modal');
    const linkPrivacyInline = document.getElementById('link-privacy-inline');
    // ★ linkPrivacyFooter の変数定義を削除しました
    const btnClosePrivacy = document.getElementById('btn-close-privacy');
    const btnPrivacyOk = document.getElementById('btn-privacy-ok');

    if (privacyModal) {
        const openPrivacy = () => {
            privacyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
        const closePrivacy = () => {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        };

        if (linkPrivacyInline) linkPrivacyInline.addEventListener('click', openPrivacy);
        // ★ linkPrivacyFooter のイベントリスナーを削除しました
        if (btnClosePrivacy) btnClosePrivacy.addEventListener('click', closePrivacy);
        if (btnPrivacyOk) btnPrivacyOk.addEventListener('click', closePrivacy);

        window.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                closePrivacy();
            }
        });
    }

} // 元の 433 行目のカッコ
}); // 元の 434 行目のカッコ