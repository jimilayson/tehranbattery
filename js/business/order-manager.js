// ============================================
// ===== مدیریت سفارشات =====
// ============================================

class OrderManager {
    
    constructor(database, paymentProvider, eventBus) {
        this.database = database;
        this.paymentProvider = paymentProvider;
        this.eventBus = eventBus;
        this.debug = isDebugMode();
    }
    
    /**
     * ایجاد سفارش جدید
     */
    async createOrder(orderData) {
        try {
            if (this.debug) {
                console.log('📦 ایجاد سفارش جدید:', orderData);
            }
            
            // ۱. اعتبارسنجی داده‌ها
            this.validateOrderData(orderData);
            
            // ۲. تولید کد سفارش
            const orderCode = this.generateOrderCode();
            const trackingCode = this.generateTrackingCode();
            
            // ۳. ساخت سفارش
            const order = {
                id: Date.now(),
                orderCode: orderCode,
                trackingCode: trackingCode,
                customer: {
                    name: orderData.name.trim(),
                    phone: orderData.phone.trim(),
                    email: (orderData.email || '').trim()
                },
                items: orderData.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: orderData.total,
                status: 'pending',
                paymentStatus: 'pending',
                shippingAddress: (orderData.address || '').trim(),
                notes: (orderData.notes || '').trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                paymentTransactionId: null,
                refId: null
            };
            
            // ۴. ذخیره در دیتابیس
            const savedOrder = await this.database.saveOrder(order);
            
            // ۵. به‌روزرسانی موجودی محصولات (رزرو)
            await this.reserveStock(order.items);
            
            // ۶. ثبت/به‌روزرسانی مشتری
            await this.updateCustomer(order);
            
            // ۷. انتشار رویداد
            this.eventBus.emit(SystemEvents.ORDER_CREATED, savedOrder);
            
            if (this.debug) {
                console.log('✅ سفارش با موفقیت ایجاد شد:', savedOrder);
            }
            
            return savedOrder;
            
        } catch (error) {
            this.eventBus.emit(SystemEvents.SYSTEM_ERROR, {
                source: 'OrderManager.createOrder',
                error: error.message,
                data: orderData
            });
            throw error;
        }
    }
    
    /**
     * شروع فرآیند پرداخت برای سفارش
     */
    async initiatePayment(orderId) {
        try {
            if (this.debug) {
                console.log('💳 شروع پرداخت برای سفارش:', orderId);
            }
            
            // ۱. دریافت سفارش
            const order = await this.database.getOrder(orderId);
            if (!order) {
                throw new Error('سفارش یافت نشد');
            }
            
            // ۲. بررسی وضعیت سفارش
            if (order.paymentStatus === 'paid') {
                throw new Error('سفارش قبلاً پرداخت شده است');
            }
            
            // ۳. شروع پرداخت
            const paymentResult = await this.paymentProvider.initiatePayment({
                id: order.id,
                orderCode: order.orderCode,
                total: order.total,
                customer: order.customer
            });
            
            // ۴. به‌روزرسانی سفارش با اطلاعات پرداخت
            if (paymentResult.success) {
                await this.database.updateOrder(orderId, {
                    paymentTransactionId: paymentResult.transactionId,
                    paymentStatus: 'pending',
                    updatedAt: new Date().toISOString()
                });
                
                // انتشار رویداد
                this.eventBus.emit(SystemEvents.PAYMENT_INITIATED, {
                    orderId: orderId,
                    transactionId: paymentResult.transactionId,
                    orderCode: order.orderCode
                });
            }
            
            return paymentResult;
            
        } catch (error) {
            this.eventBus.emit(SystemEvents.SYSTEM_ERROR, {
                source: 'OrderManager.initiatePayment',
                error: error.message,
                orderId: orderId
            });
            throw error;
        }
    }
    
    /**
     * تایید پرداخت (بعد از بازگشت از درگاه)
     */
    async verifyPayment(params) {
        try {
            if (this.debug) {
                console.log('✅ تایید پرداخت:', params);
            }
            
            // ۱. تایید پرداخت از درگاه
            const verificationResult = await this.paymentProvider.verifyPayment(params);
            
            // ۲. پیدا کردن سفارش با transactionId
            const order = await this.database.getOrderByTransactionId(params.transactionId);
            if (!order) {
                throw new Error('سفارش مرتبط با این تراکنش یافت نشد');
            }
            
            // ۳. به‌روزرسانی وضعیت سفارش
            if (verificationResult.success) {
                await this.database.updateOrder(order.id, {
                    paymentStatus: 'paid',
                    status: 'paid',
                    refId: verificationResult.refId || '',
                    updatedAt: new Date().toISOString()
                });
                
                // ۴. تایید قطعی موجودی (از رزرو به فروش)
                await this.confirmStock(order.items);
                
                // ۵. ثبت در آمار فروش
                await this.updateSalesStats(order);
                
                // ۶. انتشار رویداد
                this.eventBus.emit(SystemEvents.PAYMENT_VERIFIED, {
                    orderId: order.id,
                    refId: verificationResult.refId,
                    transactionId: params.transactionId
                });
                
                // ۷. ارسال نوتیفیکیشن به مشتری (در آینده)
                // await this.sendOrderConfirmation(order);
                
            } else {
                // پرداخت ناموفق - آزادسازی موجودی
                await this.releaseStock(order.items);
                
                await this.database.updateOrder(order.id, {
                    paymentStatus: 'failed',
                    status: 'cancelled',
                    updatedAt: new Date().toISOString()
                });
                
                this.eventBus.emit(SystemEvents.PAYMENT_FAILED, {
                    orderId: order.id,
                    transactionId: params.transactionId,
                    message: verificationResult.message
                });
            }
            
            return verificationResult;
            
        } catch (error) {
            this.eventBus.emit(SystemEvents.SYSTEM_ERROR, {
                source: 'OrderManager.verifyPayment',
                error: error.message,
                params: params
            });
            throw error;
        }
    }
    
