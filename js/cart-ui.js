// ============================================
// ===== مدیریت سبد خرید (Cart UI) =====
// ============================================

(function() {
    'use strict';

    // ===== کلید ذخیره‌سازی =====
    const CART_KEY = 'tehranbattery_cart';

    // ===== توابع اصلی =====
    window.CartManager = {
        // ===== دریافت سبد خرید =====
        getCart: function() {
            try {
                const data = localStorage.getItem(CART_KEY);
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        },

        // ===== ذخیره سبد خرید =====
        saveCart: function(cart) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            this.updateBadge();
            this.dispatchCartEvent('cart.updated', cart);
        },

        // ===== افزودن به سبد خرید =====
        addItem: function(productId, name, price, quantity = 1) {
            const cart = this.getCart();
            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: name,
                    price: price,
                    quantity: quantity
                });
            }

            this.saveCart(cart);
            this.showNotification(`✅ ${name} به سبد خرید اضافه شد`);
            this.animateButton(productId);
            return cart;
        },

        // ===== حذف از سبد خرید =====
        removeItem: function(productId) {
            let cart = this.getCart();
            const removed = cart.find(item => item.id === productId);
            cart = cart.filter(item => item.id !== productId);
            this.saveCart(cart);
            if (removed) {
                this.showNotification(`🗑️ ${removed.name} از سبد خرید حذف شد`);
            }
            return cart;
        },

        // ===== تغییر تعداد =====
        updateQuantity: function(productId, quantity) {
            const cart = this.getCart();
            const item = cart.find(i => i.id === productId);
            if (item) {
                if (quantity <= 0) {
                    return this.removeItem(productId);
                }
                item.quantity = quantity;
                this.saveCart(cart);
            }
            return cart;
        },

        // ===== خالی کردن سبد =====
        clearCart: function() {
            this.saveCart([]);
            this.showNotification('🗑️ سبد خرید خالی شد');
        },

        // ===== دریافت تعداد کل =====
        getTotalItems: function() {
            const cart = this.getCart();
            return cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        // ===== دریافت مبلغ کل =====
        getTotalPrice: function() {
            const cart = this.getCart();
            return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        // ===== به‌روزرسانی نشانگر =====
        updateBadge: function() {
            const badges = document.querySelectorAll('.cart-badge');
            const count = this.getTotalItems();
            badges.forEach(badge => {
                badge.textContent = count;
                if (count > 0) {
                    badge.style.display = 'flex';
                    badge.classList.add('show');
                } else {
                    badge.style.display = 'none';
                    badge.classList.remove('show');
                }
            });
        },

        // ===== انیمیشن دکمه =====
        animateButton: function(productId) {
            const buttons = document.querySelectorAll(`.btn-order[onclick*="addToCart(${productId},"]`);
            buttons.forEach(btn => {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> افزوده شد';
                btn.style.background = '#2ED573';
                btn.style.color = '#fff';
                btn.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.transform = '';
                }, 1500);
            });
        },

        // ===== نمایش نوتیفیکیشن =====
        showNotification: function(message) {
            // حذف نوتیفیکیشن قبلی
            const existing = document.querySelector('.cart-notification');
            if (existing) existing.remove();

            // ایجاد نوتیفیکیشن جدید
            const notif = document.createElement('div');
            notif.className = 'cart-notification';
            notif.innerHTML = message;
            
            // استایل‌های نوتیفیکیشن
            Object.assign(notif.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#182333',
                color: '#F5F7FA',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '1px solid #2ED573',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                zIndex: '9999',
                fontFamily: "'Vazirmatn', Tahoma, Arial, sans-serif",
                animation: 'slideUp 0.3s ease',
                maxWidth: '90%',
                direction: 'rtl',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            });

            document.body.appendChild(notif);

            // حذف خودکار بعد از ۳ ثانیه
            setTimeout(() => {
                notif.style.opacity = '0';
                notif.style.transform = 'translateY(20px)';
                notif.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        },

        // ===== انتشار رویداد =====
        dispatchCartEvent: function(eventName, data) {
            const event = new CustomEvent(eventName, { detail: data });
            document.dispatchEvent(event);
        }
    };

    // ============================================
    // ===== افزودن دکمه‌های افزودن به سبد خرید =====
    // ============================================

    window.addToCart = function(productId, name, price, quantity = 1) {
        return window.CartManager.addItem(productId, name, price, quantity);
    };

    // ============================================
    // ===== نمایش تعداد سبد خرید در صفحات =====
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        window.CartManager.updateBadge();

        // گوش دادن به تغییرات سبد خرید از صفحات دیگر
        document.addEventListener('cart.updated', function() {
            window.CartManager.updateBadge();
        });
    });

    console.log('🛒 سیستم سبد خرید راه‌اندازی شد');

})();
