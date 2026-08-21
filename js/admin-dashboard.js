// ============================================
// ===== رویدادهای فرم‌ها =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== تبدیل خودکار اعداد فارسی به انگلیسی در فیلدهای عددی =====
    const numberInputs = document.querySelectorAll('#prodPrice, #prodStock, #prodMinStock, #editProdPrice, #editProdStock, #editProdMinStock, #editProdAmp, #prodAmp');
    numberInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                this.value = toEnglishNumber(this.value);
            });
        }
    });
    
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
            // ✅ تبدیل اعداد فارسی به انگلیسی
            const amp = ampEl ? parseInt(toEnglishNumber(ampEl.value)) || 60 : 60;
            const price = priceEl ? parseInt(toEnglishNumber(priceEl.value)) || 0 : 0;
            const stock = stockEl ? parseInt(toEnglishNumber(stockEl.value)) || 0 : 0;
            const minStock = minStockEl ? parseInt(toEnglishNumber(minStockEl.value)) || 5 : 5;
            
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
            // ✅ تبدیل اعداد فارسی به انگلیسی
            const amp = ampEl ? parseInt(toEnglishNumber(ampEl.value)) || 60 : 60;
            const price = priceEl ? parseInt(toEnglishNumber(priceEl.value)) || 0 : 0;
            const stock = stockEl ? parseInt(toEnglishNumber(stockEl.value)) || 0 : 0;
            const minStock = minStockEl ? parseInt(toEnglishNumber(minStockEl.value)) || 5 : 5;
            
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
