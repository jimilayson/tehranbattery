// ============================================
// ===== دیتابیس مشترک - اتصال به سیستم اصلی =====
// ============================================

// ===== استفاده از دیتابیس مشترک سیستم اصلی =====
let DataService;

if (window.App && window.App.database) {
    // ✅ استفاده از دیتابیس مشترک
    const mainDb = window.App.database;
    
    DataService = {
        getProducts: function() { 
            return mainDb.data.products || []; 
        },
        getOrders: function() { 
            return mainDb.data.orders || []; 
        },
        getCustomers: function() { 
            return mainDb.data.customers || []; 
        },
        getConsultings: function() { 
            return mainDb.data.consultings || []; 
        },
        
        addProduct: function(product) {
            const products = mainDb.data.products;
            const newProduct = {
                id: Date.now(),
                name: product.name || 'محصول جدید',
                brand: product.brand || 'سایر',
                amp: product.amp || 60,
                price: product.price || 0,
                stock: product.stock || 0,
                minStock: product.minStock || 5,
                sales: 0,
                revenue: 0,
                image: product.image || 'assets/images/battery.jpg',
                compatible: product.compatible || 'خودروهای مختلف',
                rating: product.rating || 4.5,
                reviews: 0,
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            // ✅ ذخیره در localStorage
            mainDb.saveData();
            console.log('💾 محصول جدید در دیتابیس ذخیره شد:', newProduct.name);
            
            // انتشار رویداد برای همگام‌سازی
            if (window.App && window.App.eventBus) {
                window.App.eventBus.emit(SystemEvents.PRODUCT_ADDED, newProduct);
            }
            
            return true;
        },
        
        updateProduct: function(id, data) {
            const products = mainDb.data.products;
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                const oldName = products[index].name;
                products[index] = { ...products[index], ...data };
                // ✅ ذخیره در localStorage
                mainDb.saveData();
                console.log('✏️ محصول ویرایش شد:', oldName);
                
                // انتشار رویداد برای همگام‌سازی
                if (window.App && window.App.eventBus) {
                    window.App.eventBus.emit(SystemEvents.PRODUCT_UPDATED, { id, data });
                }
                
                return true;
            }
            return false;
        },
        
        deleteProduct: function(id) {
            const products = mainDb.data.products;
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                const deletedName = products[index].name;
                const deletedProduct = products[index];
                products.splice(index, 1);
                // ✅ ذخیره در localStorage
                mainDb.saveData();
                console.log('🗑️ محصول حذف شد:', deletedName);
                
                // انتشار رویداد برای همگام‌سازی
                if (window.App && window.App.eventBus) {
                    window.App.eventBus.emit(SystemEvents.PRODUCT_DELETED, deletedProduct);
                }
                
                return true;
            }
            return false;
        },
        
        updateOrderStatus: function(id, status) {
            const orders = mainDb.data.orders;
            const order = orders.find(o => o.id === id);
            if (order) {
                order.status = status;
                mainDb.saveData();
                return true;
            }
            return false;
        },
        
        updateConsultingStatus: function(id, status) {
            const consultings = mainDb.data.consultings || [];
            const consulting = consultings.find(c => c.id === id);
            if (consulting) {
                consulting.status = status;
                mainDb.saveData();
                return true;
            }
            return false;
        }
    };
    
    console.log('✅ پنل ادمین به دیتابیس مشترک متصل شد');
    console.log(`📊 ${DataService.getOrders().length} سفارش، ${DataService.getProducts().length} محصول`);
    
} else {
    // Fallback: استفاده از دیتابیس مستقل
    console.warn('⚠️ سیستم اصلی یافت نشد، از دیتابیس مستقل استفاده می‌شود');
    
    // ===== داده‌های نمونه (فقط در صورت نبود سیستم اصلی) =====
    let mockProducts = [
        { id: 1, name: 'باتری ۶۶ آمپر', brand: 'ایران باتری', amp: 66, price: 5800000, stock: 12, minStock: 5, sales: 128, revenue: 742400000, image: 'assets/images/battery.jpg', compatible: 'سمند، ۲۰۶، ۲۰۷', rating: 5, reviews: 128 },
        { id: 2, name: 'باتری ۵۵ آمپر', brand: 'سپاهان باتری', amp: 55, price: 4900000, stock: 8, minStock: 5, sales: 78, revenue: 382200000, image: 'assets/images/battery.jpg', compatible: 'پژو ۴۰۵، تیبا', rating: 5, reviews: 78 },
        { id: 3, name: 'باتری ۷۴ آمپر', brand: 'بوش', amp: 74, price: 6900000, stock: 2, minStock: 5, sales: 53, revenue: 365700000, image: 'assets/images/battery.jpg', compatible: 'تویوتا، نیسان، مزدا', rating: 5, reviews: 53 },
        { id: 4, name: 'باتری ۶۰ آمپر', brand: 'ایران باتری', amp: 60, price: 5200000, stock: 15, minStock: 8, sales: 45, revenue: 234000000, image: 'assets/images/battery.jpg', compatible: 'پراید، ۲۰۶، پژو', rating: 4.5, reviews: 124 },
        { id: 5, name: 'باتری ۴۴ آمپر', brand: 'دنسو', amp: 44, price: 3800000, stock: 6, minStock: 4, sales: 32, revenue: 121600000, image: 'assets/images/battery.jpg', compatible: 'پراید، ۲۰۶', rating: 4.5, reviews: 32 },
        { id: 6, name: 'باتری ۸۰ آمپر', brand: 'بوش', amp: 80, price: 8500000, stock: 0, minStock: 3, sales: 18, revenue: 153000000, image: 'assets/images/battery.jpg', compatible: 'SUV، خودروهای سنگین', rating: 5, reviews: 18 },
        { id: 7, name: 'باتری ۱۰۰ آمپر', brand: 'ایران باتری', amp: 100, price: 12000000, stock: 1, minStock: 2, sales: 7, revenue: 84000000, image: 'assets/images/battery.jpg', compatible: 'خودروهای سنگین، SUV', rating: 5, reviews: 7 },
        { id: 8, name: 'باتری ۵۰ آمپر', brand: 'سپاهان باتری', amp: 50, price: 4200000, stock: 4, minStock: 3, sales: 22, revenue: 92400000, image: 'assets/images/battery.jpg', compatible: 'سمند، ۴۰۵', rating: 5, reviews: 22 },
    ];

    let mockOrders = [
        { id: 1258, customer: 'علی رضایی', phone: '09123456789', products: ['باتری ۶۶ آمپر'], total: 5800000, status: 'pending', time: '۱۰ دقیقه پیش', items: 1 },
        { id: 1257, customer: 'محمد احمدی', phone: '09129876543', products: ['باتری ۵۵ آمپر'], total: 4900000, status: 'shipping', time: '۲۵ دقیقه پیش', items: 1 },
        { id: 1256, customer: 'رضا کریمی', phone: '09127654321', products: ['باتری ۷۴ آمپر'], total: 6900000, status: 'delivered', time: '۴۵ دقیقه پیش', items: 1 },
    ];

    let mockCustomers = [
        { name: 'علی رضایی', phone: '09123456789', orders: 5, totalSpent: 29000000, lastOrder: '۱۴۰۵/۰۵/۱۵', status: 'active' },
        { name: 'محمد احمدی', phone: '09129876543', orders: 3, totalSpent: 14700000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active' },
        { name: 'رضا کریمی', phone: '09127654321', orders: 7, totalSpent: 48300000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active' },
        { name: 'سارا محمدی', phone: '09125432167', orders: 2, totalSpent: 18000000, lastOrder: '۱۴۰۵/۰۵/۱۳', status: 'inactive' },
        { name: 'حسین علی‌پور', phone: '09121987654', orders: 1, totalSpent: 5800000, lastOrder: '۱۴۰۵/۰۵/۱۲', status: 'new' },
    ];

    let mockConsultings = [
        { id: 1, customer: 'علی رضایی', phone: '09123456789', car: 'پژو ۲۰۶', model: 'تیپ ۵', year: 1398, suggested: 'باتری ۵۵ آمپر', status: 'new', time: '۵ دقیقه پیش', message: 'سلام. ماشین من پژو ۲۰۶ مدل ۱۳۹۸ هست. باتری ماشین ضعیف شده و نمیدونم چه آمپراژی باید تهیه کنم.' },
        { id: 2, customer: 'سارا محمدی', phone: '09129876543', car: 'سمند', model: 'LX', year: 1399, suggested: 'باتری ۶۰ آمپر', status: 'reviewing', time: '۱۵ دقیقه پیش', message: 'سلام. برای سمند مدل ۱۳۹۹ چه باتری مناسب است؟ قیمت و موجودی را هم لطفاً بفرمایید.' },
        { id: 3, customer: 'رضا کریمی', phone: '09127654321', car: 'تویوتا کرولا', model: '۲۰۲۰', year: 1400, suggested: 'باتری ۷۴ آمپر', status: 'answered', time: '۳۰ دقیقه پیش', message: 'باتری ۷۴ آمپر بوش موجود دارید؟ قیمت چقدر است؟' },
    ];

    DataService = {
        getProducts: function() { return mockProducts; },
        getOrders: function() { return mockOrders; },
        getCustomers: function() { return mockCustomers; },
        getConsultings: function() { return mockConsultings; },
        
        addProduct: function(product) {
            const newProduct = {
                id: Date.now(),
                name: product.name || 'محصول جدید',
                brand: product.brand || 'سایر',
                amp: product.amp || 60,
                price: product.price || 0,
                stock: product.stock || 0,
                minStock: product.minStock || 5,
                sales: 0,
                revenue: 0,
                image: product.image || 'assets/images/battery.jpg',
                compatible: product.compatible || 'خودروهای مختلف',
                rating: product.rating || 4.5,
                reviews: 0,
                createdAt: new Date().toISOString()
            };
            mockProducts.push(newProduct);
            // ✅ ذخیره در localStorage
            try {
                const saved = localStorage.getItem('tehranbattery_database');
                if (saved) {
                    const data = JSON.parse(saved);
                    data.products = mockProducts;
                    localStorage.setItem('tehranbattery_database', JSON.stringify(data));
                }
            } catch (e) {
                console.warn('⚠️ خطا در ذخیره در localStorage:', e);
            }
            console.log('💾 محصول جدید در دیتابیس ذخیره شد (fallback):', newProduct.name);
            return true;
        },
        
        updateProduct: function(id, data) {
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProducts[index] = { ...mockProducts[index], ...data };
                // ✅ ذخیره در localStorage
                try {
                    const saved = localStorage.getItem('tehranbattery_database');
                    if (saved) {
                        const dbData = JSON.parse(saved);
                        dbData.products = mockProducts;
                        localStorage.setItem('tehranbattery_database', JSON.stringify(dbData));
                    }
                } catch (e) {
                    console.warn('⚠️ خطا در ذخیره در localStorage:', e);
                }
                console.log('✏️ محصول ویرایش شد (fallback):', mockProducts[index].name);
                return true;
            }
            return false;
        },
        
        deleteProduct: function(id) {
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                const deletedName = mockProducts[index].name;
                mockProducts.splice(index, 1);
                // ✅ ذخیره در localStorage
                try {
                    const saved = localStorage.getItem('tehranbattery_database');
                    if (saved) {
                        const dbData = JSON.parse(saved);
                        dbData.products = mockProducts;
                        localStorage.setItem('tehranbattery_database', JSON.stringify(dbData));
                    }
                } catch (e) {
                    console.warn('⚠️ خطا در ذخیره در localStorage:', e);
                }
                console.log('🗑️ محصول حذف شد (fallback):', deletedName);
                return true;
            }
            return false;
        },
        
        updateOrderStatus: function(id, status) {
            const order = mockOrders.find(o => o.id === id);
            if (order) {
                order.status = status;
                return true;
            }
            return false;
        },
        
        updateConsultingStatus: function(id, status) {
            const consulting = mockConsultings.find(c => c.id === id);
            if (consulting) {
                consulting.status = status;
                return true;
            }
            return false;
        }
    };
}

