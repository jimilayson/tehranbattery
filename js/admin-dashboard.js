// ============================================
// ===== لایه سرویس داده (Data Service Layer) =====
// ============================================

/**
 * این لایه به گونه‌ای طراحی شده که با یک تغییر کوچک،
 * از داده‌های شبیه‌سازی به دیتابیس واقعی مهاجرت کند.
 */

// ===== داده‌های شبیه‌سازی (Mock Data) =====
// ⚠️ برای اتصال به دیتابیس واقعی، فقط این بخش را تغییر دهید

const DataService = {
    // ===== دریافت همه محصولات =====
    getProducts: function() {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        return mockProducts;
    },
    
    // ===== دریافت همه سفارشات =====
    getOrders: function() {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        return mockOrders;
    },
    
    // ===== دریافت همه مشتریان =====
    getCustomers: function() {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        return mockCustomers;
    },
    
    // ===== دریافت همه مشاوره‌ها =====
    getConsultings: function() {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        return mockConsultings;
    },
    
    // ===== افزودن محصول جدید =====
    addProduct: function(product) {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        mockProducts.push({
            id: Date.now(),
            ...product,
            createdAt: new Date().toISOString()
        });
        return true;
    },
    
    // ===== ویرایش محصول =====
    updateProduct: function(id, data) {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts[index] = { ...mockProducts[index], ...data };
            return true;
        }
        return false;
    },
    
    // ===== حذف محصول =====
    deleteProduct: function(id) {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        mockProducts = mockProducts.filter(p => p.id !== id);
        return true;
    },
    
    // ===== تغییر وضعیت سفارش =====
    updateOrderStatus: function(id, status) {
        // 🔄 اینجا را برای اتصال به دیتابیس تغییر دهید
        const order = mockOrders.find(o => o.id === id);
        if (order) {
            order.status = status;
            return true;
        }
        return false;
    }
};

// ============================================
// ===== داده‌های نمونه (Mock Data) =====
// ============================================

// محصولات
let mockProducts = [
    { id: 1, name: 'باتری ۶۶ آمپر', brand: 'ایران باتری', amp: 66, price: 5800000, stock: 12, minStock: 5, sales: 128, revenue: 742400000, category: 'باتری' },
    { id: 2, name: 'باتری ۵۵ آمپر', brand: 'سپاهان باتری', amp: 55, price: 4900000, stock: 8, minStock: 5, sales: 78, revenue: 382200000, category: 'باتری' },
    { id: 3, name: 'باتری ۷۴ آمپر', brand: 'بوش', amp: 74, price: 6900000, stock: 2, minStock: 5, sales: 53, revenue: 365700000, category: 'باتری' },
    { id: 4, name: 'باتری ۶۰ آمپر', brand: 'ایران باتری', amp: 60, price: 5200000, stock: 15, minStock: 8, sales: 45, revenue: 234000000, category: 'باتری' },
    { id: 5, name: 'باتری ۴۴ آمپر', brand: 'دنسو', amp: 44, price: 3800000, stock: 6, minStock: 4, sales: 32, revenue: 121600000, category: 'باتری' },
    { id: 6, name: 'باتری ۸۰ آمپر', brand: 'بوش', amp: 80, price: 8500000, stock: 0, minStock: 3, sales: 18, revenue: 153000000, category: 'باتری' },
    { id: 7, name: 'باتری ۱۰۰ آمپر', brand: 'ایران باتری', amp: 100, price: 12000000, stock: 1, minStock: 2, sales: 7, revenue: 84000000, category: 'باتری' },
    { id: 8, name: 'باتری ۵۰ آمپر', brand: 'سپاهان باتری', amp: 50, price: 4200000, stock: 4, minStock: 3, sales: 22, revenue: 92400000, category: 'باتری' },
];

