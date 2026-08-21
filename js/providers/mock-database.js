// ============================================
// ===== دیتابیس شبیه‌سازی با پشتیبانی از localStorage =====
// ============================================

class MockDatabase {
    constructor() {
        // کلید ذخیره‌سازی در localStorage
        this.STORAGE_KEY = 'tehranbattery_database';
        
        // بارگذاری داده‌ها از localStorage یا ایجاد داده‌های پیش‌فرض
        this.data = this.loadData();
    }
    
    /**
     * بارگذاری داده‌ها از localStorage
     */
    loadData() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('💾 داده‌ها از localStorage بارگذاری شدند');
                console.log(`📊 ${parsed.orders?.length || 0} سفارش، ${parsed.customers?.length || 0} مشتری، ${parsed.products?.length || 0} محصول`);
                return parsed;
            }
        } catch (e) {
            console.warn('⚠️ خطا در بارگذاری از localStorage:', e);
        }
        
        // داده‌های پیش‌فرض
        return this.getDefaultData();
    }
    
    /**
     * ذخیره داده‌ها در localStorage
     */
    saveData() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('⚠️ خطا در ذخیره در localStorage:', e);
        }
    }
    
    /**
     * داده‌های پیش‌فرض
     */
    getDefaultData() {
        return {
            products: [
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
            ],
            orders: [],
            customers: [],
            consultings: [
                { 
                    id: 1, 
                    customer: 'علی رضایی', 
                    phone: '09123456789', 
                    car: 'پژو ۲۰۶', 
                    model: 'تیپ ۵', 
                    year: 1398, 
                    suggested: 'باتری ۵۵ آمپر', 
                    status: 'new', 
                    time: '۵ دقیقه پیش', 
                    message: 'سلام. ماشین من پژو ۲۰۶ مدل ۱۳۹۸ هست. باتری ماشین ضعیف شده و نمیدونم چه آمپراژی باید تهیه کنم. راهنمایی می‌خواستم. ممنون.' 
                },
                { 
                    id: 2, 
                    customer: 'سارا محمدی', 
                    phone: '09129876543', 
                    car: 'سمند', 
                    model: 'LX', 
                    year: 1399, 
                    suggested: 'باتری ۶۰ آمپر', 
                    status: 'reviewing', 
                    time: '۱۵ دقیقه پیش', 
                    message: 'سلام. برای سمند مدل ۱۳۹۹ چه باتری مناسب است؟ قیمت و موجودی را هم لطفاً بفرمایید.' 
                },
                { 
                    id: 3, 
                    customer: 'رضا کریمی', 
                    phone: '09127654321', 
                    car: 'تویوتا کرولا', 
                    model: '۲۰۲۰', 
                    year: 1400, 
                    suggested: 'باتری ۷۴ آمپر', 
                    status: 'answered', 
                    time: '۳۰ دقیقه پیش', 
                    message: 'باتری ۷۴ آمپر بوش موجود دارید؟ قیمت چقدر است؟' 
                }
            ],
            // ===== جدید: مقالات مجله =====
            blogPosts: [
                {
                    id: 1,
                    title: 'نگهداری اصولی از باتری خودرو',
                    category: 'نگهداری و تعمیرات',
                    summary: 'نکات طلایی برای افزایش عمر باتری خودرو و جلوگیری از خرابی زودهنگام',
                    content: 'باتری خودرو یکی از مهم‌ترین اجزای آن است که اگر به درستی نگهداری نشود، عمر مفید آن به شدت کاهش می‌یابد. در این مقاله به نکات کلیدی برای افزایش عمر باتری خودرو می‌پردازیم.\n\n۱. بررسی منظم سطح الکترولیت\n۲. تمیز کردن سرپل‌های باتری\n۳. بررسی ولتاژ باتری به صورت دوره‌ای\n۴. جلوگیری از تخلیه کامل باتری\n۵. استفاده از شارژر مناسب در صورت نیاز',
                    image: 'assets/images/blog3.jpg',
                    date: '۲۸ مهر ۱۴۰۵',
                    views: 3456,
                    comments: 21
                },
                {
                    id: 2,
                    title: 'علائم خرابی دینام خودرو',
                    category: 'برق و الکترونیک خودرو',
                    summary: 'شناخت نشانه‌های خرابی دینام و راهکارهای پیشگیری از آسیب به باتری',
                    content: 'دینام خودرو وظیفه تامین برق مورد نیاز خودرو و شارژ باتری را بر عهده دارد. خرابی دینام می‌تواند مشکلات جدی برای خودرو ایجاد کند.\n\nعلائم خرابی دینام:\n۱. روشن شدن چراغ هشدار باتری روی داشبورد\n۲. کاهش نور چراغ‌های جلو\n۳. صدای غیرعادی از موتور\n۴. کاهش عملکرد سیستم‌های الکتریکی\n۵. خالی شدن مکرر باتری',
                    image: 'assets/images/blog2.jpg',
                    date: '۵ آبان ۱۴۰۵',
                    views: 1876,
                    comments: 8
                },
                {
                    id: 3,
                    title: 'راهنمای انتخاب باتری مناسب خودرو',
                    category: 'راهنمای خرید قطعات',
                    summary: 'چگونه باتری مناسب برای خودرو خود انتخاب کنیم؟ راهنمای جامع خرید باتری',
                    content: 'انتخاب باتری مناسب برای خودرو یکی از مهم‌ترین تصمیماتی است که هر راننده باید بگیرد. در این مقاله به شما کمک می‌کنیم تا بهترین باتری را برای خودرو خود انتخاب کنید.\n\n۱. آمپراژ مناسب را بشناسید\n۲. برندهای معتبر را انتخاب کنید\n۳. به تاریخ تولید توجه کنید\n۴. گارانتی را بررسی کنید\n۵. با یک متخصص مشورت کنید',
                    image: 'assets/images/blog1.jpg',
                    date: '۱۲ آبان ۱۴۰۵',
                    views: 2345,
                    comments: 12
                }
            ],
            stats: {
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                todayRevenue: 0,
                todayOrders: 0,
                todayCustomers: 0
            }
        };
    }
    
    // ============================================
    // ===== متدهای سفارش =====
    // ============================================
    
    async saveOrder(order) {
        this.data.orders.push(order);
        this.data.stats.totalOrders = this.data.orders.length;
        this.data.stats.totalRevenue += order.total;
        
        const today = new Date().toDateString();
        if (new Date(order.createdAt).toDateString() === today) {
            this.data.stats.todayOrders++;
            this.data.stats.todayRevenue += order.total;
        }
        
        this.saveData();
        
        console.log('💾 سفارش در دیتابیس ذخیره شد:', order);
        console.log('📊 تعداد کل سفارشات:', this.data.orders.length);
        
        return order;
    }
    
    async getOrder(id) {
        return this.data.orders.find(o => o.id === id) || null;
    }
    
    async getOrderByTrackingCode(trackingCode) {
        return this.data.orders.find(o => o.trackingCode === trackingCode) || null;
    }
    
    async getOrderByTransactionId(transactionId) {
        return this.data.orders.find(o => o.paymentTransactionId === transactionId) || null;
    }
    
    async getOrders(filters = {}) {
        let orders = this.data.orders;
        
        if (filters.status) {
            orders = orders.filter(o => o.status === filters.status);
        }
        if (filters.phone) {
            orders = orders.filter(o => o.customer.phone === filters.phone);
        }
        if (filters.fromDate) {
            orders = orders.filter(o => new Date(o.createdAt) >= new Date(filters.fromDate));
        }
        if (filters.toDate) {
            orders = orders.filter(o => new Date(o.createdAt) <= new Date(filters.toDate));
        }
        
        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    async updateOrder(id, updates) {
        const index = this.data.orders.findIndex(o => o.id === id);
        if (index !== -1) {
            this.data.orders[index] = { ...this.data.orders[index], ...updates };
            this.saveData();
            return this.data.orders[index];
        }
        return null;
    }
    
    // ============================================
    // ===== متدهای محصولات =====
    // ============================================
    
    async getProducts() {
        return this.data.products;
    }
    
    async getProduct(id) {
        return this.data.products.find(p => p.id === id) || null;
    }
    
    async addProduct(product) {
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
        this.data.products.push(newProduct);
        this.saveData();
        return newProduct;
    }
    
    async updateProduct(id, updates) {
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products[index] = { ...this.data.products[index], ...updates };
            this.saveData();
            return this.data.products[index];
        }
        return null;
    }
    
    async deleteProduct(id) {
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }
    
    async updateProductStock(productId, quantity) {
        const product = await this.getProduct(productId);
        if (product) {
            product.stock += quantity;
            this.saveData();
            return product;
        }
        return null;
    }
    
    async incrementProductSales(productId, data) {
        const product = await this.getProduct(productId);
        if (product) {
            product.sales += data.quantity;
            product.revenue += data.revenue;
            this.saveData();
            return product;
        }
        return null;
    }
    
    // ============================================
    // ===== متدهای مشتریان =====
    // ============================================
    
    async getCustomers() {
        return this.data.customers;
    }
    
    async getCustomer(id) {
        return this.data.customers.find(c => c.id === id) || null;
    }
    
    async getCustomerByPhone(phone) {
        return this.data.customers.find(c => c.phone === phone) || null;
    }
    
    async addCustomer(customerData) {
        const customer = {
            id: Date.now(),
            name: customerData.name || 'مهمان',
            phone: customerData.phone || '',
            orders: customerData.orders || 0,
            totalSpent: customerData.totalSpent || 0,
            lastOrder: customerData.lastOrder || new Date().toLocaleDateString('fa-IR'),
            joined: new Date().toLocaleDateString('fa-IR'),
            status: customerData.status || 'new'
        };
        this.data.customers.push(customer);
        this.data.stats.totalCustomers = this.data.customers.length;
        this.saveData();
        return customer;
    }
    
    async updateCustomer(id, updates) {
        const index = this.data.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.customers[index] = { ...this.data.customers[index], ...updates };
            this.saveData();
            return this.data.customers[index];
        }
        return null;
    }
    
    async getCustomerOrders(phone) {
        return this.data.orders.filter(o => o.customer.phone === phone);
    }
    
    // ============================================
    // ===== متدهای مشاوره =====
    // ============================================
    
    async getConsultings() {
        return this.data.consultings;
    }
    
    async addConsulting(consultingData) {
        const consulting = {
            id: Date.now(),
            customer: consultingData.customer || '',
            phone: consultingData.phone || '',
            car: consultingData.car || '',
            model: consultingData.model || '',
            year: consultingData.year || '',
            suggested: consultingData.suggested || '',
            status: 'new',
            time: 'همین الان',
            message: consultingData.message || '',
            createdAt: new Date().toISOString()
        };
        this.data.consultings.push(consulting);
        this.saveData();
        return consulting;
    }
    
    async updateConsultingStatus(id, status) {
        const consulting = this.data.consultings.find(c => c.id === id);
        if (consulting) {
            consulting.status = status;
            this.saveData();
            return consulting;
        }
        return null;
    }
    
    // ============================================
    // ===== متدهای آمار =====
    // ============================================
    
    async getStats() {
        return this.data.stats;
    }
    
    async updateSalesStats(data) {
        this.data.stats.totalRevenue += data.totalRevenue || 0;
        this.data.stats.totalOrders += data.orderCount || 0;
        
        const today = new Date().toDateString();
        if (data.createdAt && new Date(data.createdAt).toDateString() === today) {
            this.data.stats.todayRevenue += data.totalRevenue || 0;
            this.data.stats.todayOrders += data.orderCount || 0;
        }
        this.saveData();
        return this.data.stats;
    }
    
    // ============================================
    // ===== متدهای کمکی =====
    // ============================================
    
    async clearAllData() {
        this.data.orders = [];
        this.data.stats = {
            totalRevenue: 0,
            totalOrders: 0,
            totalCustomers: this.data.customers.length,
            todayRevenue: 0,
            todayOrders: 0,
            todayCustomers: 0
        };
        this.saveData();
        return true;
    }
    
    async getTodayStats() {
        const today = new Date().toDateString();
        const todayOrders = this.data.orders.filter(
            o => new Date(o.createdAt).toDateString() === today
        );
        
        return {
            orders: todayOrders.length,
            revenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
            customers: [...new Set(todayOrders.map(o => o.customer.phone))].length
        };
    }
    
    /**
     * دریافت محصولات با فیلتر
     */
    async getProductsByFilter(filters = {}) {
        let products = this.data.products;
        
        if (filters.brand && filters.brand !== 'all') {
            products = products.filter(p => p.brand === filters.brand);
        }
        if (filters.amp && filters.amp !== 'all') {
            products = products.filter(p => p.amp === parseInt(filters.amp));
        }
        if (filters.inStock) {
            products = products.filter(p => p.stock > 0);
        }
        if (filters.minPrice) {
            products = products.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            products = products.filter(p => p.price <= filters.maxPrice);
        }
        
        return products;
    }
    
    /**
     * دریافت برندهای موجود
     */
    async getBrands() {
        const brands = new Set();
        this.data.products.forEach(p => {
            if (p.brand) brands.add(p.brand);
        });
        return Array.from(brands);
    }
    
    /**
     * دریافت آمپراژهای موجود
     */
    async getAmps() {
        const amps = new Set();
        this.data.products.forEach(p => {
            if (p.amp) amps.add(p.amp);
        });
        return Array.from(amps).sort((a, b) => a - b);
    }
}

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { MockDatabase };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.MockDatabase = MockDatabase;
}