// ============================================
// ===== توابع کمکی =====
// ============================================

function sanitizeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatPrice(price) {
    return price.toLocaleString('fa-IR') + ' تومان';
}

function formatNumber(num) {
    return num.toLocaleString('fa-IR');
}

function getStatusLabel(status) {
    const map = {
        'registered': 'ثبت شده',
        'pending': 'در انتظار تأیید',
        'approved': 'تأیید شده',
        'preparing': 'در حال آماده‌سازی',
        'shipping': 'ارسال شده',
        'delivered': 'تحویل شده',
        'cancelled': 'لغو شده',
        'returned': 'مرجوع شده',
        'new': 'جدید',
        'reviewing': 'در حال بررسی',
        'answered': 'پاسخ داده شده'
    };
    return map[status] || status;
}

function getStatusClass(status) {
    return 'status-' + status;
}

function getStockStatus(stock, minStock) {
    if (stock <= 0) return 'danger';
    if (stock <= minStock) return 'warning';
    if (stock <= minStock * 2) return 'info';
    return 'success';
}

function getStockLabel(stock, minStock) {
    if (stock <= 0) return '🔴 ناموجود';
    if (stock <= minStock) return '🟠 موجودی کم';
    if (stock <= minStock * 2) return '🟢 موجود';
    return '🔵 موجودی بالا';
}

