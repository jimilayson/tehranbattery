// ============================================
// ===== راه‌اندازی سیستم =====
// ============================================

(function() {
    'use strict';
    
    console.log('🚀 راه‌اندازی سیستم طهران باتری...');
    
    // ===== ۱. بارگذاری تنظیمات =====
    const config = window.AppConfig || {};
    console.log('📋 تنظیمات:', config);
    
    // ===== ۲. ایجاد سیستم رویدادها =====
    const eventBus = new EventBus();
    console.log('📡 سیستم رویدادها راه‌اندازی شد');
    
    // ===== ۳. انتخاب ارائه‌دهنده دیتابیس =====
    let database;
    switch (config.database?.provider || 'mock') {
        case 'mock':
            database = new MockDatabase();
            break;
        // case 'firebase':
        //     database = new FirebaseDatabase(config.database.firebase);
        //     break;
        // case 'mysql':
        //     database = new MySQLDatabase(config.database.mysql);
        //     break;
        default:
            database = new MockDatabase();
            console.warn('⚠️ ارائه‌دهنده دیتابیس نامشخص، استفاده از Mock');
    }
    console.log('💾 دیتابیس:', database.constructor.name);
    
    // ===== ۴. انتخاب ارائه‌دهنده پرداخت =====
    let paymentProvider;
    switch (config.payment?.provider || 'mock') {
        case 'mock':
            paymentProvider = new MockPaymentProvider();
            break;
        // case 'zarinpal':
        //     paymentProvider = new ZarinpalProvider(config.payment.zarinpal);
        //     break;
        default:
            paymentProvider = new MockPaymentProvider();
            console.warn('⚠️ ارائه‌دهنده پرداخت نامشخص، استفاده از Mock');
    }
    console.log('💳 ارائه‌دهنده پرداخت:', paymentProvider.constructor.name);
    
    // ===== ۵. ایجاد مدیران کسب‌وکار =====
    const orderManager = new OrderManager(database, paymentProvider, eventBus);
    console.log('📦 OrderManager راه‌اندازی شد');
    
    // ===== ۶. اتصال به پنل ادمین =====
    // این بخش توسط admin-sync.js مدیریت می‌شود
    
    // ===== ۷. ثبت در window =====
    window.App = {
        config: config,
        eventBus: eventBus,
        database: database,
        paymentProvider: paymentProvider,
        orderManager: orderManager,
        SystemEvents: SystemEvents,
        isMockMode: isMockMode,
        isDebugMode: isDebugMode
    };
    
    // ===== ۸. انتشار رویداد سیستم آماده =====
    eventBus.emit(SystemEvents.SYSTEM_READY, {
        timestamp: new Date().toISOString(),
        mode: config.mode || 'mock',
        database: database.constructor.name,
        payment: paymentProvider.constructor.name
    });
    
    console.log('✅ سیستم با موفقیت راه‌اندازی شد!');
    console.log(`📊 حالت: ${config.mode || 'mock'}`);
    console.log(`💾 دیتابیس: ${database.constructor.name}`);
    console.log(`💳 پرداخت: ${paymentProvider.constructor.name}`);
    
})();