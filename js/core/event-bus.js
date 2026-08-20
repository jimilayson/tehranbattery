// ============================================
// ===== سیستم رویدادها (Event Bus) =====
// ============================================

class EventBus {
    constructor() {
        this.events = {};
        this.debug = isDebugMode();
        this.history = [];
        this.maxHistory = 100;
    }
    
    /**
     * ثبت شنونده برای رویداد
     */
    on(eventName, callback, once = false) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        const listener = { callback, once };
        this.events[eventName].push(listener);
        
        if (this.debug) {
            console.log(`📡 [EventBus] شنونده ثبت شد برای: ${eventName}`);
        }
        
        return () => this.off(eventName, callback);
    }
    
    /**
     * ثبت شنونده برای یک بار اجرا
     */
    once(eventName, callback) {
        return this.on(eventName, callback, true);
    }
    
    /**
     * حذف شنونده
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(
            listener => listener.callback !== callback
        );
    }
    
    /**
     * انتشار رویداد
     */
    emit(eventName, data) {
        if (this.debug) {
            console.log(`📡 [EventBus] انتشار رویداد: ${eventName}`, data);
        }
        
        // ثبت در تاریخچه
        this.history.push({ eventName, data, timestamp: Date.now() });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        if (!this.events[eventName]) return;
        
        // کپی از لیست شنوندگان برای جلوگیری از تغییر در حین اجرا
        const listeners = [...this.events[eventName]];
        
        listeners.forEach(listener => {
            try {
                listener.callback(data);
            } catch (error) {
                console.error(`❌ [EventBus] خطا در پردازش ${eventName}:`, error);
            }
        });
        
        // حذف شنوندگان یک بار مصرف
        this.events[eventName] = this.events[eventName].filter(
            listener => !listener.once
        );
    }
    
    /**
     * انتشار رویداد با تاخیر
     */
    emitDelayed(eventName, data, delay = 1000) {
        setTimeout(() => {
            this.emit(eventName, data);
        }, delay);
    }
    
    /**
     * انتشار رویداد و دریافت نتیجه
     */
    async emitAsync(eventName, data) {
        if (!this.events[eventName]) return [];
        
        const results = [];
        const listeners = [...this.events[eventName]];
        
        for (const listener of listeners) {
            try {
                const result = await listener.callback(data);
                results.push(result);
            } catch (error) {
                console.error(`❌ [EventBus] خطا در پردازش ${eventName}:`, error);
                results.push(null);
            }
        }
        
        return results;
    }
    
    /**
     * دریافت تاریخچه رویدادها
     */
    getHistory() {
        return this.history;
    }
    
    /**
     * پاک کردن تاریخچه
     */
    clearHistory() {
        this.history = [];
    }
    
    /**
     * دریافت لیست رویدادهای ثبت شده
     */
    getRegisteredEvents() {
        return Object.keys(this.events);
    }
}

// ============================================
// ===== رویدادهای استاندارد سیستم =====
// ============================================

const SystemEvents = {
    // ===== سفارشات =====
    ORDER_CREATED: 'order.created',
    ORDER_STATUS_CHANGED: 'order.statusChanged',
    ORDER_UPDATED: 'order.updated',
    ORDER_CANCELLED: 'order.cancelled',
    
    // ===== پرداخت =====
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_VERIFIED: 'payment.verified',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_CANCELLED: 'payment.cancelled',
    PAYMENT_PENDING: 'payment.pending',
    
    // ===== محصولات =====
    PRODUCT_STOCK_UPDATED: 'product.stockUpdated',
    PRODUCT_ADDED: 'product.added',
    PRODUCT_UPDATED: 'product.updated',
    PRODUCT_DELETED: 'product.deleted',
    PRODUCT_SOLD: 'product.sold',
    
    // ===== مشتریان =====
    CUSTOMER_REGISTERED: 'customer.registered',
    CUSTOMER_UPDATED: 'customer.updated',
    CUSTOMER_ORDERED: 'customer.ordered',
    
    // ===== سبد خرید =====
    CART_UPDATED: 'cart.updated',
    CART_CLEARED: 'cart.cleared',
    CART_ITEM_ADDED: 'cart.itemAdded',
    CART_ITEM_REMOVED: 'cart.itemRemoved',
    
    // ===== نوتیفیکیشن =====
    NOTIFICATION_SENT: 'notification.sent',
    NOTIFICATION_SMS_SENT: 'notification.smsSent',
    NOTIFICATION_EMAIL_SENT: 'notification.emailSent',
    
    // ===== سیستم =====
    SYSTEM_READY: 'system.ready',
    SYSTEM_ERROR: 'system.error',
    SYSTEM_WARNING: 'system.warning'
};

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { EventBus, SystemEvents };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.EventBus = EventBus;
    window.SystemEvents = SystemEvents;
}