// ============================================
// ===== سیستم صفحه‌بندی =====
// ============================================

class Pagination {
    constructor(data, itemsPerPage = 10) {
        this.data = data;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(data.length / itemsPerPage);
    }
    
    getPage(page) {
        this.currentPage = Math.min(Math.max(1, page), this.totalPages || 1);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.data.slice(start, end);
    }
    
    getInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(start + this.itemsPerPage - 1, this.data.length);
        return {
            start: this.data.length === 0 ? 0 : start,
            end: end,
            total: this.data.length,
            current: this.currentPage,
            totalPages: this.totalPages
        };
    }
}

// ============================================
// ===== توابع اصلی =====
// ============================================

let salesChart = null;
let currentOrderFilter = 'all';
let currentConsultingFilter = 'all';
let currentCustomerFilter = 'all';

let productsPagination = null;
let ordersPagination = null;
let customersPagination = null;
let consultingPagination = null;

// ============================================
// ===== بروزرسانی KPI =====
// ============================================

function updateKPIs() {
    const products = DataService.getProducts();
    const orders = DataService.getOrders();
    const customers = DataService.getCustomers();
    
    const todayOrders = orders.filter(o => o.time && (o.time.includes('دقیقه') || o.time.includes('ساعت') || o.time.includes('امروز')));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    
    const todayRevenueEl = document.getElementById('todayRevenue');
    if (todayRevenueEl) todayRevenueEl.textContent = formatPrice(todayRevenue);
    
    const todayOrdersEl = document.getElementById('todayOrders');
    if (todayOrdersEl) todayOrdersEl.textContent = todayOrders.length;
    
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'registered');
    const pendingEl = document.getElementById('pendingOrders');
    if (pendingEl) pendingEl.textContent = pending.length;
    
    const shipping = orders.filter(o => o.status === 'shipping');
    const shippingEl = document.getElementById('shippingOrders');
    if (shippingEl) shippingEl.textContent = shipping.length;
    
    const newCustomersEl = document.getElementById('newCustomers');
    if (newCustomersEl) newCustomersEl.textContent = Math.floor(Math.random() * 10) + 5;
    
    const batteries = orders.reduce((sum, o) => sum + (o.items || 0), 0);
    const batteriesEl = document.getElementById('batteriesSold');
    if (batteriesEl) batteriesEl.textContent = batteries;
    
    const critical = products.filter(p => p.stock <= p.minStock);
    const criticalEl = document.getElementById('criticalStock');
    if (criticalEl) criticalEl.textContent = critical.length;
    
    const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'returned');
    const cancelledEl = document.getElementById('cancelledOrders');
    if (cancelledEl) cancelledEl.textContent = cancelled.length;
}

