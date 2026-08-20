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
            return cart;
        },

        // ===== حذف از سبد خرید =====
        removeItem: function(productId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== productId);
            this.saveCart(cart);
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
                badge.style.display = count > 0 ? 'inline' : 'none';
            });
        },

        // ===== نمایش نوتیفیکیشن =====
        showNotification: function(message) {
            const existing = document.querySelector('.cart-notification');
            if (existing) existing.remove();

            const notif = document.createElement('div');
            notif.className = 'cart-notification';
            notif.textContent = message;
            notif.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #182333;
                color: #F5F7FA;
                padding: 12px 20px;
                border-radius: 12px;
                border: 1px solid #7A8A9E;
                box-shadow: 0 8px 30px rgba(0,0,0,0.5);
                z-index: 9999;
                font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
                animation: slideUp 0.3s ease;
                max-width: 90%;
            `;
            document.body.appendChild(notif);

            setTimeout(() => {
                notif.style.opacity = '0';
                notif.style.transition = 'opacity 0.3s';
                setTimeout(() => notif.remove(), 300);
            }, 2500);
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