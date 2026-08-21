// ============================================
// ===== مدیریت مقالات مجله خودرو =====
// ============================================

/**
 * بارگذاری مقالات از دیتابیس
 */
function loadBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    // دریافت مقالات از دیتابیس
    let posts = [];
    
    if (window.App && window.App.database) {
        posts = window.App.database.data.blogPosts || [];
    } else {
        try {
            const saved = localStorage.getItem('tehranbattery_database');
            if (saved) {
                const data = JSON.parse(saved);
                posts = data.blogPosts || [];
            }
        } catch (e) {
            console.warn('⚠️ خطا در بارگذاری مقالات:', e);
        }
    }
    
    // اگر مقاله‌ای وجود نداشت، مقالات پیش‌فرض را اضافه کن
    if (posts.length === 0) {
        posts = getDefaultBlogPosts();
        if (window.App && window.App.database) {
            window.App.database.data.blogPosts = posts;
            window.App.database.saveData();
        } else {
            try {
                const saved = localStorage.getItem('tehranbattery_database');
                if (saved) {
                    const data = JSON.parse(saved);
                    data.blogPosts = posts;
                    localStorage.setItem('tehranbattery_database', JSON.stringify(data));
                }
            } catch (e) {
                console.warn('⚠️ خطا در ذخیره مقالات پیش‌فرض:', e);
            }
        }
    }
    
    renderBlogPosts(posts);
}

/**
 * مقالات پیش‌فرض (در صورت خالی بودن دیتابیس)
 */
function getDefaultBlogPosts() {
    return [
        {
            id: 1,
            title: 'نگهداری اصولی از باتری خودرو',
            summary: 'نکات طلایی برای افزایش عمر باتری خودرو و جلوگیری از خرابی زودهنگام',
            content: 'متن کامل مقاله...',
            category: 'باتری و سیستم شارژ',
            image: 'assets/images/blog3.jpg',
            date: '۲۸ مهر ۱۴۰۵',
            views: 3456,
            comments: 21
        },
        {
            id: 2,
            title: 'علائم خرابی دینام خودرو',
            summary: 'شناخت نشانه‌های خرابی دینام و راهکارهای پیشگیری از آسیب به باتری',
            content: 'متن کامل مقاله...',
            category: 'برق و الکترونیک خودرو',
            image: 'assets/images/blog2.jpg',
            date: '۵ آبان ۱۴۰۵',
            views: 1876,
            comments: 8
        },
        {
            id: 3,
            title: 'راهنمای انتخاب باتری مناسب خودرو',
            summary: 'چگونه باتری مناسب برای خودرو خود انتخاب کنیم؟ راهنمای جامع خرید',
            content: 'متن کامل مقاله...',
            category: 'راهنمای خرید قطعات',
            image: 'assets/images/blog1.jpg',
            date: '۱۲ آبان ۱۴۰۵',
            views: 2345,
            comments: 12
        }
    ];
}

/**
 * رندر مقالات در صفحه
 */
function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    // فیلتر بر اساس دسته‌بندی
    const activeCategory = document.querySelector('.category-tag.active');
    const category = activeCategory ? activeCategory.textContent.trim() : 'همه';
    
    let filteredPosts = posts;
    if (category !== 'همه') {
        filteredPosts = posts.filter(p => p.category === category);
    }
    
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fas fa-newspaper" style="font-size: 48px; display: block; margin-bottom: 16px; color: var(--primary);"></i>
                <h3 style="color: var(--text-primary);">هیچ مقاله‌ای در این دسته‌بندی یافت نشد</h3>
                <p>به زودی مقالات جدیدی در این دسته منتشر می‌شود</p>
            </div>
        `;
        return;
    }
    
    blogGrid.innerHTML = filteredPosts.map(post => {
        // محدود کردن خلاصه به ۱۵۰ کاراکتر
        const summary = post.summary && post.summary.length > 150 
            ? post.summary.substring(0, 150) + '...' 
            : post.summary || '';
        
        return `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-image">
                    <img src="${post.image || 'assets/images/blog-default.jpg'}" alt="${post.title}" class="blog-img" data-fallback="${post.title}">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date}</span>
                </div>
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p>${summary}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-eye"></i> ${post.views || 0} بازدید</span>
                        <span><i class="far fa-comment"></i> ${post.comments || 0} نظر</span>
                    </div>
                    <a href="blog-post.html?id=${post.id}" class="blog-link">
                        مطالعه مقاله <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </article>
        `;
    }).join('');
}

/**
 * فیلتر مقالات بر اساس دسته‌بندی
 */
function setupBlogFilters() {
    const categoryTags = document.querySelectorAll('.category-tag');
    
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            categoryTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // بارگذاری مجدد مقالات با فیلتر جدید
            loadBlogPosts();
        });
    });
}

// ============================================
// ===== بارگذاری اولیه =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupBlogFilters();
});