// ============================================
// ===== نمودار فروش =====
// ============================================

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    const labels = ['۱', '۳', '۵', '۷', '۹', '۱۱', '۱۳', '۱۵', '۱۷', '۱۹', '۲۱', '۲۳', '۲۵', '۲۷', '۲۹'];
    const data = [12, 19, 15, 22, 18, 25, 30, 28, 35, 32, 40, 38, 45, 42, 50];
    
    if (salesChart) salesChart.destroy();
    
    try {
        salesChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'فروش (میلیون تومان)',
                    data: data,
                    borderColor: '#7A8A9E',
                    backgroundColor: 'rgba(122, 138, 158, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#7A8A9E'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#C5CED9',
                            font: { family: 'Vazirmatn' }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#8E9AAA' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#8E9AAA' }
                    }
                }
            }
        });
        
        const monthlySalesEl = document.getElementById('monthlySales');
        if (monthlySalesEl) monthlySalesEl.textContent = '۱,۲۴۵,۰۰۰,۰۰۰ تومان';
        
        const monthlyGrowthEl = document.getElementById('monthlyGrowth');
        if (monthlyGrowthEl) monthlyGrowthEl.textContent = '+۱۲.۴٪ نسبت به ماه قبل';
        
    } catch (e) {
        console.warn('⚠️ نمودار فروش قابل بارگذاری نیست:', e);
    }
}

// ============================================
// ===== رندر محصولات =====
// ============================================