    /**
     * رزرو موجودی (قبل از پرداخت)
     */
    async reserveStock(items) {
        for (const item of items) {
            const product = await this.database.getProduct(item.productId);
            if (!product) {
                throw new Error(`محصول با ID ${item.productId} یافت نشد`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`موجودی کافی برای محصول ${product.name} وجود ندارد`);
            }
            // در حالت واقعی، می‌توانیم یک فیلد reservedStock اضافه کنیم
            // فعلاً فقط بررسی می‌کنیم
        }
    }
    
    /**
     * تایید قطعی موجودی (پس از پرداخت موفق)
     */
    async confirmStock(items) {
        for (const item of items) {
            await this.database.updateProductStock(item.productId, -item.quantity);
            await this.database.incrementProductSales(item.productId, {
                quantity: item.quantity,
                revenue: item.price * item.quantity
            });
            
            this.eventBus.emit(SystemEvents.PRODUCT_SOLD, {
                productId: item.productId,
                quantity: item.quantity,
                revenue: item.price * item.quantity
            });
        }
    }
    
    /**
     * آزادسازی موجودی (در صورت لغو یا失败)
     */
    async releaseStock(items) {
        for (const item of items) {
            await this.database.updateProductStock(item.productId, item.quantity);
        }
    }
    
    /**
     * ثبت/به‌روزرسانی مشتری
     */
    async updateCustomer(order) {
        const customer = await this.database.getCustomerByPhone(order.customer.phone);
        
        if (customer) {
            // به‌روزرسانی مشتری موجود
            await this.database.updateCustomer(customer.id, {
                orders: customer.orders + 1,
                totalSpent: customer.totalSpent + order.total,
                lastOrder: new Date().toLocaleDateString('fa-IR'),
                status: 'active'
            });
            this.eventBus.emit(SystemEvents.CUSTOMER_ORDERED, {
                customerId: customer.id,
                orderId: order.id
            });
        } else {
            // ثبت مشتری جدید
            const newCustomer = await this.database.addCustomer({
                name: order.customer.name,
                phone: order.customer.phone,
                orders: 1,
                totalSpent: order.total,
                lastOrder: new Date().toLocaleDateString('fa-IR')
            });
            this.eventBus.emit(SystemEvents.CUSTOMER_REGISTERED, newCustomer);
        }
    }
    
    /**
     * ثبت در آمار فروش
     */
    async updateSalesStats(order) {
        await this.database.updateSalesStats({
            totalRevenue: order.total,
            orderCount: 1,
            createdAt: order.createdAt
        });
    }
    
    /**
     * دریافت سفارشات با فیلتر
     */
    async getOrders(filters = {}) {
        return await this.database.getOrders(filters);
    }
    
    /**
     * دریافت سفارش با کد پیگیری
     */
    async getOrderByTrackingCode(trackingCode) {
        return await this.database.getOrderByTrackingCode(trackingCode);
    }
    
    /**
     * دریافت سفارشات مشتری
     */
    async getCustomerOrders(phone) {
        return await this.database.getCustomerOrders(phone);
    }
    
    /**
     * تغییر وضعیت سفارش
     */
    async updateOrderStatus(orderId, status) {
        const order = await this.database.updateOrder(orderId, {
            status: status,
            updatedAt: new Date().toISOString()
        });
        
        this.eventBus.emit(SystemEvents.ORDER_STATUS_CHANGED, {
            orderId: orderId,
            status: status,
            previousStatus: order.status
        });
        
        return order;
    }
    
    /**
     * لغو سفارش
     */
    async cancelOrder(orderId) {
        const order = await this.database.getOrder(orderId);
        if (!order) {
            throw new Error('سفارش یافت نشد');
        }
        
        if (order.paymentStatus === 'paid') {
            // در صورت پرداخت شده، نیاز به استرداد وجه
            // اینجا می‌توانیم منطق استرداد را پیاده‌سازی کنیم
        }
        
        // آزادسازی موجودی
        await this.releaseStock(order.items);
        
        // به‌روزرسانی وضعیت
        await this.database.updateOrder(orderId, {
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        });
        
        this.eventBus.emit(SystemEvents.ORDER_CANCELLED, {
            orderId: orderId,
            reason: 'canceled_by_admin'
        });
        
        return true;
    }
    
    /**
     * تولید کد سفارش یکتا
     */
    generateOrderCode() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = String(Math.floor(1000 + Math.random() * 9000));
        return `ORD-${year}${month}${day}-${random}`;
    }
    
    /**
     * تولید کد پیگیری یکتا
     */
    generateTrackingCode() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = String(Math.floor(100000 + Math.random() * 900000));
        return `TRK-${year}${month}${day}-${random}`;
    }
    
    /**
     * اعتبارسنجی داده‌های سفارش
     */
    validateOrderData(data) {
        if (!data.phone || data.phone.length < 10) {
            throw new Error('شماره موبایل معتبر نیست');
        }
        if (!data.items || data.items.length === 0) {
            throw new Error('سبد خرید خالی است');
        }
        if (!data.total || data.total <= 0) {
            throw new Error('مبلغ سفارش نامعتبر است');
        }
        if (!data.name || data.name.trim().length < 2) {
            throw new Error('نام و نام خانوادگی معتبر نیست');
        }
    }
}

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { OrderManager };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.OrderManager = OrderManager;
}