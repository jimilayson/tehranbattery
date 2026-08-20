// ============================================
// ===== تنظیمات مرکزی برنامه =====
// ============================================

/**
 * تنظیمات اصلی برنامه
 * با تغییر این فایل، کل سیستم به حالت واقعی مهاجرت می‌کند
 */
const AppConfig = {
    // ===== حالت اجرا =====
    // 'mock' - شبیه‌سازی کامل (فعلی)
    // 'development' - توسعه با دیتابیس تست
    // 'production' - اجرای واقعی
    mode: 'mock',
    
    // ===== تنظیمات دیتابیس =====
    database: {
        provider: 'mock', // 'mock' | 'firebase' | 'mysql' | 'mongodb'
        // تنظیمات برای حالت واقعی (در آینده پر می‌شود)
        firebase: {
            apiKey: '',
            authDomain: '',
            projectId: '',
            storageBucket: '',
            messagingSenderId: '',
            appId: ''
        },
        mysql: {
            host: '',
            user: '',
            password: '',
            database: ''
        }
    },
    
    // ===== تنظیمات پرداخت =====
    payment: {
        provider: 'mock', // 'mock' | 'zarinpal' | 'paypal'
        zarinpal: {
            merchantId: 'YOUR_MERCHANT_ID',
            callbackUrl: 'https://tehranbattery.ir/payment-callback',
            sandbox: true // در حالت شبیه‌سازی، از سندباکس استفاده می‌شود
        },
        // تنظیمات برای درگاه‌های دیگر
        paypal: {
            clientId: '',
            secret: '',
            sandbox: true
        }
    },
    
    // ===== تنظیمات پیامک =====
    sms: {
        provider: 'mock', // 'mock' | 'kavenegar' | 'ghasedak'
        kavenegar: {
            apiKey: '',
            sender: ''
        },
        ghasedak: {
            apiKey: '',
            sender: ''
        }
    },
    
    // ===== تنظیمات فروشگاه =====
    store: {
        name: 'طهران باتری',
        phone: '02112345678',
        mobile: '09123456789',
        address: 'تهران، خیابان آزادی، خیابان تهران‌پارس، پلاک ۱۲',
        email: 'info@tehranbattery.ir',
        workingHours: 'شنبه تا چهارشنبه ۹-۲۰، پنجشنبه ۹-۱۴'
    },
    
    // ===== تنظیمات ظاهری =====
    ui: {
        theme: 'dark',
        currency: 'تومان',
        language: 'fa',
        dateFormat: 'YYYY/MM/DD'
    },
    
    // ===== تنظیمات پیشرفته =====
    advanced: {
        debug: true, // نمایش لاگ‌های دیباگ
        mockDelay: 1000, // تاخیر شبیه‌سازی در میلی‌ثانیه
        maxLoginAttempts: 5,
        sessionTimeout: 86400 // 24 ساعت
    }
};

// ============================================
// ===== توابع کمکی =====
// ============================================

const isMockMode = () => AppConfig.mode === 'mock';
const isProductionMode = () => AppConfig.mode === 'production';
const isDevelopmentMode = () => AppConfig.mode === 'development';
const isDebugMode = () => AppConfig.advanced.debug;

// صادر کردن برای استفاده در سایر فایل‌ها
if (typeof module !== 'undefined') {
    module.exports = { 
        AppConfig, 
        isMockMode, 
        isProductionMode, 
        isDevelopmentMode,
        isDebugMode 
    };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.AppConfig = AppConfig;
    window.isMockMode = isMockMode;
    window.isProductionMode = isProductionMode;
    window.isDebugMode = isDebugMode;
}