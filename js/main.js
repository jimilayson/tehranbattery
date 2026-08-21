// ============================================
// ===== بارگذاری محصولات از دیتابیس =====
// ============================================

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
    
    // اگر محصولی وجود نداشت، محصولات پیش‌فرض را اضافه کن
    if (products.length === 0) {
        products = getDefaultProducts();
        // ذخیره در دیتابیس
        if (window.App && window.App.database) {
            window.App.database.data.products = products;
            window.App.database.saveData();
        } else {
            try {
                const saved = localStorage.getItem('tehranbattery_database');
                if (saved) {
                    const data = JSON.parse(saved);
                    data.products = products;
                    localStorage.setItem('tehranbattery_database', JSON.stringify(data));
                }
            } catch (e) {
                console.warn('⚠️ خطا در ذخیره محصولات پیش‌فرض:', e);
            }
        }
    }
    
    // نمایش محصولات
    renderProducts(products);
}

/**
 * محصولات پیش‌فرض (در صورت خالی بودن دیتابیس)
 */
function getDefaultProducts() {
    return [
        { 
            id: 1, 
            name: 'باتری ۶۶ آمپر', 
            brand: 'ایران باتری', 
            amp: 66, 
            price: 5800000, 
            stock: 12, 
            minStock: 5, 
            sales: 128, 
            revenue: 742400000,
            image: 'assets/images/battery.jpg',
            compatible: 'سمند، ۲۰۶، ۲۰۷',
            rating: 5,
            reviews: 128
        },
        { 
            id: 2, 
            name: 'باتری ۵۵ آمپر', 
            brand: 'سپاهان باتری', 
            amp: 55, 
            price: 4900000, 
            stock: 8, 
            minStock: 5, 
            sales: 78, 
            revenue: 382200000,
            image: 'assets/images/battery.jpg',
            compatible: 'پژو ۴۰۵، تیبا',
            rating: 5,
            reviews: 78
        },
        { 
            id: 3, 
            name: 'باتری ۷۴ آمپر', 
            brand: 'بوش', 
            amp: 74, 
            price: 6900000, 
            stock: 2, 
            minStock: 5, 
            sales: 53, 
            revenue: 365700000,
            image: 'assets/images/battery.jpg',
            compatible: 'تویوتا، نیسان، مزدا',
            rating: 5,
            reviews: 53
        },
        { 
            id: 4, 
            name: 'باتری ۶۰ آمپر', 
            brand: 'ایران باتری', 
            amp: 60, 
            price: 5200000, 
            stock: 15, 
            minStock: 8, 
            sales: 45, 
            revenue: 234000000,
            image: 'assets/images/battery.jpg',
            compatible: 'پراید، ۲۰۶، پژو',
            rating: 4.5,
            reviews: 124
        },
        { 
            id: 5, 
            name: 'باتری ۴۴ آمپر', 
            brand: 'دنسو', 
            amp: 44, 
            price: 3800000, 
            stock: 6, 
            minStock: 4, 
            sales: 32, 
            revenue: 121600000,
            image: 'assets/images/battery.jpg',
            compatible: 'پراید، ۲۰۶',
            rating: 4.5,
            reviews: 32
        },
        { 
            id: 6, 
            name: 'باتری ۸۰ آمپر', 
            brand: 'بوش', 
            amp: 80, 
            price: 8500000, 
            stock: 0, 
            minStock: 3, 
            sales: 18, 
            revenue: 153000000,
            image: 'assets/images/battery.jpg',
            compatible: 'SUV، خودروهای سنگین',
            rating: 5,
            reviews: 18
        },
        { 
            id: 7, 
            name: 'باتری ۱۰۰ آمپر', 
            brand: 'ایران باتری', 
            amp: 100, 
            price: 12000000, 
            stock: 1, 
            minStock: 2, 
            sales: 7, 
            revenue: 84000000,
            image: 'assets/images/battery.jpg',
            compatible: 'خودروهای سنگین، SUV',
            rating: 5,
            reviews: 7
        },
        { 
            id: 8, 
            name: 'باتری ۵۰ آمپر', 
            brand: 'سپاهان باتری', 
            amp: 50, 
            price: 4200000, 
            stock: 4, 
            minStock: 3, 
            sales: 22, 
            revenue: 92400000,
            image: 'assets/images/battery.jpg',
            compatible: 'سمند، ۴۰۵',
            rating: 5,
            reviews: 22
        }
    ];
}

/**
 * رندر محصولات در صفحه
 */
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fas fa-box-open" style="font-size: 48px; display: block; margin-bottom: 16px;"></i>
                <h3 style="color: var(--text-primary);">هنوز محصولی ثبت نشده است</h3>
                <p>محصولات به زودی توسط ادمین اضافه می‌شوند</p>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = products.map(product => {
        // ایجاد ستاره‌ها
        let stars = '';
        const fullStars = Math.floor(product.rating || 4);
        const hasHalfStar = (product.rating || 4) % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // بررسی موجودی
        const inStock = product.stock > 0;
        const stockBadge = inStock ? 'موجود' : 'ناموجود';
        const stockClass = inStock ? '' : 'out-of-stock';
        
        return `
            <div class="product-card ${stockClass}" data-brand="${product.brand}" data-amp="${product.amp}">
                <div class="product-image">
                    <img src="${product.image || 'assets/images/battery.jpg'}" alt="${product.name}" class="product-img" data-fallback="${product.name}">
                    <span class="product-badge ${inStock ? 'in-stock' : 'out-of-stock-badge'}">${stockBadge}</span>
                    <span class="product-guarantee"><i class="fas fa-shield-alt"></i> گارانتی</span>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-meta">
                        <span class="product-brand"><i class="fas fa-tag"></i> ${product.brand}</span>
                        <span class="product-compatible"><i class="fas fa-car"></i> ${product.compatible || 'خودروهای مختلف'}</span>
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span>(${product.reviews || 0} نظر)</span>
                    </div>
                    <span class="price">${product.price.toLocaleString('fa-IR')} تومان</span>
                    <button class="btn-order" onclick="addToCart(${product.id}, '${product.name}', ${product.price})" ${!inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// ===== بارگذاری محصولات هنگام DOM آماده =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری محصولات از دیتابیس
    loadProductsFromDatabase();
});