// ============================================
// ===== ارائه‌دهنده شبیه‌سازی پرداخت =====
// ============================================

class MockPaymentProvider extends PaymentGatewayInterface {
    
    constructor(config = {}) {
        super();
        this.transactions = new Map();
        this.config = {
            successRate: config.successRate || 0.7, // 70% موفق
            failRate: config.failRate || 0.15,     // 15% ناموفق
            pendingRate: config.pendingRate || 0.15, // 15% در انتظار
            delay: config.delay || 1500,           // تاخیر شبیه‌سازی
            ...config
        };
        this.debug = isDebugMode();
    }
    
    /**
     * شروع فرآیند پرداخت شبیه‌سازی
     */
    async initiatePayment(order) {
        if (this.debug) {
            console.log('🔬 [Mock] شروع فرآیند پرداخت شبیه‌سازی:', order);
        }
        
        // شبیه‌سازی تاخیر شبکه
        await this.simulateDelay();
        
        // تولید تراکنش شبیه‌سازی
        const transactionId = 'MOCK-TRN-' + Date.now().toString().slice(-6) + 
                             '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // ذخیره تراکنش
        this.transactions.set(transactionId, {
            orderId: order.id,
            orderCode: order.orderCode,
            amount: order.total,
            customer: order.customer,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        // برگرداندن اطلاعات برای نمایش به کاربر
        return {
            success: true,
            transactionId: transactionId,
            authority: transactionId, // برای سازگاری با زرین‌پال
            paymentUrl: '#', // در حالت واقعی، به درگاه هدایت می‌کند
            message: '🔬 در حالت شبیه‌سازی، پرداخت با موفقیت آغاز شد',
            isMock: true,
            mockData: {
                successCodes: ['12345', '67890', '11111'],
                failCodes: ['00000', '99999', '22222'],
                pendingCodes: ['33333', '44444']
            }
        };
    }
    
    /**
     * تایید پرداخت شبیه‌سازی
     */
    async verifyPayment(params) {
        const { transactionId, authority, status, code } = params;
        
        if (this.debug) {
            console.log('🔬 [Mock] تایید پرداخت شبیه‌سازی:', { transactionId, authority, status, code });
        }
        
        // شبیه‌سازی تاخیر شبکه
        await this.simulateDelay();
        
        // شبیه‌سازی نتیجه
        const mockStatus = this.simulatePaymentResult(code);
        
        // به‌روزرسانی تراکنش
        if (this.transactions.has(transactionId)) {
            const transaction = this.transactions.get(transactionId);
            transaction.status = mockStatus;
            transaction.verifiedAt = new Date().toISOString();
            transaction.updatedAt = new Date().toISOString();
            this.transactions.set(transactionId, transaction);
        }
        
        const result = {
            success: mockStatus === 'success',
            status: mockStatus,
            message: this.getStatusMessage(mockStatus),
            transactionId: transactionId,
            refId: mockStatus === 'success' ? 'MOCK-REF-' + Date.now().toString().slice(-8) : null,
            isMock: true
        };
        
        if (this.debug) {
            console.log('🔬 [Mock] نتیجه پرداخت:', result);
        }
        
        return result;
    }
    
    /**
     * شبیه‌سازی نتیجه پرداخت
     */
    simulatePaymentResult(code = null) {
        // اگر کد خاصی ارسال شده باشد
        if (code) {
            const successCodes = ['12345', '67890', '11111'];
            const failCodes = ['00000', '99999', '22222'];
            const pendingCodes = ['33333', '44444'];
            
            if (successCodes.includes(code)) return 'success';
            if (failCodes.includes(code)) return 'failed';
            if (pendingCodes.includes(code)) return 'pending';
        }
        
        // شبیه‌سازی تصادفی
        const rand = Math.random();
        if (rand < this.config.successRate) return 'success';
        if (rand < this.config.successRate + this.config.failRate) return 'failed';
        return 'pending';
    }
    
    /**
     * دریافت پیام وضعیت
     */
    getStatusMessage(status) {
        const messages = {
            'success': '✅ پرداخت با موفقیت انجام شد',
            'failed': '❌ پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید',
            'pending': '⏳ پرداخت در حال بررسی است'
        };
        return messages[status] || 'وضعیت نامشخص';
    }
    
    /**
     * دریافت وضعیت پرداخت
     */
    async getPaymentStatus(transactionId) {
        await this.simulateDelay();
        
        if (this.transactions.has(transactionId)) {
            const transaction = this.transactions.get(transactionId);
            return {
                status: transaction.status,
                transactionId: transactionId,
                orderId: transaction.orderId,
                amount: transaction.amount,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
            };
        }
        
        return {
            status: 'not_found',
            transactionId: transactionId,
            message: 'تراکنش یافت نشد'
        };
    }
    
    /**
     * لغو پرداخت
     */
    async cancelPayment(transactionId) {
        await this.simulateDelay();
        
        if (this.transactions.has(transactionId)) {
            const transaction = this.transactions.get(transactionId);
            transaction.status = 'cancelled';
            transaction.updatedAt = new Date().toISOString();
            this.transactions.set(transactionId, transaction);
            
            return {
                success: true,
                message: 'پرداخت با موفقیت لغو شد',
                transactionId: transactionId
            };
        }
        
        return {
            success: false,
            message: 'تراکنش یافت نشد',
            transactionId: transactionId
        };
    }
    
    /**
     * دریافت اطلاعات تراکنش
     */
    async getTransactionInfo(transactionId) {
        await this.simulateDelay();
        
        if (this.transactions.has(transactionId)) {
            const transaction = this.transactions.get(transactionId);
            return {
                ...transaction,
                transactionId: transactionId
            };
        }
        
        return null;
    }
    
    /**
     * بررسی صحت تنظیمات
     */
    async healthCheck() {
        return {
            success: true,
            provider: 'mock',
            message: 'درگاه شبیه‌سازی با موفقیت فعال است',
            config: {
                successRate: this.config.successRate,
                failRate: this.config.failRate,
                pendingRate: this.config.pendingRate
            }
        };
    }
    
    /**
     * شبیه‌سازی تاخیر شبکه
     */
    async simulateDelay() {
        const delay = this.config.delay + (Math.random() * 500);
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { MockPaymentProvider };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.MockPaymentProvider = MockPaymentProvider;
}