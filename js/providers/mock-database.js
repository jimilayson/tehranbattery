// ============================================
// ===== دیتابیس شبیه‌سازی =====
// ============================================

class MockDatabase {
    constructor() {
        this.data = {
            products: [
                { id: 1, name: 'باتری ۶۶ آمپر', brand: 'ایران باتری', amp: 66, price: 5800000, stock: 12, minStock: 5, sales: 128, revenue: 742400000 },
                { id: 2, name: 'باتری ۵۵ آمپر', brand: 'سپاهان باتری', amp: 55, price: 4900000, stock: 8, minStock: 5, sales: 78, revenue: 382200000 },
                { id: 3, name: 'باتری ۷۴ آمپر', brand: 'بوش', amp: 74, price: 6900000, stock: 2, minStock: 5, sales: 53, revenue: 365700000 },
                { id: 4, name: 'باتری ۶۰ آمپر', brand: 'ایران باتری', amp: 60, price: 5200000, stock: 15, minStock: 8, sales: 45, revenue: 234000000 },
                { id: 5, name: 'باتری ۴۴ آمپر', brand: 'دنسو', amp: 44, price: 3800000, stock: 6, minStock: 4, sales: 32, revenue: 121600000 },
                { id: 6, name: 'باتری ۸۰ آمپر', brand: 'بوش', amp: 80, price: 8500000, stock: 0, minStock: 3, sales: 18, revenue: 153000000 },
                { id: 7, name: 'باتری ۱۰۰ آمپر', brand: 'ایران باتری', amp: 100, price: 12000000, stock: 1, minStock: 2, sales: 7, revenue: 84000000 },
                { id: 8, name: 'باتری ۵۰ آمپر', brand: 'سپاهان باتری', amp: 50, price: 4200000, stock: 4, minStock: 3, sales: 22, revenue: 92400000 },
            ],
            orders: [],
            customers: [
                { id: 1, name: 'علی رضایی', phone: '09123456789', orders: 5, totalSpent: 29000000, lastOrder: '۱۴۰۵/۰۵/۱۵', status: 'active', joined: '۱۴۰۵/۰۱/۰۵' },
                { id: 2, name: 'محمد احمدی', phone: '09129876543', orders: 3, totalSpent: 14700000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active', joined: '۱۴۰۵/۰۲/۱۰' },
                { id: 3, name: 'رضا کریمی', phone: '09127654321', orders: 7, totalSpent: 48300000, lastOrder: '۱۴۰۵/۰۵/۱۴', status: 'active', joined: '۱۴۰۴/۱۲/۱۵' },
                { id: 4, name: 'سارا محمدی', phone: '09125432167', orders: 2, totalSpent: 18000000, lastOrder: '۱۴۰۵/۰۵/۱۳', status: 'inactive', joined: '۱۴۰۵/۰۳/۲۰' },
                { id: 5, name: 'حسین علی‌پور', phone: '09121987654', orders: 1, totalSpent: 5800000, lastOrder: '۱۴۰۵/۰۵/۱۲', status: 'new', joined: '۱۴۰۵/۰۵/۱۲' },
            ],
            stats: {
                totalRevenue: 1245000000,
                totalOrders: 124,
                totalCustomers: 345,
                todayRevenue: 12800000,
                todayOrders: 5,
                todayCustomers: 2
            }
        };
    }
    
    // ===== متدهای سفارش =====
    async saveOrder(order) {
        this.data.orders.push(order);
        this.data.stats.totalOrders++;
        this.data.stats.totalRevenue += order.total;
        
        // به‌روزرسانی آمار امروز
        const today = new Date().toDateString();
        if (new Date(order.createdAt).toDateString() === today) {
            this.data.stats.todayOrders++;
            this.data.stats.todayRevenue += order.total;
        }
        
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
            return this.data.orders[index];
        }
        return null;
    }
    
    // ===== متدهای محصولات =====
    async getProducts() {
        return this.data.products;
    }
    
    async getProduct(id) {
        return this.data.products.find(p => p.id === id) || null;
    }
    
    async addProduct(product) {
        const newProduct = {
            id: Date.now(),
            ...product,
            sales: 0,
            revenue: 0,
            createdAt: new Date().toISOString()
        };
        this.data.products.push(newProduct);
        return newProduct;
    }
    
    async updateProduct(id, updates) {
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products[index] = { ...this.data.products[index], ...updates };
            return this.data.products[index];
        }
        return null;
    }
    
    async deleteProduct(id) {
        const index = this.data.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.products.splice(index, 1);
            return true;
        }
        return false;
    }
    
    async updateProductStock(productId, quantity) {
        const product = await this.getProduct(productId);
        if (product) {
            product.stock += quantity;
            return product;
        }
        return null;
    }
    
    async incrementProductSales(productId, data) {
        const product = await this.getProduct(productId);
        if (product) {
            product.sales += data.quantity;
            product.revenue += data.revenue;
            return product;
        }
        return null;
    }
    
    // ===== متدهای مشتریان =====
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
            ...customerData,
            orders: 0,
            totalSpent: 0,
            joined: new Date().toLocaleDateString('fa-IR'),
            status: 'new'
        };
        this.data.customers.push(customer);
        this.data.stats.totalCustomers++;
        return customer;
    }
    
    async updateCustomer(id, updates) {
        const index = this.data.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.customers[index] = { ...this.data.customers[index], ...updates };
            return this.data.customers[index];
        }
        return null;
    }
    
    async getCustomerOrders(phone) {
        return this.data.orders.filter(o => o.customer.phone === phone);
    }
    
    // ===== متدهای آمار =====
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
        
        return this.data.stats;
    }
    
    // ===== متدهای کمکی =====
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
}

// صادر کردن
if (typeof module !== 'undefined') {
    module.exports = { MockDatabase };
}

// در مرورگر
if (typeof window !== 'undefined') {
    window.MockDatabase = MockDatabase;
}