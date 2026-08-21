// ============================================
// ===== لایه امنیتی - Sanitize ورودی‌ها =====
// ============================================

/**
 * تابع اصلی پاکسازی ورودی‌ها
 * جلوگیری از حملات XSS و تزریق کد
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    let sanitized = input.trim();
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    sanitized = sanitized.replace(/[&<>"'`=/]/g, function(s) {
        return map[s];
    });
    
    const div = document.createElement('div');
    div.textContent = sanitized;
    sanitized = div.innerHTML;
    
    return sanitized;
}

function sanitizeNumber(input) {
    const num = parseInt(input);
    return isNaN(num) ? 0 : Math.abs(num);
}

function sanitizeEmail(input) {
    if (typeof input !== 'string') return '';
    const email = input.trim().toLowerCase();
    return email.replace(/[^a-zA-Z0-9@._-]/g, '');
}

function sanitizePhone(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[^0-9+]/g, '');
}

// ============================================
// ===== محافظت از همه فرم‌ها به صورت خودکار =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
            
            inputs.forEach(input => {
                if (input.value) {
                    if (input.type === 'email') {
                        input.value = sanitizeEmail(input.value);
                    } else if (input.type === 'tel') {
                        input.value = sanitizePhone(input.value);
                    } else {
                        input.value = sanitizeInput(input.value);
                    }
                }
            });
        });
    });
});

function getSafeUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(param);
    return value ? sanitizeInput(value) : null;
}

function setSecureItem(key, value) {
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, sanitizeInput(value));
}

function getSecureItem(key) {
    const value = localStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value);
        } catch {
            return sanitizeInput(value);
        }
    }
    return null;
}

// ============================================
// ===== تبدیل اعداد انگلیسی به فارسی =====
// ============================================

function toPersianNumber(num) {
    if (num === undefined || num === null) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, function(w) {
        return persianDigits[+w];
    });
}

function formatPriceFa(price) {
    return toPersianNumber(price.toLocaleString('fa-IR')) + ' تومان';
}

// ============================================
// ===== بارگذاری محصولات از دیتابیس =====
// ============================================

/**
 * رندر محصولات در صفحه
 */
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    // اگر محصولی وجود نداشت، پیام نمایش داده می‌شود
    if (!products || products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; color: var(--text-muted);">
                <i class="fas fa-box-open" style="font-size: 64px; display: block; margin-bottom: 20px; color: var(--primary);"></i>
                <h3 style="color: var(--text-primary); font-size: 24px; margin-bottom: 12px;">هنوز محصولی ثبت نشده است</h3>
                <p style="font-size: 16px;">محصولات به زودی توسط ادمین اضافه می‌شوند</p>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = products.map(product => {
        // بررسی وجود فیلدهای مورد نیاز
        const name = product.name || 'محصول بدون نام';
        const brand = product.brand || 'سایر';
        const amp = product.amp || '-';
        const price = product.price || 0;
        const stock = product.stock || 0;
        const image = product.image || 'assets/images/battery.jpg';
        const compatible = product.compatible || 'خودروهای مختلف';
        const rating = product.rating || 4;
        const reviews = product.reviews || 0;
        
        // ایجاد ستاره‌ها
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        if (fullStars < 5) {
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star" style="color: var(--rating-star-empty);"></i>';
            }
        }
        
        // بررسی موجودی
        const inStock = stock > 0;
        const stockBadge = inStock ? 'موجود' : 'ناموجود';
        const stockClass = inStock ? 'in-stock' : 'out-of-stock-badge';
        
        return `
            <div class="product-card" data-brand="${brand}" data-amp="${amp}">
                <div class="product-image">
                    <img src="${image}" alt="${name}" class="product-img" data-fallback="${name}">
                    <span class="product-badge ${stockClass}">${stockBadge}</span>
                    <span class="product-guarantee"><i class="fas fa-shield-alt"></i> گارانتی</span>
                </div>
                <div class="product-info">
                    <h4>${name}</h4>
                    <div class="product-meta">
                        <span class="product-brand"><i class="fas fa-tag"></i> ${brand}</span>
                        <span class="product-compatible"><i class="fas fa-car"></i> ${compatible}</span>
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span>(${toPersianNumber(reviews)} نظر)</span>
                    </div>
                    <span class="price">${formatPriceFa(price)}</span>
                    <button class="btn-order" onclick="addToCart(${product.id}, '${name.replace(/'/g, "\\'")}', ${price})" ${!inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * بارگذاری محصولات از دیتابیس و نمایش در فروشگاه
 */
function loadProductsFromDatabase() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    // دریافت محصولات از دیتابیس
    let products = [];
    
    // بررسی وجود دیتابیس
    if (window.App && window.App.database) {
        products = window.App.database.data.products || [];
    } else {
        // اگر سیستم راه‌اندازی نشده، از localStorage مستقیم استفاده کن
        try {
            const saved = localStorage.getItem('tehranbattery_database');
            if (saved) {
                const data = JSON.parse(saved);
                products = data.products || [];
            }
        } catch (e) {
            console.warn('⚠️ خطا در بارگذاری محصولات از localStorage:', e);
        }
    }
    
    // نمایش محصولات (حتی اگر خالی باشد، پیام نمایش داده می‌شود)
    renderProducts(products);
    
    // به‌روزرسانی فیلترها
    updateFilterOptions(products);
}

/**
 * به‌روزرسانی گزینه‌های فیلترها بر اساس محصولات موجود
 */
function updateFilterOptions(products) {
    const filterBrand = document.getElementById('filterBrand');
    const filterAmp = document.getElementById('filterAmp');
    
    if (!filterBrand && !filterAmp) return;
    
    // استخراج برندها و آمپراژهای موجود
    const brands = new Set();
    const amps = new Set();
    
    products.forEach(p => {
        if (p.brand) brands.add(p.brand);
        if (p.amp) amps.add(p.amp);
    });
    
    // به‌روزرسانی فیلتر برند
    if (filterBrand) {
        const currentValue = filterBrand.value;
        filterBrand.innerHTML = '<option value="all">همه برندها</option>';
        Array.from(brands).sort().forEach(brand => {
            filterBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
        if ([...brands].includes(currentValue)) {
            filterBrand.value = currentValue;
        }
    }
    
    // به‌روزرسانی فیلتر آمپراژ
    if (filterAmp) {
        const currentValue = filterAmp.value;
        filterAmp.innerHTML = '<option value="all">همه آمپراژها</option>';
        Array.from(amps).sort((a, b) => a - b).forEach(amp => {
            filterAmp.innerHTML += `<option value="${amp}">${amp} آمپر</option>`;
        });
        if ([...amps].includes(Number(currentValue))) {
            filterAmp.value = currentValue;
        }
    }
}

// ============================================
// ===== فیلترهای فروشگاه =====
// ============================================

function setupFilters() {
    const filterBrand = document.getElementById('filterBrand');
    const filterAmp = document.getElementById('filterAmp');
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    
    if (!filterBrand || !filterAmp || !productGrid) return;
    
    function filterProducts() {
        const brand = filterBrand.value;
        const amp = filterAmp.value;
        const cards = productGrid.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardBrand = card.dataset.brand;
            const cardAmp = card.dataset.amp;
            
            let show = true;
            if (brand !== 'all' && cardBrand !== brand) show = false;
            if (amp !== 'all' && cardAmp !== amp) show = false;
            
            card.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });
        
        // به‌روزرسانی تعداد نتایج
        if (productCount) {
            productCount.textContent = visibleCount;
        }
    }
    
    filterBrand.addEventListener('change', filterProducts);
    filterAmp.addEventListener('change', filterProducts);
    
    // اجرای اولیه برای نمایش تعداد
    setTimeout(filterProducts, 100);
}

// ============================================
// ===== گوش دادن به تغییرات دیتابیس =====
// ============================================

// بررسی تغییرات در localStorage (برای صفحات دیگر)
window.addEventListener('storage', function(e) {
    if (e.key === 'tehranbattery_database' || e.key === 'tehranbattery_last_change') {
        console.log('🔄 تغییر در دیتابیس شناسایی شد (storage event)، بارگذاری مجدد محصولات...');
        loadProductsFromDatabase();
    }
});

// بررسی دوره‌ای تغییرات (هر 3 ثانیه)
setInterval(function() {
    const lastChange = localStorage.getItem('tehranbattery_last_change');
    if (lastChange) {
        const lastChangeTime = parseInt(lastChange);
        const currentTime = Date.now();
        if (currentTime - lastChangeTime < 5000) {
            const lastLoaded = sessionStorage.getItem('tehranbattery_last_loaded') || '0';
            if (parseInt(lastLoaded) < lastChangeTime) {
                console.log('🔄 تغییر جدید در دیتابیس شناسایی شد (interval)، بارگذاری مجدد...');
                loadProductsFromDatabase();
                sessionStorage.setItem('tehranbattery_last_loaded', lastChangeTime.toString());
            }
        }
    }
}, 3000);

// ============================================
// ===== کدهای قبلی (با تغییرات جزئی) =====
// ============================================

// ===== MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    // باز و بسته کردن منو با کلیک روی هامبورگر
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // جلوگیری از اسکرول پس‌زمینه
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // بسته شدن منو پس از کلیک روی هر لینک
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // بسته شدن منو با کلیک روی هر جای دیگر صفحه
    document.addEventListener('click', function(e) {
        if (navMenu && !e.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // بسته شدن منو با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== IMAGE ERROR HANDLING =====
document.querySelectorAll('.product-img, .cert-img').forEach(img => {
    img.addEventListener('error', function() {
        const rawFallbackText = this.getAttribute('data-fallback') || 'تصویر';
        const cleanText = sanitizeInput(rawFallbackText);
        
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <rect width="200" height="200" fill="#243247"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      fill="#7A8A9E" font-size="24" font-family="Vazirmatn, Tahoma, sans-serif">
                    ${cleanText}
                </text>
            </svg>
        `;
        this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
});

