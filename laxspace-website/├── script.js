// 初始化所有动效
document.addEventListener('DOMContentLoaded', function() {
    initCursorFollower();
    initScrollAnimations();
    initMagneticButtons();
    initGalleryHover();
    initFormAnimations();
    initMobileMenu();
    initGalleryFilters();
    initLoadMore();
    initCounters();
    initPageTransitions();
});

// 鼠标跟随效果
function initCursorFollower() {
    const follower = document.querySelector('.cursor-follower');
    if (!follower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // 只在非移动设备上启用鼠标跟随
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateFollower() {
            // 延迟跟随效果
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        }

        animateFollower();

        // 鼠标悬停交互
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .feature-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(1.5)';
                follower.style.background = 'var(--accent-color)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.background = 'var(--primary-color)';
            });
        });
    } else {
        // 在移动设备上隐藏鼠标跟随
        follower.style.display = 'none';
    }
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeUp 0.8s ease forwards';
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.section-title, .feature-card, .gallery-item, .team-member, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 磁性按钮效果
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// 作品展示悬停效果
function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
}

// 表单动画
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });
    
    // 表单提交
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.querySelector('span').textContent;
            
            // 模拟提交过程
            submitButton.querySelector('span').textContent = '发送中...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('感谢您的留言！我们会尽快回复您。');
                contactForm.reset();
                submitButton.querySelector('span').textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// 移动端菜单
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 作品筛选功能
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新激活状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // 筛选作品
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 加载更多功能
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;
    
    let currentItems = 3; // 初始显示的项目数量
    
    loadMoreBtn.addEventListener('click', () => {
        // 模拟加载更多数据
        const galleryGrid = document.querySelector('.gallery-grid');
        const newItems = [
            {
                category: 'web',
                title: '响应式企业网站',
                description: '为制造业公司打造的现代化响应式网站',
                tags: ['网站设计', '响应式']
            },
            {
                category: 'mobile',
                title: '健康追踪应用',
                description: '帮助用户追踪健康数据的移动应用',
                tags: ['移动应用', '健康']
            },
            {
                category: 'branding',
                title: '咖啡品牌设计',
                description: '为精品咖啡店打造的品牌视觉系统',
                tags: ['品牌设计', '餐饮']
            }
        ];
        
        newItems.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'gallery-item';
            newItem.setAttribute('data-category', item.category);
            newItem.style.opacity = '0';
            newItem.style.transform = 'translateY(30px)';
            
            newItem.innerHTML = `
                <div class="gallery-image">
                    <img src="https://picsum.photos/600/400?random=${currentItems + 1}" alt="${item.title}">
                    <div class="gallery-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <button class="view-project">查看项目</button>
                    </div>
                </div>
                <div class="gallery-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="project-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(newItem);
            currentItems++;
            
            // 添加动画
            setTimeout(() => {
                newItem.style.opacity = '1';
                newItem.style.transform = 'translateY(0)';
            }, 100);
            
            // 重新绑定悬停事件
            initGalleryHover();
        });
        
        // 如果达到最大项目数，隐藏加载更多按钮
        if (currentItems >= 9) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// 数字计数动画
function initCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 50;
                const duration = 2000; // 2秒
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, duration / 50);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 页面切换动画
function initPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript"]):not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // 排除管理后台链接
            if (link.getAttribute('href').includes('admin.html')) return;
            
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // 添加页面离开动画
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // 页面加载动画
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 视差效果
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.2 * (index + 1);
            element.style.transform = `translateY(${rate}px) rotate(${rate * 0.1}deg)`;
        });
    });
}

// 初始化视差效果
initParallax();