function renderProducts(page = 1) {
    const products = DataService.getProducts();
    productsPagination = new Pagination(products, 8);
    const pageData = productsPagination.getPage(page);
    
    const tbody = document.getElementById('productList');
    if (!tbody) return;
    
    tbody.innerHTML = pageData.map(p => {
        const stockStatus = getStockStatus(p.stock, p.minStock);
        const stockLabel = getStockLabel(p.stock, p.minStock);
        return `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.brand || '-'}</td>
                <td>${p.amp || '-'} آمپر</td>
                <td>${formatPrice(p.price)}</td>
                <td>${p.stock}</td>
                <td><span class="stock-status ${stockStatus}">${stockLabel}</span></td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editProduct(${p.id})" class="btn-action btn-edit">
                            ✏️ ویرایش
                        </button>
                        <button onclick="deleteProduct(${p.id})" class="btn-action btn-delete">
                            🗑️ حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination('productsPagination', productsPagination, renderProducts);
}

// ============================================
// ===== عملیات محصولات =====
// ============================================

window.editProduct = function(id) {
    const products = DataService.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const editIdEl = document.getElementById('editProductId');
    if (editIdEl) editIdEl.value = product.id;
    
    const editNameEl = document.getElementById('editProdName');
    if (editNameEl) editNameEl.value = product.name;
    
    const editBrandEl = document.getElementById('editProdBrand');
    if (editBrandEl) editBrandEl.value = product.brand || 'ایران باتری';
    
    const editAmpEl = document.getElementById('editProdAmp');
    if (editAmpEl) editAmpEl.value = product.amp || '۶۶';
    
    const editPriceEl = document.getElementById('editProdPrice');
    if (editPriceEl) editPriceEl.value = product.price;
    
    const editStockEl = document.getElementById('editProdStock');
    if (editStockEl) editStockEl.value = product.stock;
    
    const editMinStockEl = document.getElementById('editProdMinStock');
    if (editMinStockEl) editMinStockEl.value = product.minStock || 5;
    
    const editSalesEl = document.getElementById('editProdSales');
    if (editSalesEl) editSalesEl.value = product.sales || 0;
    
    const modal = document.getElementById('editProductModal');
    if (modal) modal.style.display = 'flex';
};

window.deleteProduct = function(id) {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    if (DataService.deleteProduct(id)) {
        showNotification('✅ محصول با موفقیت حذف شد');
        refreshDashboard();
        renderProducts(productsPagination ? productsPagination.currentPage : 1);
    }
};

// ============================================
// ===== رندر سفارشات =====
// ============================================

function renderAllOrders(page = 1) {
    const orders = DataService.getOrders();
    const filtered = currentOrderFilter === 'all' ? orders : orders.filter(o => o.status === currentOrderFilter);
    ordersPagination = new Pagination(filtered, 8);
    const pageData = ordersPagination.getPage(page);
    
    const tbody = document.getElementById('allOrdersList');
    if (!tbody) return;
    
    tbody.innerHTML = pageData.map(o => {
        const customerName = o.customer?.name || o.customer || '';
        const productsList = Array.isArray(o.products) ? o.products.join('، ') : 
                            (o.items ? o.items.map(i => i.name).join('، ') : '-');
        return `
            <tr>
                <td><strong>#${o.id}</strong></td>
                <td>${sanitizeHtml(customerName)}</td>
                <td>${productsList}</td>
                <td>${formatPrice(o.total)}</td>
                <td><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
                <td>${o.time || o.createdAt || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="viewOrder(${o.id})" class="btn-action btn-view">
                            👁️ مشاهده
                        </button>
                        <button onclick="openOrderStatusModal(${o.id})" class="btn-action btn-status">
                            🔄 تغییر وضعیت
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination('ordersPagination', ordersPagination, renderAllOrders);
}

// ============================================
// ===== فیلتر سفارشات =====
// ============================================

window.filterOrdersByStatus = function() {
    const filter = document.getElementById('orderStatusFilter');
    currentOrderFilter = filter ? filter.value : 'all';
    renderAllOrders(1);
};

// ============================================
// ===== رندر مشتریان =====
// ============================================

window.filterCustomersByStatus = function() {
    const filter = document.getElementById('customerStatusFilter');
    currentCustomerFilter = filter ? filter.value : 'all';
    renderCustomers(1);
};

function renderCustomers(page = 1) {
    const customers = DataService.getCustomers();
    
    let filtered = customers;
    if (currentCustomerFilter !== 'all') {
        filtered = customers.filter(c => c.status === currentCustomerFilter);
    }
    
    customersPagination = new Pagination(filtered, 8);
    const pageData = customersPagination.getPage(page);
    
    const totalEl = document.getElementById('totalCustomers');
    if (totalEl) totalEl.textContent = customers.length;
    
    const todayEl = document.getElementById('todayCustomers');
    if (todayEl) todayEl.textContent = Math.floor(Math.random() * 5) + 2;
    
    const monthEl = document.getElementById('monthCustomers');
    if (monthEl) monthEl.textContent = Math.floor(Math.random() * 20) + 10;
    
    const returnEl = document.getElementById('returnCustomers');
    if (returnEl) returnEl.textContent = customers.filter(c => c.orders > 1).length;
    
    const tbody = document.getElementById('customerList');
    if (!tbody) return;
    
    tbody.innerHTML = pageData.map(c => `
        <tr>
            <td><strong>${sanitizeHtml(c.name)}</strong></td>
            <td>${c.phone}</td>
            <td>${c.orders}</td>
            <td>${formatPrice(c.totalSpent || 0)}</td>
            <td>${c.lastOrder || '-'}</td>
            <td><span class="customer-status ${c.status}">${c.status === 'active' ? '✅ فعال' : c.status === 'new' ? '🆕 جدید' : '❌ غیرفعال'}</span></td>
        </tr>
    `).join('');
    
    renderPagination('customersPagination', customersPagination, renderCustomers);
}

// ============================================
// ===== رندر مشاوره =====
// ============================================

window.filterConsultings = function() {
    const filter = document.getElementById('consultingStatusFilter');
    currentConsultingFilter = filter ? filter.value : 'all';
    renderConsultings(1);
};

function renderConsultings(page = 1) {
    const consultings = DataService.getConsultings();
    const filtered = currentConsultingFilter === 'all' ? consultings : consultings.filter(c => c.status === currentConsultingFilter);
    consultingPagination = new Pagination(filtered, 8);
    const pageData = consultingPagination.getPage(page);
    
    const newEl = document.getElementById('consultingNewCount');
    if (newEl) newEl.textContent = consultings.filter(c => c.status === 'new').length;
    
    const reviewingEl = document.getElementById('consultingReviewingCount');
    if (reviewingEl) reviewingEl.textContent = consultings.filter(c => c.status === 'reviewing').length;
    
    const answeredEl = document.getElementById('consultingAnsweredCount');
    if (answeredEl) answeredEl.textContent = consultings.filter(c => c.status === 'answered').length;
    
    const tbody = document.getElementById('consultingList');
    if (!tbody) return;
    
    tbody.innerHTML = pageData.map(c => `
        <tr>
            <td>#${c.id}</td>
            <td><strong>${sanitizeHtml(c.customer)}</strong></td>
            <td>${c.car}</td>
            <td>${c.model}</td>
            <td>${c.year}</td>
            <td>${c.suggested}</td>
            <td><span class="consulting-status-badge status-${c.status}">${getStatusLabel(c.status)}</span></td>
            <td>${c.time}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="openConsultingStatusModal(${c.id})" class="btn-action btn-view">
                        👁️ مشاهده و تغییر
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    renderPagination('consultingPagination', consultingPagination, renderConsultings);
}

// ============================================
// ===== عملیات سفارشات =====
// ============================================

window.viewOrder = function(id) {
    const orders = DataService.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const customerName = order.customer?.name || order.customer || '';
    const customerPhone = order.customer?.phone || order.phone || '';
    const productsList = Array.isArray(order.products) ? order.products.join('، ') : 
                        (order.items ? order.items.map(i => i.name).join('، ') : '-');
    
    alert(`📋 جزئیات سفارش #${order.id}\n\n` +
          `👤 مشتری: ${customerName}\n` +
          `📱 تماس: ${customerPhone}\n` +
          `📦 محصولات: ${productsList}\n` +
          `💰 مبلغ: ${formatPrice(order.total)}\n` +
          `📊 وضعیت: ${getStatusLabel(order.status)}\n` +
          `⏰ زمان: ${order.time || order.createdAt || '-'}`);
};

let currentOrderId = null;

window.openOrderStatusModal = function(id) {
    currentOrderId = id;
    const modal = document.getElementById('orderStatusModal');
    if (modal) modal.style.display = 'flex';
};

window.changeOrderStatus = function(status) {
    if (!currentOrderId) return;
    if (DataService.updateOrderStatus(currentOrderId, status)) {
        showNotification(`✅ وضعیت سفارش #${currentOrderId} به "${getStatusLabel(status)}" تغییر یافت`);
        closeModal('orderStatusModal');
        currentOrderId = null;
        refreshDashboard();
        renderAllOrders(ordersPagination ? ordersPagination.currentPage : 1);
    }
};

// ============================================
// ===== عملیات مشاوره =====
// ============================================

let currentConsultingId = null;

window.openConsultingStatusModal = function(id) {
    const consultings = DataService.getConsultings();
    const consulting = consultings.find(c => c.id === id);
    if (!consulting) return;
    
    currentConsultingId = id;
    
    const detailContainer = document.getElementById('consultingDetail');
    if (detailContainer) {
        detailContainer.innerHTML = `
            <div class="consulting-full-detail">
                <div class="detail-row">
                    <span class="detail-label">👤 نام مشتری:</span>
                    <span class="detail-value">${sanitizeHtml(consulting.customer)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📱 شماره تماس:</span>
                    <span class="detail-value">${consulting.phone || 'وارد نشده'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🚗 خودرو:</span>
                    <span class="detail-value">${consulting.car} ${consulting.model} (${consulting.year})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🔋 باتری پیشنهادی:</span>
                    <span class="detail-value">${consulting.suggested}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📝 پیام کاربر:</span>
                    <span class="detail-value message-text">${consulting.message || 'پیامی وارد نشده است'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">⏰ زمان درخواست:</span>
                    <span class="detail-value">${consulting.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📊 وضعیت فعلی:</span>
                    <span class="detail-value"><span class="consulting-status-badge status-${consulting.status}">${getStatusLabel(consulting.status)}</span></span>
                </div>
            </div>
        `;
    }
    
    const statusSelect = document.getElementById('consultingNewStatus');
    if (statusSelect) statusSelect.value = consulting.status;
    
    const modal = document.getElementById('consultingStatusModal');
    if (modal) modal.style.display = 'flex';
};

window.applyConsultingStatus = function() {
    if (!currentConsultingId) return;
    
    const statusSelect = document.getElementById('consultingNewStatus');
    const newStatus = statusSelect ? statusSelect.value : 'answered';
    
    if (DataService.updateConsultingStatus(currentConsultingId, newStatus)) {
        showNotification(`✅ وضعیت مشاوره #${currentConsultingId} به "${getStatusLabel(newStatus)}" تغییر یافت`);
        closeModal('consultingStatusModal');
        currentConsultingId = null;
        refreshDashboard();
        renderConsultings(consultingPagination ? consultingPagination.currentPage : 1);
    }
};

// ============================================
// ===== صفحه‌بندی =====
// ============================================

function renderPagination(containerId, pagination, renderFunc) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const info = pagination.getInfo();
    
    let html = `
        <button class="pagination-btn" onclick="${renderFunc.name}(${info.current - 1})" ${info.current <= 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    const pages = [];
    const total = info.totalPages;
    const current = info.current;
    
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push('...');
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push('...');
        pages.push(total);
    }
    
    pages.forEach(p => {
        if (p === '...') {
            html += `<span class="pagination-info">...</span>`;
        } else {
            html += `<button class="pagination-btn ${p === current ? 'active' : ''}" onclick="${renderFunc.name}(${p})">${p}</button>`;
        }
    });
    
    html += `
        <button class="pagination-btn" onclick="${renderFunc.name}(${info.current + 1})" ${info.current >= info.totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
        <span class="pagination-info">${info.start} - ${info.end} از ${info.total}</span>
    `;
    
    container.innerHTML = html;
}

// ============================================
// ===== ناوبری =====
// ============================================

window.navigateTo = function(section) {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const targetLink = document.querySelector(`.admin-nav a[data-section="${section}"]`);
    if (targetLink) targetLink.click();
};

// ============================================
// ===== مودال‌ها =====
// ============================================

window.showAddProductModal = function() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.style.display = 'flex';
};

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};

// ============================================
// ===== گزارش‌ها =====
// ============================================

window.generateReport = function(type) {
    const reports = {
        sales: '📊 گزارش فروش: کل فروش ۱,۲۴۵,۰۰۰,۰۰۰ تومان\n\nفروش ناخالص: ۱,۲۴۵,۰۰۰,۰۰۰ تومان\nتخفیفات: ۸۲,۰۰۰,۰۰۰ تومان\nهزینه ارسال: ۳۵,۰۰۰,۰۰۰ تومان\nمرجوعی: ۱۸,۰۰۰,۰۰۰ تومان\nفروش خالص: ۱,۱۱۰,۰۰۰,۰۰۰ تومان',
        profit: '💰 گزارش سود:\n\nفروش خالص: ۱,۱۱۰,۰۰۰,۰۰۰ تومان\nهزینه خرید: ۸۲۰,۰۰۰,۰۰۰ تومان\nسود ناخالص: ۲۹۰,۰۰۰,۰۰۰ تومان\nحاشیه سود: ۲۶.۱%',
        products: '📦 گزارش محصولات:\n\n۸ محصول فعال\n۲ محصول ناموجود\n۳ محصول کم‌موجود\nپرفروش‌ترین: باتری ۶۶ آمپر با ۱۲۸ عدد فروش',
        brands: '🏷️ گزارش برندها:\n\nایران باتری: ۴۲% سهم فروش\nسپاهان باتری: ۲۸% سهم فروش\nبوش: ۱۸% سهم فروش\nسایر: ۱۲% سهم فروش'
    };
    alert(reports[type] || 'گزارش در حال آماده‌سازی است...');
};

// ============================================
// ===== رفرش داشبورد =====
// ============================================

function refreshDashboard() {
    updateKPIs();
    updateOrderStatus(DataService.getOrders());
    updateBrandSales(DataService.getProducts());
    updateAmpSales(DataService.getProducts());
    updateTopProducts(DataService.getProducts());
    updateCriticalStock(DataService.getProducts());
    updateSystemAlerts(DataService.getOrders(), DataService.getProducts());
    updateLowSalesProducts(DataService.getProducts());
    
    renderAllOrders(ordersPagination ? ordersPagination.currentPage : 1);
    renderProducts(productsPagination ? productsPagination.currentPage : 1);
    renderCustomers(customersPagination ? customersPagination.currentPage : 1);
    renderConsultings(consultingPagination ? consultingPagination.currentPage : 1);
}

// ============================================
// ===== توابع داشبورد =====
// ============================================

function updateOrderStatus(orders) {
    const statuses = ['registered', 'pending', 'approved', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'];
    
    statuses.forEach(status => {
        const count = orders.filter(o => o.status === status).length;
        const el = document.getElementById('status-' + status);
        if (el) el.textContent = count;
    });
}

function updateBrandSales(products) {
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    
    const brands = {};
    products.forEach(p => {
        if (!brands[p.brand]) brands[p.brand] = { sales: 0, revenue: 0 };
        brands[p.brand].sales += p.sales;
        brands[p.brand].revenue += p.revenue || (p.sales * p.price);
    });
    
    const container = document.getElementById('brandSales');
    if (!container) return;
    container.innerHTML = Object.entries(brands).map(([brand, data]) => {
        const percent = totalSales > 0 ? Math.round((data.sales / totalSales) * 100) : 0;
        return `
            <div class="brand-item">
                <span class="brand-name">${brand}</span>
                <div class="brand-bar">
                    <div class="brand-bar-fill" style="width: ${percent}%"></div>
                </div>
                <span class="brand-percent">${percent}%</span>
                <span class="brand-detail">${data.sales} عدد | ${formatPrice(data.revenue)}</span>
            </div>
        `;
    }).join('');
}

function updateAmpSales(products) {
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    
    const amps = {};
    products.forEach(p => {
        const key = p.amp + ' آمپر';
        if (!amps[key]) amps[key] = { sales: 0, revenue: 0 };
        amps[key].sales += p.sales;
        amps[key].revenue += p.revenue || (p.sales * p.price);
    });
    
    const container = document.getElementById('ampSales');
    if (!container) return;
    container.innerHTML = Object.entries(amps)
        .sort((a, b) => b[1].sales - a[1].sales)
        .map(([amp, data]) => {
            const percent = totalSales > 0 ? Math.round((data.sales / totalSales) * 100) : 0;
            return `
                <div class="amp-item">
                    <span class="amp-name">${amp}</span>
                    <div class="amp-bar">
                        <div class="amp-bar-fill" style="width: ${percent}%"></div>
                    </div>
                    <span class="amp-percent">${percent}%</span>
                    <span class="amp-detail">${data.sales} عدد | ${formatPrice(data.revenue)}</span>
                </div>
            `;
        }).join('');
}

function updateTopProducts(products) {
    const sorted = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
    
    const container = document.getElementById('topProducts');
    if (!container) return;
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    
    container.innerHTML = sorted.map((p, index) => {
        const share = totalSales > 0 ? Math.round((p.sales / totalSales) * 100) : 0;
        return `
            <div class="top-product">
                <div class="top-product-rank">#${index + 1}</div>
                <div class="top-product-info">
                    <div class="top-product-name">${p.name}</div>
                    <div class="top-product-detail">
                        <span>${p.sales} عدد فروش</span>
                        <span>${formatPrice(p.revenue || (p.sales * p.price))}</span>
                        <span>موجودی: ${p.stock}</span>
                        <span>سهم: ${share}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCriticalStock(products) {
    const critical = products.filter(p => p.stock <= p.minStock);
    
    const container = document.getElementById('criticalStockList');
    if (!container) return;
    if (critical.length === 0) {
        container.innerHTML = '<p class="no-data">✅ همه محصولات موجودی کافی دارند</p>';
        return;
    }
    
    container.innerHTML = critical.map(p => {
        const status = getStockStatus(p.stock, p.minStock);
        const label = getStockLabel(p.stock, p.minStock);
        return `
            <div class="critical-item ${status}">
                <div class="critical-info">
                    <span class="critical-name">${p.name}</span>
                    <span class="critical-stock">موجودی: ${p.stock} عدد</span>
                    <span class="critical-min">حداقل: ${p.minStock}</span>
                </div>
                <span class="critical-status">${label}</span>
            </div>
        `;
    }).join('');
}

function updateSystemAlerts(orders, products) {
    const consultings = DataService.getConsultings();
    
    const alerts = [];
    
    const paidNotShipped = orders.filter(o => (o.status === 'approved' || o.status === 'preparing'));
    if (paidNotShipped.length > 0) {
        alerts.push({ type: 'danger', text: `${paidNotShipped.length} سفارش تأیید شده ولی در حال آماده‌سازی` });
    }
    
    const outOfStock = products.filter(p => p.stock === 0);
    if (outOfStock.length > 0) {
        alerts.push({ type: 'danger', text: `${outOfStock.length} محصول ناموجود شد: ${outOfStock.map(p => p.name).join('، ')}` });
    }
    
    const critical = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
    if (critical.length > 0) {
        alerts.push({ type: 'warning', text: `${critical.length} محصول به حداقل موجودی رسید` });
    }
    
    const noAnswer = consultings.filter(c => c.status === 'new' || c.status === 'reviewing');
    if (noAnswer.length > 0) {
        alerts.push({ type: 'warning', text: `${noAnswer.length} درخواست مشاوره بدون پاسخ` });
    }
    
    const container = document.getElementById('systemAlerts');
    if (!container) return;
    if (alerts.length === 0) {
        container.innerHTML = '<p class="no-alerts">✅ همه چیز عالی است! هیچ هشدار مهمی وجود ندارد.</p>';
        return;
    }
    
    container.innerHTML = alerts.map(a => `
        <div class="alert-item alert-${a.type}">
            <i class="fas fa-${a.type === 'danger' ? 'times-circle' : 'exclamation-triangle'}"></i>
            <span>${a.text}</span>
        </div>
    `).join('');
}

function updateLowSalesProducts(products) {
    const lowSales = [...products].sort((a, b) => a.sales - b.sales).slice(0, 5);
    
    const container = document.getElementById('lowSalesProducts');
    if (!container) return;
    container.innerHTML = lowSales.map(p => `
        <div class="low-product-item">
            <span class="product-name">${p.name}</span>
            <span class="product-sales">${p.sales} فروش در ۳۰ روز گذشته</span>
        </div>
    `).join('');
}

// ============================================
// ===== نوتیفیکیشن =====
// ============================================

function showNotification(message) {
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = 'admin-notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ============================================
// ===== سایدبار موبایل =====
// ============================================

window.toggleSidebar = function() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    }
};

// ============================================
// ===== خروج =====
// ============================================

window.logout = function() {
    if (confirm('آیا از خروج از پنل مدیریت مطمئن هستید؟')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockUntil');
        window.location.href = '/admin-panel-login.html';
    }
};

// ============================================
// ===== رویدادهای فرم‌ها =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ===== فرم افزودن محصول =====
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameEl = document.getElementById('prodName');
            const brandEl = document.getElementById('prodBrand');
            const ampEl = document.getElementById('prodAmp');
            const priceEl = document.getElementById('prodPrice');
            const stockEl = document.getElementById('prodStock');
            const minStockEl = document.getElementById('prodMinStock');
            
            const name = nameEl ? nameEl.value.trim() : '';
            const brand = brandEl ? brandEl.value : 'ایران باتری';
            const amp = ampEl ? parseInt(ampEl.value) : 60;
            const price = priceEl ? parseInt(priceEl.value) : 0;
            const stock = stockEl ? parseInt(stockEl.value) : 0;
            const minStock = minStockEl ? parseInt(minStockEl.value) || 5 : 5;
            
            if (!name || !price || isNaN(stock)) {
                alert('❌ لطفاً تمام فیلدها را به درستی پر کنید.');
                return;
            }
            
            const product = {
                name: name,
                brand: brand,
                amp: amp,
                price: price,
                stock: stock,
                minStock: minStock
            };
            
            if (DataService.addProduct(product)) {
                showNotification('✅ محصول جدید با موفقیت اضافه شد');
                closeModal('addProductModal');
                if (addForm) addForm.reset();
                refreshDashboard();
                renderProducts(productsPagination ? productsPagination.currentPage : 1);
            }
        });
    }
    
    // ===== فرم ویرایش محصول =====
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const idEl = document.getElementById('editProductId');
            const nameEl = document.getElementById('editProdName');
            const brandEl = document.getElementById('editProdBrand');
            const ampEl = document.getElementById('editProdAmp');
            const priceEl = document.getElementById('editProdPrice');
            const stockEl = document.getElementById('editProdStock');
            const minStockEl = document.getElementById('editProdMinStock');
            
            const id = idEl ? parseInt(idEl.value) : 0;
            const name = nameEl ? nameEl.value.trim() : '';
            const brand = brandEl ? brandEl.value : 'ایران باتری';
            const amp = ampEl ? parseInt(ampEl.value) : 60;
            const price = priceEl ? parseInt(priceEl.value) : 0;
            const stock = stockEl ? parseInt(stockEl.value) : 0;
            const minStock = minStockEl ? parseInt(minStockEl.value) || 5 : 5;
            
            if (!name || !price || isNaN(stock)) {
                alert('❌ لطفاً تمام فیلدها را به درستی پر کنید.');
                return;
            }
            
            const updates = {
                name: name,
                brand: brand,
                amp: amp,
                price: price,
                stock: stock,
                minStock: minStock
            };
            
            if (DataService.updateProduct(id, updates)) {
                showNotification('✅ محصول با موفقیت ویرایش شد');
                closeModal('editProductModal');
                refreshDashboard();
                renderProducts(productsPagination ? productsPagination.currentPage : 1);
            }
        });
    }
});