document.querySelectorAll('.blog-image img').forEach(img => {
    img.addEventListener('error', function() {
        const rawFallbackText = this.getAttribute('data-fallback') || 'مطلب';
        const cleanText = sanitizeInput(rawFallbackText);
        
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
                <rect width="300" height="200" fill="#243247"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      fill="#7A8A9E" font-size="28" font-family="Vazirmatn, Tahoma, sans-serif">
                    ${cleanText}
                </text>
            </svg>
        `;
        this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            
            if (navMenu) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#FF4D4D';
                input.style.boxShadow = '0 0 0 3px rgba(255, 77, 77, 0.2)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
        });
        
        if (!isValid) {
            alert('لطفاً تمام فیلدهای الزامی را پر کنید.');
            return;
        }
        
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert('✅ پیام شما با موفقیت ارسال شد.\nکارشناسان ما به زودی با شما تماس می‌گیرند.');
            this.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            inputs.forEach(input => {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });
        }, 1000);
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const email = input ? sanitizeEmail(input.value.trim()) : '';
        
        if (!email || !email.includes('@')) {
            alert('لطفاً یک ایمیل معتبر وارد کنید.');
            return;
        }
        
        alert('✅ با موفقیت در خبرنامه عضو شدید.');
        this.reset();
    });
}

// ===== ORDER BUTTONS =====
document.querySelectorAll('.btn-order').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.closest('.product-info')?.querySelector('h4')?.textContent || 'قطعه';
        alert(`✅ سفارش "${productName}" با موفقیت ثبت شد.\nکارشناسان ما برای تکمیل سفارش با شما تماس می‌گیرند.`);
    });
});

// ===== BLOG CATEGORY FILTER =====
const categoryTags = document.querySelectorAll('.category-tag');
categoryTags.forEach(tag => {
    tag.addEventListener('click', function() {
        categoryTags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.textContent.trim();
        if (category === 'همه') {
            document.querySelectorAll('.blog-card').forEach(card => {
                card.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.blog-card').forEach(card => {
                const cardCategory = card.querySelector('.blog-category')?.textContent.trim() || '';
                card.style.display = cardCategory === category ? 'block' : 'none';
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.card, .product-card, .blog-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('.stat-item, .about-feature, .trust-badge').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// ===== بارگذاری اولیه =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری محصولات از دیتابیس
    loadProductsFromDatabase();
    
    // تنظیم فیلترها
    setupFilters();
    
    // ثبت زمان آخرین بارگذاری
    sessionStorage.setItem('tehranbattery_last_loaded', Date.now().toString());
    
    console.log('🚗 طهران باتری - نسخه ۴.۲ با بارگذاری پویای محصولات');
});
