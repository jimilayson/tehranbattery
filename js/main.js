// ===== HELPER: SANITIZE INPUTS (جلوگیری از XSS) =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== WAIT FOR DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ===== MENU TOGGLE (hamburger) =====
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (navMenu && !e.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // ===== IMAGE ERROR HANDLING =====
    // ============================================
    document.querySelectorAll('.product-img, .cert-img').forEach(img => {
        img.addEventListener('error', function() {
            const rawFallbackText = this.getAttribute('data-fallback') || 'تصویر';
            const cleanText = escapeHtml(rawFallbackText);
            
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                    <rect width="200" height="200" fill="#243247"/>
                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                          fill="#1677FF" font-size="24" font-family="Vazirmatn, Tahoma, sans-serif">
                        ${cleanText}
                    </text>
                </svg>
            `;
            this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        });
    });

    document.querySelectorAll('.blog-image img').forEach(img => {
        img.addEventListener('error', function() {
            const rawFallbackText = this.getAttribute('data-fallback') || 'مطلب';
            const cleanText = escapeHtml(rawFallbackText);
            
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
                    <rect width="300" height="200" fill="#243247"/>
                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                          fill="#1677FF" font-size="28" font-family="Vazirmatn, Tahoma, sans-serif">
                        ${cleanText}
                    </text>
                </svg>
            `;
            this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        });
    });

    // ============================================
    // ===== BACK TO TOP BUTTON =====
    // ============================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // ===== SMOOTH SCROLL با آفست داینامیک =====
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                if (navMenu) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ===== TRACK FORM =====
    // ============================================
    const trackForm = document.getElementById('trackForm');
    const trackResult = document.getElementById('trackResult');

    if (trackForm && trackResult) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const codeInput = document.getElementById('trackCode');
            const code = codeInput ? codeInput.value.trim() : '';
            
            trackResult.textContent = '';
            
            if (!code) {
                const errSpan = document.createElement('span');
                errSpan.style.color = '#FF4D4D';
                errSpan.style.display = 'block';
                errSpan.style.padding = 'var(--spacing-md)';
                errSpan.style.background = 'rgba(255, 77, 77, 0.1)';
                errSpan.style.borderRadius = 'var(--radius-md)';
                errSpan.textContent = 'لطفاً کد پیگیری را وارد کنید.';
                trackResult.appendChild(errSpan);
                return;
            }
            
            const successSpan = document.createElement('span');
            successSpan.style.color = '#1677FF';
            successSpan.style.display = 'block';
            successSpan.style.padding = 'var(--spacing-md)';
            successSpan.style.background = 'rgba(22, 119, 255, 0.1)';
            successSpan.style.borderRadius = 'var(--radius-md)';
            successSpan.textContent = `✅ وضعیت تعمیر کد ${escapeHtml(code)}: در حال انجام (تخمین ۲ روز دیگر)`;
            trackResult.appendChild(successSpan);
        });
    }

    // ============================================
    // ===== CONTACT FORM =====
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#FF4D4D';
                    input.style.boxShadow = '0 0 0 3px rgba(255, 77, 77, 0.2)';
                } else {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }
            });
            
            if (!isValid) {
                alert('لطفاً تمام فیلدهای الزامی را پر کنید.');
                return;
            }
            
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('✅ پیام شما با موفقیت ارسال شد.\nکارشناسان ما به زودی با شما تماس می‌گیرند.');
                this.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                inputs.forEach(input => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
            }, 1000);
        });
    }

    // ============================================
    // ===== NEWSLETTER FORM =====
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const email = input ? input.value.trim() : '';
            
            if (!email || !email.includes('@')) {
                alert('لطفاً یک ایمیل معتبر وارد کنید.');
                return;
            }
            
            alert('✅ با موفقیت در خبرنامه عضو شدید.');
            this.reset();
        });
    }

    // ============================================
    // ===== ORDER BUTTONS =====
    // ============================================
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-info')?.querySelector('h4')?.textContent || 'قطعه';
            alert(`✅ سفارش "${productName}" با موفقیت ثبت شد.\nکارشناسان ما برای تکمیل سفارش با شما تماس می‌گیرند.`);
        });
    });

    // ============================================
    // ===== BLOG CATEGORY FILTER =====
    // ============================================
    const categoryTags = document.querySelectorAll('.category-tag');
    
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            categoryTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent.trim();
            if (category === 'همه') {
                document.querySelectorAll('.blog-card').forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.blog-card').forEach(card => {
                    const cardCategory = card.querySelector('.blog-category')?.textContent.trim() || '';
                    card.style.display = cardCategory === category ? 'block' : 'none';
                });
            }
        });
    });

    // ============================================
    // ===== SHOP FILTERS =====
    // ============================================
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // در اینجا می‌توانید منطق فیلتر کردن محصولات را پیاده‌سازی کنید
            console.log('فیلتر انتخاب شد:', this.value);
        });
    });

    // ============================================
    // ===== SCROLL ANIMATIONS =====
    // ============================================
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.card, .product-card, .blog-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        document.querySelectorAll('.stat-item, .about-feature, .trust-badge').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    console.log('🚗 طهران باتری - نسخه ۴.۰ با سیستم رنگی جدید Electric Blue');
});