// ============================================
// ===== راه‌اندازی =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ===== ناوبری =====
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('pageTitle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const sectionId = this.dataset.section;
            sections.forEach(s => s.classList.remove('active'));
            
            const targetSection = document.getElementById(`section-${sectionId}`);
            if (targetSection) targetSection.classList.add('active');
            
            const titleMap = {
                'dashboard': 'داشبورد مدیریت',
                'products': 'مدیریت محصولات',
                'orders': 'مدیریت سفارشات',
                'customers': 'مدیریت مشتریان',
                'consulting': 'مدیریت مشاوره',
                'reports': 'گزارش‌ها',
                'settings': 'تنظیمات'
            };
            if (pageTitle) pageTitle.textContent = titleMap[sectionId] || 'داشبورد مدیریت';
            
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('adminSidebar');
                const overlay = document.querySelector('.sidebar-overlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
    
    // ===== دکمه‌های نمودار =====
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showNotification(`📊 نمایش داده‌های ${this.textContent}`);
        });
    });
    
    // ===== زمان =====
    function updateTime() {
        const el = document.getElementById('adminTime');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('fa-IR');
        }
    }
    updateTime();
    setInterval(updateTime, 10000);
    
    // ===== سایدبار اوورلی =====
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar;
    document.body.appendChild(overlay);
    
    // ===== بارگذاری اولیه =====
    refreshDashboard();
    initSalesChart();
    
    // ===== کلیک خارج از مودال =====
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    // ===== مدیریت ریسایز =====
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('adminSidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    });
    
    console.log('🚗 داشبورد حرفه‌ای طهران باتری نسخه ۳.۰ راه‌اندازی شد');
    console.log(`📊 ${DataService.getProducts().length} محصول، ${DataService.getOrders().length} سفارش، ${DataService.getCustomers().length} مشتری`);
    
    // ===== تابع رفرش دستی برای همگام‌سازی =====
    window.refreshDashboard = refreshDashboard;
});