// سفارشات
let mockOrders = [
    { id: 1258, customer: 'علی رضایی', phone: '09123456789', products: ['باتری ۶۶ آمپر'], total: 5800000, status: 'pending', time: '۱۰ دقیقه پیش', items: 1 },
    { id: 1257, customer: 'محمد احمدی', phone: '09129876543', products: ['باتری ۵۵ آمپر'], total: 4900000, status: 'shipping', time: '۲۵ دقیقه پیش', items: 1 },
    { id: 1256, customer: 'رضا کریمی', phone: '09127654321', products: ['باتری ۷۴ آمپر'], total: 6900000, status: 'delivered', time: '۴۵ دقیقه پیش', items: 1 },
    { id: 1255, customer: 'سارا محمدی', phone: '09125432167', products: ['باتری ۶۰ آمپر', 'باتری ۴۴ آمپر'], total: 9000000, status: 'approved', time: '۱ ساعت پیش', items: 2 },
    { id: 1254, customer: 'حسین علی‌پور', phone: '09121987654', products: ['باتری ۶۶ آمپر'], total: 5800000, status: 'preparing', time: '۲ ساعت پیش', items: 1 },
    { id: 1253, customer: 'زهرا کریمی', phone: '09128765432', products: ['باتری ۵۵ آمپر'], total: 4900000, status: 'registered', time: '۳ ساعت پیش', items: 1 },
    { id: 1252, customer: 'امیر حسینی', phone: '09124567890', products: ['باتری ۷۴ آمپر'], total: 6900000, status: 'cancelled', time: '۵ ساعت پیش', items: 1 },
    { id: 1251, customer: 'نازنین احمدی', phone: '09125438765', products: ['باتری ۶۰ آمپر'], total: 5200000, status: 'returned', time: '۶ ساعت پیش', items: 1 },
    { id: 1250, customer: 'محسن رضایی', phone: '09127654389', products: ['باتری ۶۶ آمپر', 'باتری ۵۵ آمپر'], total: 10700000, status: 'delivered', time: '۷ ساعت پیش', items: 2 },
    { id: 1249, customer: 'فاطمه حسینی', phone: '09129876542', products: ['باتری ۴۴ آمپر'], total: 3800000, status: 'shipping', time: '۸ ساعت پیش', items: 1 },
    { id: 1248, customer: 'علی اکبری', phone: '09125432123', products: ['باتری ۸۰ آمپر'], total: 8500000, status: 'pending', time: '۹ ساعت پیش', items: 1 },
    { id: 1247, customer: 'مریم کریمی', phone: '09128765431', products: ['باتری ۶۶ آمپر'], total: 5800000, status: 'delivered', time: '۱۰ ساعت پیش', items: 1 },
];

