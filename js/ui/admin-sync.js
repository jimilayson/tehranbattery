// ============================================
// ===== همگام‌سازی با پنل ادمین =====
// ============================================

(function() {
    'use strict';

    // ===== تابع به‌روزرسانی پنل ادمین =====
    window.updateAdminDashboard = function() {
        // این تابع توسط پنل ادمین برای به‌روزرسانی داده‌ها استفاده می‌شود
        if (window.AdminDashboard) {
            window.AdminDashboard.refreshData();
        }
    };

    // ===== گوش دادن به رویدادهای سیستم =====
    if (window.App && window.App.eventBus) {
        const eventBus = window.App.eventBus;

        // رویداد سفارش جدید
        eventBus.on(SystemEvents.ORDER_CREATED, function(data) {
            console.log('🆕 سفارش جدید در پنل ادمین:', data);
            if (window.updateAdminDashboard) {
                setTimeout(window.updateAdminDashboard, 500);
            }
        });

        // رویداد پرداخت تایید شده
        eventBus.on(SystemEvents.PAYMENT_VERIFIED, function(data) {
            console.log('✅ پرداخت تایید شد در پنل ادمین:', data);
            if (window.updateAdminDashboard) {
                setTimeout(window.updateAdminDashboard, 500);
            }
        });

        // رویداد تغییر وضعیت سفارش
        eventBus.on(SystemEvents.ORDER_STATUS_CHANGED, function(data) {
            console.log('🔄 وضعیت سفارش تغییر کرد در پنل ادمین:', data);
            if (window.updateAdminDashboard) {
                setTimeout(window.updateAdminDashboard, 500);
            }
        });

        console.log('🔄 همگام‌سازی با پنل ادمین فعال شد');
    }

})();