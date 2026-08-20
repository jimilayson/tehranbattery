// ============================================
// ===== رابط پرداخت (Payment Gateway Interface) =====
// ============================================

/**
 * این کلاس به عنوان یک قرارداد (Contract) عمل می‌کند.
 * همه ارائه‌دهندگان پرداخت باید این اینترفیس را پیاده‌سازی کنند.
 */
class PaymentGatewayInterface {
    
    /**
     * شروع فرآیند پرداخت
     * @param {Object} order - اطلاعات سفارش
     * @param {number} order.total - مبلغ کل
     * @param {string} order.orderCode - کد سفارش
     * @param {Object} order.customer - اطلاعات مشتری
     * @param {number} order.id - شناسه سفارش
     * @returns {Promise<Object>} - نتیجه پرداخت
     */
    async initiatePayment(order) {
        throw new Error('Method initiatePayment() must be implemented');
    }
    
    /**
     * تایید پرداخت (بعد از بازگشت از درگاه)
     * @param {Object} params - پارامترهای بازگشتی از درگاه
     * @param {string} params.transactionId - شناسه تراکنش
     * @param {string} params.authority - کد مرجع (در زرین‌پال)
     * @param {string} params.status - وضعیت بازگشتی
     * @param {string} params.code - کد وضعیت
     * @returns {Promise<Object>} - نتیجه تایید
     */
    async verifyPayment(params) {
        throw new Error('Method verifyPayment() must be implemented');
    }
    
    /**
     * بررسی وضعیت پرداخت
     * @param {string} transactionId - کد تراکنش
     * @returns {Promise<Object>} - وضعیت پرداخت
     */
    async getPaymentStatus(transactionId) {
        throw new Error('Method getPaymentStatus() must be implemented');
    }
    
    /**
     * لغو پرداخت
     * @param {string} transactionId - کد تراکنش
     * @returns {Promise<Object>} - نتیجه لغو
     */
    async cancelPayment(transactionId) {
        throw new Error('Method cancelPayment() must be implemented');
    }
    
    /**
     * دریافت اطلاعات تراکنش
     * @param {string} transactionId - کد تراکنش
     * @returns {Promise<Object>} - اطلاعات تراکنش
     */
    async getTransactionInfo(transactionId) {
        throw new Error('Method getTransactionInfo() must be implemented');
    }
    
    /**
     * بررسی صحت تنظیمات درگاه
     * @returns {Promise<Object>} - نتیجه بررسی
     */
    async healthCheck() {
        throw new Error('Method healthCheck() must be implemented');
    }
}

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { PaymentGatewayInterface };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.PaymentGatewayInterface = PaymentGatewayInterface;
}