// مشتریان
let mockCustomers = [
    { name: 'علی رضایی', phone: '09123456789', orders: 5, totalSpent: 29000000, lastOrder: '۱۴۰۵/۰۵/۱۵', status: 'active', joined: '۱۴۰۵/۰۱/۰۵' },
    { name: 'محمد احمدی', phone: '09129876543', orders: 3, totalSpent: 14700000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active', joined: '۱۴۰۵/۰۲/۱۰' },
    { name: 'رضا کریمی', phone: '09127654321', orders: 7, totalSpent: 48300000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active', joined: '۱۴۰۴/۱۲/۱۵' },
    { name: 'سارا محمدی', phone: '09125432167', orders: 2, totalSpent: 18000000, lastOrder: '۱۴۰۵/۰۵/۱۳', status: 'inactive', joined: '۱۴۰۵/۰۳/۲۰' },
    { name: 'حسین علی‌پور', phone: '09121987654', orders: 1, totalSpent: 5800000, lastOrder: '۱۴۰۵/۰۵/۱۲', status: 'new', joined: '۱۴۰۵/۰۵/۱۲' },
    { name: 'زهرا کریمی', phone: '09128765432', orders: 4, totalSpent: 19600000, lastOrder: '۱۴۰۵/۰۵/۱۲', status: 'active', joined: '۱۴۰۴/۱۱/۰۵' },
    { name: 'امیر حسینی', phone: '09124567890', orders: 6, totalSpent: 41400000, lastOrder: '۱۴۰۵/۰۵/۱۱', status: 'active', joined: '۱۴۰۵/۰۱/۲۰' },
];

// درخواست‌های مشاوره
let mockConsultings = [
    { id: 1, customer: 'علی رضایی', car: 'پژو ۲۰۶', model: 'تیپ ۵', year: 1398, suggested: 'باتری ۵۵ آمپر', status: 'new', time: '۵ دقیقه پیش' },
    { id: 2, customer: 'سارا محمدی', car: 'سمند', model: 'LX', year: 1399, suggested: 'باتری ۶۰ آمپر', status: 'reviewing', time: '۱۵ دقیقه پیش' },
    { id: 3, customer: 'رضا کریمی', car: 'تویوتا کرولا', model: '۲۰۲۰', year: 1400, suggested: 'باتری ۷۴ آمپر', status: 'answered', time: '۳۰ دقیقه پیش' },
    { id: 4, customer: 'محمد احمدی', car: 'پژو ۴۰۵', model: 'GLX', year: 1397, suggested: 'باتری ۵۵ آمپر', status: 'new', time: '۴۵ دقیقه پیش' },
    { id: 5, customer: 'زهرا کریمی', car: 'کیا سراتو', model: 'LX', year: 1401, suggested: 'باتری ۶۶ آمپر', status: 'new', time: '۱ ساعت پیش' },
    { id: 6, customer: 'حسین علی‌پور', car: 'رنو تندر', model: '۹۰', year: 1398, suggested: 'باتری ۴۴ آمپر', status: 'reviewing', time: '۲ ساعت پیش' },
];

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
        'returned': 'مرجوع شده'
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
// ===== توابع اصلی داشبورد =====
// ============================================

// ===== 1. بروزرسانی KPI ها =====
function updateKPIs() {
    const products = DataService.getProducts();
    const orders = DataService.getOrders();
    const customers = DataService.getCustomers();
    const consultings = DataService.getConsultings();
    
    // فروش امروز
    const todayOrders = orders.filter(o => o.time.includes('امروز') || o.time.includes('دقیقه') || o.time.includes('ساعت'));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('todayRevenue').textContent = formatPrice(todayRevenue);
    document.getElementById('todayOrders').textContent = todayOrders.length;
    
    // سفارش‌های در انتظار
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'registered');
    document.getElementById('pendingOrders').textContent = pending.length;
    
    // در حال ارسال
    const shipping = orders.filter(o => o.status === 'shipping');
    document.getElementById('shippingOrders').textContent = shipping.length;
    
    // مشتریان جدید (شبیه‌سازی)
    document.getElementById('newCustomers').textContent = Math.floor(Math.random() * 10) + 5;
    
    // باتری‌های فروخته شده
    const batteries = orders.reduce((sum, o) => sum + (o.items || 0), 0);
    document.getElementById('batteriesSold').textContent = batteries;
    
    // موجودی بحرانی
    const critical = products.filter(p => p.stock <= p.minStock);
    document.getElementById('criticalStock').textContent = critical.length;
    
    // لغو و مرجوعی
    const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'returned');
    document.getElementById('cancelledOrders').textContent = cancelled.length;
}

// ===== 2. نمودار فروش =====
let salesChart = null;

function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    const labels = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰', '۱۱', '۱۲', '۱۳', '۱۴', '۱۵', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰', '۲۱', '۲۲', '۲۳', '۲۴', '۲۵', '۲۶', '۲۷', '۲۸', '۲۹', '۳۰'];
    const data = [12, 19, 15, 22, 18, 25, 30, 28, 35, 32, 40, 38, 45, 42, 50, 48, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80, 78, 85, 82];
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'فروش (میلیون تومان)',
                    data: data,
                    borderColor: '#7A8A9E',
                    backgroundColor: 'rgba(122, 138, 158, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#7A8A9E'
                }
            ]
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
    
    // آمار ماهانه
    document.getElementById('monthlySales').textContent = '۱,۲۴۵,۰۰۰,۰۰۰ تومان';
    document.getElementById('monthlyGrowth').textContent = '+۱۲.۴٪ نسبت به ماه قبل';
}

