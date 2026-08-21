// ============================================
// ===== صفحه داخلی مقاله =====
// ============================================

(function() {
    'use strict';
    
    function getPostId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }
    
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
    
    function loadPost() {
        const postId = getPostId();
        const container = document.getElementById('articleContent');
        
        if (!postId) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; display: block; margin-bottom: 16px; color: var(--danger);"></i>
                    <h3 style="color: var(--text-primary);">مقاله‌ای یافت نشد</h3>
                    <p>لطفاً از طریق مجله خودرو به مقاله‌ها دسترسی پیدا کنید</p>
                    <a href="index.html#blog" class="btn-primary" style="display: inline-block; margin-top: 16px;">
                        <i class="fas fa-arrow-right"></i> بازگشت به مجله
                    </a>
                </div>
            `;
            return;
        }
        
        const posts = getBlogPosts();
        const post = posts.find(p => p.id === parseInt(postId));
        
        if (!post) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="fas fa-file-alt" style="font-size: 48px; display: block; margin-bottom: 16px; color: var(--primary);"></i>
                    <h3 style="color: var(--text-primary);">مقاله مورد نظر یافت نشد</h3>
                    <p>این مقاله ممکن است حذف شده باشد یا به درستی بارگذاری نشده است</p>
                    <a href="index.html#blog" class="btn-primary" style="display: inline-block; margin-top: 16px;">
                        <i class="fas fa-arrow-right"></i> بازگشت به مجله
                    </a>
                </div>
            `;
            return;
        }
        
        renderPost(post, container);
    }
    
    function renderPost(post, container) {
        const paragraphs = post.content ? post.content.split('\n').filter(p => p.trim()) : [];
        const imageUrl = post.image || 'assets/images/blog-default.jpg';
        
        container.innerHTML = `
            <div class="article-image">
                <img src="${imageUrl}" alt="${post.title}" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22450%22%3E%3Crect width=%22800%22 height=%22450%22 fill=%22%23243247%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%237A8A9E%22 font-size=%2228%22 font-family=%22Vazirmatn, Tahoma, sans-serif%22%3E${post.title}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="article-meta">
                <span class="category-badge">${post.category}</span>
                <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                <span><i class="far fa-eye"></i> ${post.views || 0} بازدید</span>
                <span><i class="far fa-comment"></i> ${post.comments || 0} نظر</span>
            </div>
            <h1 class="article-title">${post.title}</h1>
            <div class="article-content">
                ${paragraphs.map(p => `<p>${p}</p>`).join('')}
            </div>
        `;
        
        document.title = `${post.title} | طهران باتری`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        loadPost();
    });
})();
