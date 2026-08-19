// ============================================
// ===== امنیت پنل ادمین =====
// ============================================

(function() {
    'use strict';
    
    // ===== بررسی توکن =====
    function checkAdminAuth() {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
            window.location.href = '/admin-panel-login.html';
            return false;
        }
        
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('توکن نامعتبر');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            
            if (payload.exp && Date.now() > payload.exp) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin-panel-login.html';
                return false;
            }
            
            return true;
            
        } catch (error) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin-panel-login.html';
            return false;
        }
    }
    
    // ===== خروج =====
    window.logout = function() {
        if (confirm('آیا از خروج از پنل مدیریت مطمئن هستید؟')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockUntil');
            window.location.href = '/admin-panel-login.html';
        }
    };
    
    // ===== اعمال امنیت =====
    function applySecurity() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && ['s', 'u', 'c'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // ===== داده‌های شبیه‌سازی شده =====
    let mockProducts = [
        { id: 1, name: 'باتری ۶۰ آمپر', price: 2500000, stock: 10, category: 'باتری' },
        { id: 2, name: 'دینام خودرو', price: 4800000, stock: 5, category: 'برقی' },
        { id: 3, name: 'استارت ۱۲ ولت', price: 3200000, stock: 8, category: 'برقی' },
        { id: 4, name: 'کمپرسور کولر', price: 5500000, stock: 3, category: 'کولر' },
    ];
    
    let mockOrders = [
        { id: 1001, customer: 'علی محمدی', phone: '09123456789', total: 2500000, status: 'processing' },
        { id: 1002, customer: 'سارا رضایی', phone: '09129876543', total: 4800000, status: 'completed' },
        { id: 1003, customer: 'محمد کریمی', phone: '09127654321', total: 3200000, status: 'pending' },
        { id: 1004, customer: 'زهرا احمدی', phone: '09125432167', total: 5500000, status: 'cancelled' },
    ];
    
    let mockCustomers = [
        { name: 'علی محمدی', phone: '09123456789', orders: 3, joined: '۱۴۰۵/۰۱/۱۵' },
        { name: 'سارا رضایی', phone: '09129876543', orders: 2, joined: '۱۴۰۵/۰۲/۲۰' },
        { name: 'محمد کریمی', phone: '09127654321', orders: 5, joined: '۱۴۰۴/۱۲/۰۵' },
        { name: 'زهرا احمدی', phone: '09125432167', orders: 1, joined: '۱۴۰۵/۰۳/۱۰' },
    ];
    
    // ===== نمایش محصولات =====
    function renderProducts() {
        const tbody = document.getElementById('productList');
        if (!tbody) return;
        
        tbody.innerHTML = mockProducts.map(p => `
            <tr>
                <td>${sanitizeHtml(p.name)}</td>
                <td>${p.price.toLocaleString()} تومان</td>
                <td>${p.stock}</td>
                <td>${sanitizeHtml(p.category)}</td>
                <td>
                    <button onclick="editProduct(${p.id})" class="btn-icon" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${p.id})" class="btn-icon danger" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // ===== نمایش سفارشات =====
    function renderOrders(filter = 'all') {
        const tbody = document.getElementById('orderList');
        if (!tbody) return;
        
        const filtered = filter === 'all' 
            ? mockOrders 
            : mockOrders.filter(o => o.status === filter);
        
        const statusMap = {
            'pending': 'در انتظار',
            'processing': 'در حال انجام',
            'completed': 'تکمیل شده',
            'cancelled': 'لغو شده'
        };
        
        const statusClass = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        
        tbody.innerHTML = filtered.map(o => `
            <tr>
                <td><strong>#TRK-${o.id}</strong></td>
                <td>${sanitizeHtml(o.customer)}</td>
                <td>${o.total.toLocaleString()} تومان</td>
                <td><span class="status-badge ${statusClass[o.status]}">${statusMap[o.status]}</span></td>
                <td>
                    <button onclick="viewOrder(${o.id})" class="btn-icon" title="مشاهده">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="updateOrderStatus(${o.id})" class="btn-icon" title="تغییر وضعیت">
                        <i class="fas fa-sync"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // ===== نمایش مشتریان =====
    function renderCustomers() {
        const tbody = document.getElementById('customerList');
        if (!tbody) return;
        
        tbody.innerHTML = mockCustomers.map(c => `
            <tr>
                <td>${sanitizeHtml(c.name)}</td>
                <td>${c.phone}</td>
                <td>${c.orders}</td>
                <td>${c.joined}</td>
            </tr>
        `).join('');
    }
    
    // ===== توابع کمکی =====
    function sanitizeHtml(str) {
        if (typeof str !== 'string') return str;
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // ===== عملیات محصولات =====
    window.deleteProduct = function(id) {
        if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
        mockProducts = mockProducts.filter(p => p.id !== id);
        renderProducts();
        updateStats();
        showNotification('✅ محصول با موفقیت حذف شد');
    };
    
    window.editProduct = function(id) {
        const product = mockProducts.find(p => p.id === id);
        if (!product) return;
        
        const newName = prompt('نام جدید:', product.name);
        if (newName !== null && newName.trim()) {
            product.name = sanitizeHtml(newName.trim());
        }
        
        const newPrice = prompt('قیمت جدید:', product.price);
        if (newPrice !== null && !isNaN(newPrice)) {
            product.price = parseInt(newPrice);
        }
        
        const newStock = prompt('موجودی جدید:', product.stock);
        if (newStock !== null && !isNaN(newStock)) {
            product.stock = parseInt(newStock);
        }
        
        renderProducts();
        updateStats();
        showNotification('✅ محصول با موفقیت ویرایش شد');
    };
    
    window.showAddProductModal = function() {
        document.getElementById('addProductModal').style.display = 'block';
    };
    
    window.closeModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };
    
    // ===== افزودن محصول =====
    document.addEventListener('DOMContentLoaded', function() {
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('prodName').value.trim();
                const price = parseInt(document.getElementById('prodPrice').value);
                const stock = parseInt(document.getElementById('prodStock').value);
                const category = document.getElementById('prodCategory').value;
                
                if (!name || !price || isNaN(stock)) {
                    alert('لطفاً تمام فیلدها را به درستی پر کنید.');
                    return;
                }
                
                const newProduct = {
                    id: Date.now(),
                    name: sanitizeHtml(name),
                    price: price,
                    stock: stock,
                    category: category
                };
                
                mockProducts.push(newProduct);
                renderProducts();
                updateStats();
                closeModal('addProductModal');
                this.reset();
                showNotification('✅ محصول جدید با موفقیت اضافه شد');
            });
        }
    });
    
    // ===== عملیات سفارشات =====
    window.viewOrder = function(id) {
        const order = mockOrders.find(o => o.id === id);
        if (!order) return;
        
        alert(`📋 جزئیات سفارش #TRK-${order.id}\n\n` +
              `👤 مشتری: ${order.customer}\n` +
              `📱 تماس: ${order.phone}\n` +
              `💰 مبلغ: ${order.total.toLocaleString()} تومان\n` +
              `📊 وضعیت: ${order.status}`);
    };
    
    window.updateOrderStatus = function(id) {
        const order = mockOrders.find(o => o.id === id);
        if (!order) return;
        
        const statuses = ['pending', 'processing', 'completed', 'cancelled'];
        const currentIndex = statuses.indexOf(order.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        order.status = statuses[nextIndex];
        
        renderOrders(document.getElementById('orderStatusFilter')?.value || 'all');
        updateStats();
        showNotification(`✅ وضعیت سفارش #TRK-${id} به ${order.status} تغییر یافت`);
    };
    
    window.filterOrders = function() {
        const filter = document.getElementById('orderStatusFilter')?.value || 'all';
        renderOrders(filter);
    };
    
    // ===== آمار =====
    function updateStats() {
        const totalOrders = document.getElementById('totalOrders');
        const totalProducts = document.getElementById('totalProducts');
        const totalCustomers = document.getElementById('totalCustomers');
        const totalSales = document.getElementById('totalSales');
        
        if (totalOrders) totalOrders.textContent = mockOrders.length;
        if (totalProducts) totalProducts.textContent = mockProducts.length;
        if (totalCustomers) totalCustomers.textContent = mockCustomers.length;
        
        const sales = mockOrders.reduce((sum, o) => sum + o.total, 0);
        if (totalSales) totalSales.textContent = sales.toLocaleString();
    }
    
    // ===== نوتیفیکیشن =====
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
    
    // ===== زمان =====
    function updateTime() {
        const el = document.getElementById('adminTime');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('fa-IR');
        }
    }
    
    // ===== ناوبری =====
    document.addEventListener('DOMContentLoaded', function() {
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
                
                if (pageTitle) {
                    const titleMap = {
                        'dashboard': 'داشبورد مدیریت',
                        'products': 'مدیریت محصولات',
                        'orders': 'مدیریت سفارشات',
                        'customers': 'مدیریت مشتریان',
                        'settings': 'تنظیمات'
                    };
                    pageTitle.textContent = titleMap[sectionId] || 'داشبورد مدیریت';
                }
            });
        });
        
        // بارگذاری اولیه
        renderProducts();
        renderOrders();
        renderCustomers();
        updateStats();
        updateTime();
        setInterval(updateTime, 10000);
    });
    
    // ===== اجرای امنیت =====
    if (!checkAdminAuth()) {
        return;
    }
    applySecurity();
    
    // ===== کلیک خارج از مودال =====
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    console.log('🔐 پنل ادمین امن است');
    console.log(`📦 ${mockProducts.length} محصول, ${mockOrders.length} سفارش`);
    
})();