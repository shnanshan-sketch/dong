// 初始化所有动效
document.addEventListener('DOMContentLoaded', function() {
    initCursorFollower();
    initScrollAnimations();
    initMagneticButtons();
    initGalleryHover();
    initFormAnimations();
    initMobileMenu();
});

// 鼠标跟随效果
function initCursorFollower() {
    const follower = document.querySelector('.cursor-follower');
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
    const animatedElements = document.querySelectorAll('.section-title, .feature-card, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
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

// 页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});