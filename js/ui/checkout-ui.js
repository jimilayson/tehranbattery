// ============================================
// ===== مدیریت تسویه حساب (Checkout UI) =====
// ============================================

(function() {
    'use strict';

    // ===== وضعیت =====
    let cart = [];
    let currentOrder = null;
    let paymentTransactionId = null;
    let verificationCode = null;

    // ===== المنت‌ها =====
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.form-section');
    const cartSummary = document.getElementById('cartSummary');
    const infoForm = document.getElementById('infoForm');
    const verificationMessage = document.getElementById('verificationMessage');
    const confirmPhone = document.getElementById('confirmPhone');
    const verificationInput = document.getElementById('verificationCode');
    const resendBtn = document.getElementById('resendCodeBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const finalAmount = document.getElementById('finalAmount');
    const payBtn = document.getElementById('payBtn');
    const resultBox = document.getElementById('resultBox');
    const paymentModal = document.getElementById('paymentModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalAmount = document.getElementById('modalAmount');
    const modalMessage = document.getElementById('modalMessage');

    // ============================================
    // ===== توابع کمکی =====
    // ============================================

    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    function showMessage(element, text, type = 'info') {
        element.className = `message ${type}`;
        element.innerHTML = text;
        element.style.display = 'block';
    }

    function hideMessage(element) {
        element.style.display = 'none';
    }

    // ============================================
    // ===== مدیریت مراحل =====
    // ============================================

    window.goToStep = function(step) {
        // به‌روزرسانی مراحل
        steps.forEach((s, index) => {
            const stepNum = index + 1;
            s.classList.remove('active', 'done');
            if (stepNum < step) s.classList.add('done');
            if (stepNum === step) s.classList.add('active');
        });

        // به‌روزرسانی بخش‌ها
        sections.forEach((s, index) => {
            s.classList.toggle('active', index + 1 === step);
        });

        // اسکرول به بالا
        document.querySelector('.checkout-container').scrollIntoView({ behavior: 'smooth' });
    };

    // ============================================
    // ===== بارگذاری سبد خرید =====
    // ============================================

    function loadCart() {
        try {
            const saved = localStorage.getItem('tehranbattery_cart');
            cart = saved ? JSON.parse(saved) : [];
        } catch {
            cart = [];
        }
        renderCartSummary();
        updateTotal();
    }

    function renderCartSummary() {
        if (!cartSummary) return;

        if (cart.length === 0) {
            cartSummary.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #8E9AAA;">
                    <i class="fas fa-shopping-cart" style="font-size: 32px; display: block; margin-bottom: 8px;"></i>
                    سبد خرید شما خالی است
                </div>
            `;
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-meta">${item.quantity} عدد × ${formatPrice(item.price)}</span>
                    </div>
                    <span class="cart-item-price">${formatPrice(itemTotal)}</span>
                </div>
            `;
        });

        html += `
            <div class="cart-total">
                <span class="label">مجموع</span>
                <span class="amount">${formatPrice(total)}</span>
            </div>
        `;

        cartSummary.innerHTML = html;
    }

    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const amountEl = document.getElementById('finalAmount');
        if (amountEl) amountEl.textContent = formatPrice(total);
        return total;
    }

    // ============================================
    // ===== مرحله ۱: اطلاعات =====
    // ============================================

    infoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();

        // اعتبارسنجی
        if (!name || name.length < 2) {
            alert('❌ لطفاً نام و نام خانوادگی را وارد کنید.');
            return;
        }

        if (!phone || phone.length < 10) {
            alert('❌ لطفاً شماره موبایل معتبر وارد کنید.');
            return;
        }

        if (!address || address.length < 5) {
            alert('❌ لطفاً آدرس کامل را وارد کنید.');
            return;
        }

        const total = updateTotal();

        if (cart.length === 0) {
            alert('❌ سبد خرید شما خالی است.');
            return;
        }

        // ساخت داده‌های سفارش
        const orderData = {
            name: name,
            phone: phone,
            email: email,
            address: address,
            notes: notes,
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: total
        };

        try {
            // ایجاد سفارش
            currentOrder = await window.App.orderManager.createOrder(orderData);
            
            // ذخیره اطلاعات در localStorage برای نمایش بعدی
            localStorage.setItem('tehranbattery_last_order', JSON.stringify(currentOrder));

            // نمایش شماره موبایل در مرحله تایید
            confirmPhone.textContent = phone;

            // تولید کد تایید (شبیه‌سازی)
            verificationCode = Math.floor(10000 + Math.random() * 90000);
            console.log(`📱 کد تایید برای ${phone}: ${verificationCode}`);

            showMessage(verificationMessage, 
                `✅ کد تایید به شماره <strong>${phone}</strong> ارسال شد. کد: <strong>${verificationCode}</strong>`,
                'success'
            );

            // رفتن به مرحله ۲
            goToStep(2);
            verificationInput.value = '';
            verificationInput.focus();

        } catch (error) {
            console.error('❌ خطا در ایجاد سفارش:', error);
            alert('❌ خطا در ایجاد سفارش: ' + error.message);
        }
    });

    // ============================================
    // ===== مرحله ۲: تایید کد =====
    // ============================================

    // ارسال مجدد کد
    resendBtn.addEventListener('click', function() {
        if (!currentOrder) {
            alert('❌ سفارشی یافت نشد. لطفاً دوباره اقدام کنید.');
            return;
        }

        const phone = currentOrder.customer.phone;
        verificationCode = Math.floor(10000 + Math.random() * 90000);
        console.log(`📱 کد تایید جدید برای ${phone}: ${verificationCode}`);

        showMessage(verificationMessage,
            `✅ کد تایید جدید به شماره <strong>${phone}</strong> ارسال شد. کد: <strong>${verificationCode}</strong>`,
            'success'
        );

        verificationInput.value = '';
        verificationInput.focus();
    });

    // تایید کد
    verifyBtn.addEventListener('click', function() {
        const code = verificationInput.value.trim();

        if (!code) {
            showMessage(verificationMessage, '⚠️ لطفاً کد تایید را وارد کنید.', 'error');
            return;
        }

        if (parseInt(code) === verificationCode) {
            showMessage(verificationMessage, '✅ کد تایید صحیح است!', 'success');

            // رفتن به مرحله پرداخت
            setTimeout(() => {
                const total = updateTotal();
                finalAmount.textContent = formatPrice(total);
                goToStep(3);
            }, 500);

        } else {
            showMessage(verificationMessage, '❌ کد تایید اشتباه است. لطفاً مجدداً تلاش کنید.', 'error');
            verificationInput.value = '';
            verificationInput.focus();
        }
    });

    // Enter در فیلد کد
    verificationInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            verifyBtn.click();
        }
    });

    // ============================================
    // ===== مرحله ۳: پرداخت =====
    // ============================================

    payBtn.addEventListener('click', function() {
        if (!currentOrder) {
            alert('❌ سفارشی یافت نشد.');
            return;
        }

        // نمایش مودال پرداخت
        const total = updateTotal();
        modalAmount.textContent = formatPrice(total);
        modalIcon.textContent = '💳';
        modalTitle.textContent = 'اتصال به درگاه پرداخت';
        modalMessage.textContent = 'در حال اتصال به زرین‌پال...';
        document.getElementById('modalActions').style.display = 'flex';
        paymentModal.classList.add('active');
    });

    // ============================================
    // ===== شبیه‌سازی پرداخت =====
    // ============================================

    window.simulatePayment = async function(status) {
        // غیرفعال کردن دکمه‌ها
        const buttons = document.querySelectorAll('#modalActions button');
        buttons.forEach(btn => btn.disabled = true);
        modalMessage.textContent = '⏳ در حال پردازش...';

        try {
            // شروع پرداخت
            const paymentResult = await window.App.orderManager.initiatePayment(currentOrder.id);
            paymentTransactionId = paymentResult.transactionId;

            // تعیین کد بر اساس وضعیت
            let code = '';
            if (status === 'success') code = '12345';
            else if (status === 'failed') code = '99999';
            else if (status === 'pending') code = '33333';

            // تایید پرداخت
            const verifyResult = await window.App.orderManager.verifyPayment({
                transactionId: paymentTransactionId,
                authority: paymentTransactionId,
                status: 'OK',
                code: code
            });

            // بستن مودال
            paymentModal.classList.remove('active');

            // نمایش نتیجه
            if (verifyResult.success) {
                showResult('success', {
                    title: '🎉 پرداخت با موفقیت انجام شد!',
                    message: `سفارش شما با شماره پیگیری <strong>${currentOrder.trackingCode}</strong> ثبت شد.`,
                    detail: `کد سفارش: ${currentOrder.orderCode}`
                });

                // پاک کردن سبد خرید
                localStorage.removeItem('tehranbattery_cart');
                cart = [];
                renderCartSummary();

            } else if (status === 'pending') {
                showResult('pending', {
                    title: '⏳ در انتظار تایید',
                    message: 'پرداخت شما در حال بررسی است. به زودی نتیجه به شما اطلاع داده می‌شود.',
                    detail: `کد پیگیری: ${currentOrder.trackingCode}`
                });
            } else {
                showResult('failed', {
                    title: '❌ پرداخت ناموفق بود',
                    message: 'متأسفانه پرداخت شما با مشکل مواجه شد. لطفاً مجدداً تلاش کنید.',
                    detail: `کد سفارش: ${currentOrder.orderCode}`
                });
            }

        } catch (error) {
            console.error('❌ خطا در پرداخت:', error);
            paymentModal.classList.remove('active');
            alert('❌ خطا در پرداخت: ' + error.message);
        }

        // فعال کردن دکمه‌ها
        buttons.forEach(btn => btn.disabled = false);
    };

    // ============================================
    // ===== نمایش نتیجه =====
    // ============================================

    function showResult(status, data) {
        const icons = {
            'success': '✅',
            'failed': '❌',
            'pending': '⏳'
        };

        const colors = {
            'success': '#2ED573',
            'failed': '#FF4D4D',
            'pending': '#FFD166'
        };

        resultBox.innerHTML = `
            <div class="result-icon" style="color: ${colors[status]}">${icons[status]}</div>
            <div class="result-title">${data.title}</div>
            <div class="result-detail">${data.message}</div>
            ${data.detail ? `<div class="result-code">${data.detail}</div>` : ''}
            <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="/" class="btn-secondary">
                    <i class="fas fa-home"></i> بازگشت به خانه
                </a>
                <a href="/track-order.html" class="btn-secondary">
                    <i class="fas fa-search"></i> پیگیری سفارش
                </a>
            </div>
        `;

        goToStep(4);
    }

    // ============================================
    // ===== بستن مودال با کلیک بیرون =====
    // ============================================

    paymentModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // ============================================
    // ===== راه‌اندازی =====
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        loadCart();
        goToStep(1);

        console.log('🛒 صفحه تسویه حساب راه‌اندازی شد');
        console.log(`📦 ${cart.length} آیتم در سبد خرید`);
    });

})();