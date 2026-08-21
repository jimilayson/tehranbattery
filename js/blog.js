// ============================================
// ===== مدیریت مقالات مجله خودرو =====
// ============================================

function getBlogPosts() {
    if (window.App && window.App.database) {
        return window.App.database.data.blogPosts || [];
    }
    try {
        const saved = localStorage.getItem('tehranbattery_database');
        if (saved) {
            const data = JSON.parse(saved);
            return data.blogPosts || [];
        }
    } catch (e) {
        console.warn('⚠️ خطا در دریافت مقالات:', e);
    }
    return [];
}

function renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
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
        const summary = post.summary && post.summary.length > 150 
            ? post.summary.substring(0, 150) + '...' 
            : post.summary || '';
        
        // ===== تصویر مقاله از مسیر ذخیره‌شده خوانده می‌شود =====
        const imageUrl = post.image || 'assets/images/blog-default.jpg';
        
        return `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-image">
                    <img src="${imageUrl}" alt="${post.title}" class="blog-img" data-fallback="${post.title}">
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

function loadBlogPosts() {
    const posts = getBlogPosts();
    renderBlogPosts(posts);
}

function setupBlogFilters() {
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            categoryTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadBlogPosts();
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupBlogFilters();
});