// ===== 3. وضعیت سفارش‌ها =====
function updateOrderStatus() {
    const orders = DataService.getOrders();
    const statuses = ['registered', 'pending', 'approved', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'];
    
    statuses.forEach(status => {
        const count = orders.filter(o => o.status === status).length;
        const el = document.getElementById('status-' + status);
        if (el) el.textContent = count;
    });
}

// ===== 4. فروش بر اساس برند =====
function updateBrandSales() {
    const products = DataService.getProducts();
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    
    const brands = {};
    products.forEach(p => {
        if (!brands[p.brand]) brands[p.brand] = { sales: 0, revenue: 0 };
        brands[p.brand].sales += p.sales;
        brands[p.brand].revenue += p.revenue || (p.sales * p.price);
    });
    
    const container = document.getElementById('brandSales');
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

// ===== 5. فروش بر اساس آمپراژ =====
function updateAmpSales() {
    const products = DataService.getProducts();
    const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
    
    const amps = {};
    products.forEach(p => {
        const key = p.amp + ' آمپر';
        if (!amps[key]) amps[key] = { sales: 0, revenue: 0 };
        amps[key].sales += p.sales;
        amps[key].revenue += p.revenue || (p.sales * p.price);
    });
    
    const container = document.getElementById('ampSales');
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

// ===== 6. پرفروش‌ترین محصولات =====
function updateTopProducts() {
    const products = DataService.getProducts();
    const sorted = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
    
    const container = document.getElementById('topProducts');
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

// ===== 7. هشدار موجودی =====
function updateCriticalStock() {
    const products = DataService.getProducts();
    const critical = products.filter(p => p.stock <= p.minStock);
    
    const container = document.getElementById('criticalStockList');
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

// ===== 8. سفارش‌های اخیر =====
function updateRecentOrders() {
    const orders = DataService.getOrders();
    const recent = [...orders].slice(0, 8);
    
    const tbody = document.getElementById('recentOrders');
    tbody.innerHTML = recent.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${sanitizeHtml(o.customer)}</td>
            <td>${o.products.join('، ')}</td>
            <td>${formatPrice(o.total)}</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
            <td>${o.time}</td>
            <td>
                <button onclick="viewOrder(${o.id})" class="btn-icon" title="مشاهده">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateOrderStatusAction(${o.id})" class="btn-icon" title="تغییر وضعیت">
                    <i class="fas fa-sync"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== 9. درخواست‌های مشاوره =====
function updateConsultings() {
    const consultings = DataService.getConsultings();
    
    // آمار
    document.getElementById('consulting-new').textContent = consultings.filter(c => c.status === 'new').length;
    document.getElementById('consulting-reviewing').textContent = consultings.filter(c => c.status === 'reviewing').length;
    document.getElementById('consulting-answered').textContent = consultings.filter(c => c.status === 'answered').length;
    
    const container = document.getElementById('consultingList');
    const recent = consultings.slice(0, 5);
    
    container.innerHTML = recent.map(c => `
        <div class="consulting-item">
            <div class="consulting-info">
                <span class="consulting-customer">${sanitizeHtml(c.customer)}</span>
                <span class="consulting-car">${c.car} ${c.model}</span>
                <span class="consulting-suggested">پیشنهاد: ${c.suggested}</span>
            </div>
            <span class="consulting-status status-${c.status}">${getStatusLabel(c.status)}</span>
            <span class="consulting-time">${c.time}</span>
        </div>
    `).join('');
}

// ===== 10. هشدارهای سیستم =====
function updateSystemAlerts() {
    const orders = DataService.getOrders();
    const products = DataService.getProducts();
    const consultings = DataService.getConsultings();
    
    const alerts = [];
    
    // سفارشات پرداخت شده ولی ارسال نشده
    const paidNotShipped = orders.filter(o => (o.status === 'approved' || o.status === 'preparing') && !o.shipped);
    if (paidNotShipped.length > 0) {
        alerts.push({
            type: 'danger',
            text: `${paidNotShipped.length} سفارش پرداخت شده ولی هنوز ارسال نشده است`
        });
    }
    
    // محصولات ناموجود
    const outOfStock = products.filter(p => p.stock === 0);
    if (outOfStock.length > 0) {
        alerts.push({
            type: 'danger',
            text: `${outOfStock.length} محصول ناموجود شده است: ${outOfStock.map(p => p.name).join('، ')}`
        });
    }
    
    // موجودی بحرانی
    const critical = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
    if (critical.length > 0) {
        alerts.push({
            type: 'warning',
            text: `${critical.length} محصول به حداقل موجودی رسیده است`
        });
    }
    
    // مشاوره بدون پاسخ
    const noAnswer = consultings.filter(c => c.status === 'new' || c.status === 'reviewing');
    if (noAnswer.length > 0) {
        alerts.push({
            type: 'warning',
            text: `${noAnswer.length} درخواست مشاوره بدون پاسخ وجود دارد`
        });
    }
    
    const container = document.getElementById('systemAlerts');
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

// ===== 11. محصولات کم‌فروش =====
function updateLowSalesProducts() {
    // این تابع در بخش محصولات کم‌فروش استفاده می‌شود
    const products = DataService.getProducts();
    const lowSales = [...products].sort((a, b) => a.sales - b.sales).slice(0, 3);
    
    // فقط برای نمایش در کنسول
    console.log('📉 محصولات کم‌فروش:', lowSales.map(p => `${p.name}: ${p.sales} فروش`).join(', '));
}

// ===== 12. ناوبری بین بخش‌ها =====
function navigateTo(section) {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const targetLink = document.querySelector(`.admin-nav a[data-section="${section}"]`);
    if (targetLink) {
        targetLink.click();
    }
}

function filterOrders(status) {
    const filter = document.getElementById('orderStatusFilter');
    if (filter) {
        filter.value = status;
        filterOrdersByStatus();
    }
    navigateTo('orders');
}

function filterOrdersByStatus() {
    const filter = document.getElementById('orderStatusFilter');
    const status = filter ? filter.value : 'all';
    renderAllOrders(status);
}

// ===== 13. رندر همه سفارشات =====
function renderAllOrders(filter = 'all') {
    const orders = DataService.getOrders();
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    
    const tbody = document.getElementById('allOrdersList');
    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td>${sanitizeHtml(o.customer)}</td>
            <td>${o.products.join('، ')}</td>
            <td>${formatPrice(o.total)}</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
            <td>${o.time}</td>
            <td>
                <button onclick="viewOrder(${o.id})" class="btn-icon" title="مشاهده">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="updateOrderStatusAction(${o.id})" class="btn-icon" title="تغییر وضعیت">
                    <i class="fas fa-sync"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== 14. عملیات سفارشات =====
window.viewOrder = function(id) {
    const orders = DataService.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    alert(`📋 جزئیات سفارش #${order.id}\n\n` +
          `👤 مشتری: ${order.customer}\n` +
          `📱 تماس: ${order.phone}\n` +
          `📦 محصولات: ${order.products.join('، ')}\n` +
          `💰 مبلغ: ${formatPrice(order.total)}\n` +
          `📊 وضعیت: ${getStatusLabel(order.status)}\n` +
          `⏰ زمان: ${order.time}`);
};

window.updateOrderStatusAction = function(id) {
    const orders = DataService.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const statuses = ['registered', 'pending', 'approved', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    
    if (DataService.updateOrderStatus(id, newStatus)) {
        showNotification(`✅ وضعیت سفارش #${id} به "${getStatusLabel(newStatus)}" تغییر یافت`);
        refreshDashboard();
    }
};

// ===== 15. عملیات محصولات =====
window.deleteProduct = function(id) {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    if (DataService.deleteProduct(id)) {
        showNotification('✅ محصول با موفقیت حذف شد');
        refreshDashboard();
        renderProducts();
    }
};

window.editProduct = function(id) {
    const products = DataService.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('نام جدید:', product.name);
    if (newName && newName.trim()) {
        const newPrice = prompt('قیمت جدید:', product.price);
        const newStock = prompt('موجودی جدید:', product.stock);
        const newMinStock = prompt('حداقل موجودی جدید:', product.minStock);
        
        const updates = {
            name: newName.trim(),
            price: parseInt(newPrice) || product.price,
            stock: parseInt(newStock) || product.stock,
            minStock: parseInt(newMinStock) || product.minStock
        };
        
        if (DataService.updateProduct(id, updates)) {
            showNotification('✅ محصول با موفقیت ویرایش شد');
            refreshDashboard();
            renderProducts();
        }
    }
};

// ===== 16. رندر محصولات =====
function renderProducts() {
    const products = DataService.getProducts();
    const tbody = document.getElementById('productList');
    
    tbody.innerHTML = products.map(p => {
        const stockStatus = getStockStatus(p.stock, p.minStock);
        const stockLabel = getStockLabel(p.stock, p.minStock);
        return `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.brand || '-'}</td>
                <td>${p.amp || '-'} آمپر</td>
                <td>${formatPrice(p.price)}</td>
                <td>${p.stock}</td>
                <td><span class="stock-status ${stockStatus}">${stockLabel}</span></td>
                <td>
                    <button onclick="editProduct(${p.id})" class="btn-icon" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${p.id})" class="btn-icon danger" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== 17. رندر مشتریان =====
function renderCustomers() {
    const customers = DataService.getCustomers();
    const tbody = document.getElementById('customerList');
    
    // آمار
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('todayCustomers').textContent = Math.floor(Math.random() * 5) + 2;
    document.getElementById('monthCustomers').textContent = Math.floor(Math.random() * 20) + 10;
    document.getElementById('returnCustomers').textContent = customers.filter(c => c.orders > 1).length;
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td><strong>${sanitizeHtml(c.name)}</strong></td>
            <td>${c.phone}</td>
            <td>${c.orders}</td>
            <td>${formatPrice(c.totalSpent || 0)}</td>
            <td>${c.lastOrder || '-'}</td>
            <td><span class="customer-status ${c.status}">${c.status === 'active' ? 'فعال' : c.status === 'new' ? 'جدید' : 'غیرفعال'}</span></td>
        </tr>
    `).join('');
}

// ===== 18. گزارش‌ها =====
window.generateReport = function(type) {
    const reports = {
        sales: '📊 گزارش فروش: کل فروش ۱,۲۴۵,۰۰۰,۰۰۰ تومان',
        profit: '💰 گزارش سود: سود ناخالص ۲۹۰,۰۰۰,۰۰۰ تومان',
        products: '📦 گزارش محصولات: ۸ محصول فعال، ۲ محصول ناموجود',
        brands: '🏷️ گزارش برندها: ایران باتری ۴۲٪، سپاهان باتری ۲۸٪، بوش ۱۸٪، سایر ۱۲٪'
    };
    alert(reports[type] || 'گزارش در حال آماده‌سازی است...');
};

// ===== 19. مودال افزودن محصول =====
window.showAddProductModal = function() {
    document.getElementById('addProductModal').style.display = 'flex';
};

window.closeModal = function(id) {
    document.getElementById(id).style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('prodName').value.trim();
            const brand = document.getElementById('prodBrand').value;
            const amp = parseInt(document.getElementById('prodAmp').value);
            const price = parseInt(document.getElementById('prodPrice').value);
            const stock = parseInt(document.getElementById('prodStock').value);
            const minStock = parseInt(document.getElementById('prodMinStock').value) || 5;
            
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
                minStock: minStock,
                sales: 0,
                revenue: 0,
                category: 'باتری'
            };
            
            if (DataService.addProduct(product)) {
                showNotification('✅ محصول جدید با موفقیت اضافه شد');
                closeModal('addProductModal');
                this.reset();
                refreshDashboard();
                renderProducts();
            }
        });
    }
});

// ===== 20. نوتفیکیشن =====
function showNotification(message) {
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = 'admin-notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #182333;
        color: #F5F7FA;
        padding: 16px 24px;
        border-radius: 12px;
        border: 1px solid #7A8A9E;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        z-index: 9999;
        font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== 21. رفرش کامل داشبورد =====
function refreshDashboard() {
    updateKPIs();
    updateOrderStatus();
    updateBrandSales();
    updateAmpSales();
    updateTopProducts();
    updateCriticalStock();
    updateRecentOrders();
    updateConsultings();
    updateSystemAlerts();
    renderAllOrders(document.getElementById('orderStatusFilter')?.value || 'all');
}

// ===== 22. ناوبری =====
document.addEventListener('DOMContentLoaded', function() {
    // تنظیم ناوبری
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
                'reports': 'گزارش‌ها',
                'settings': 'تنظیمات'
            };
            if (pageTitle) pageTitle.textContent = titleMap[sectionId] || 'داشبورد مدیریت';
        });
    });
    
    // ===== 23. دکمه‌های نمودار =====
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // در حالت واقعی، داده‌های نمودار تغییر می‌کنند
            showNotification(`📊 نمایش داده‌های ${this.textContent}`);
        });
    });
    
    // ===== 24. زمان =====
    function updateTime() {
        const el = document.getElementById('adminTime');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('fa-IR');
        }
    }
    updateTime();
    setInterval(updateTime, 10000);
    
    // ===== 25. بارگذاری اولیه =====
    refreshDashboard();
    renderProducts();
    renderCustomers();
    initSalesChart();
    
    // ===== 26. کلیک خارج از مودال =====
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    console.log('🚗 داشبورد حرفه‌ای طهران باتری راه‌اندازی شد');
    console.log(`📊 ${DataService.getProducts().length} محصول، ${DataService.getOrders().length} سفارش، ${DataService.getCustomers().length} مشتری`);
    updateLowSalesProducts();
});

// ===== خروج از پنل =====
window.logout = function() {
    if (confirm('آیا از خروج از پنل مدیریت مطمئن هستید؟')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockUntil');
        window.location.href = '/admin-panel-login.html';
    }
};