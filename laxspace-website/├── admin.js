// 管理后台功能
class AdminManager {
    constructor() {
        this.pages = JSON.parse(localStorage.getItem('websitePages')) || [
            {
                title: '首页',
                url: 'index.html',
                description: '网站主页面',
                template: 'default',
                protected: true
            },
            {
                title: '关于我们',
                url: 'about.html',
                description: '公司介绍页面',
                template: 'default',
                protected: false
            },
            {
                title: '服务',
                url: 'services.html',
                description: '服务介绍页面',
                template: 'default',
                protected: false
            },
            {
                title: '作品展示',
                url: 'gallery.html',
                description: '作品集页面',
                template: 'gallery',
                protected: false
            },
            {
                title: '联系我们',
                url: 'contact.html',
                description: '联系信息页面',
                template: 'default',
                protected: false
            }
        ];
        
        this.assets = JSON.parse(localStorage.getItem('websiteAssets')) || [];
        this.settings = JSON.parse(localStorage.getItem('websiteSettings')) || {
            siteTitle: '动效创意网站',
            siteDescription: '创造非凡的数字体验',
            primaryColor: '#6C63FF',
            accentColor: '#FF6584'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPagesList();
        this.renderAssetsList();
        this.loadSettings();
        this.setupTabNavigation();
    }

    setupEventListeners() {
        // 添加页面表单提交
        const addPageForm = document.getElementById('addPageForm');
        if (addPageForm) {
            addPageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPage();
            });
        }

        // 素材上传
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        
        if (uploadArea && fileInput && uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.background = 'rgba(108, 99, 255, 0.05)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#e0e0e0';
                uploadArea.style.background = 'transparent';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e0e0e0';
                uploadArea.style.background = 'transparent';
                
                if (e.dataTransfer.files.length > 0) {
                    this.handleFiles(e.dataTransfer.files);
                }
            });
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFiles(e.target.files);
                }
            });
        }

        // 网站设置表单
        const siteSettingsForm = document.getElementById('siteSettingsForm');
        if (siteSettingsForm) {
            siteSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
    }

    setupTabNavigation() {
        const navItems = document.querySelectorAll('.admin-nav-item');
        const tabContents = document.querySelectorAll('.tab-content');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                
                // 更新激活状态
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                // 显示对应内容
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    addPage() {
        const title = document.getElementById('pageTitle').value;
        const url = document.getElementById('pageUrl').value;
        const description = document.getElementById('pageDescription').value;
        const template = document.getElementById('pageTemplate').value;

        // 基本验证
        if (!title || !url) {
            alert('请填写页面标题和URL');
            return;
        }

        // 检查URL是否已存在
        if (this.pages.find(page => page.url === url)) {
            alert('该URL已存在，请使用其他URL');
            return;
        }

        const newPage = {
            title,
            url,
            description,
            template,
            protected: false
        };

        this.pages.push(newPage);
        this.savePages();
        this.renderPagesList();

        // 清空表单
        document.getElementById('addPageForm').reset();

        alert(`页面 "${title}" 创建成功！`);
    }

    deletePage(url) {
        if (confirm('确定要删除这个页面吗？此操作不可恢复。')) {
            this.pages = this.pages.filter(page => page.url !== url);
            this.savePages();
            this.renderPagesList();
            alert('页面删除成功！');
        }
    }

    editPage(url) {
        const page = this.pages.find(page => page.url === url);
        if (page) {
            // 填充表单
            document.getElementById('pageTitle').value = page.title;
            document.getElementById('pageUrl').value = page.url;
            document.getElementById('pageDescription').value = page.description;
            document.getElementById('pageTemplate').value = page.template;

            // 临时修改表单行为为更新
            const form = document.getElementById('addPageForm');
            const originalSubmit = form.onsubmit;
            
            form.onsubmit = (e) => {
                e.preventDefault();
                this.updatePage(url);
                form.onsubmit = originalSubmit;
                
                // 恢复按钮文本
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> 创建页面';
            };

            // 修改按钮文本
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> 更新页面';
        }
    }

    updatePage(oldUrl) {
        const title = document.getElementById('pageTitle').value;
        const url = document.getElementById('pageUrl').value;
        const description = document.getElementById('pageDescription').value;
        const template = document.getElementById('pageTemplate').value;

        const pageIndex = this.pages.findIndex(page => page.url === oldUrl);
        if (pageIndex !== -1) {
            this.pages[pageIndex] = {
                ...this.pages[pageIndex],
                title,
                url,
                description,
                template
            };

            this.savePages();
            this.renderPagesList();

            // 重置表单
            document.getElementById('addPageForm').reset();

            alert('页面更新成功！');
        }
    }

    renderPagesList() {
        const pagesList = document.getElementById('pagesList');
        if (!pagesList) return;
        
        pagesList.innerHTML = '';

        this.pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'list-item';
            pageItem.innerHTML = `
                <div>
                    <h4>${page.title}</h4>
                    <p>${page.url} - ${page.description}</p>
                </div>
                <div class="list-actions">
                    <button class="btn btn-primary" onclick="adminManager.editPage('${page.url}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-danger" onclick="adminManager.deletePage('${page.url}')" 
                        ${page.protected ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            pagesList.appendChild(pageItem);
        });
    }

    handleFiles(files) {
        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        uploadProgress.style.display = 'block';
        
        Array.from(files).forEach((file, index) => {
            // 验证文件类型和大小
            if (!file.type.match('image.*')) {
                alert('只支持图片文件');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('文件大小不能超过5MB');
                return;
            }
            
            // 模拟上传进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // 文件上传完成
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const newAsset = {
                            id: Date.now() + index,
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            url: e.target.result,
                            uploadedAt: new Date().toISOString()
                        };
                        
                        this.assets.push(newAsset);
                        this.saveAssets();
                        this.renderAssetsList();
                        
                        // 如果是最后一个文件，隐藏进度条
                        if (index === files.length - 1) {
                            setTimeout(() => {
                                uploadProgress.style.display = 'none';
                            }, 1000);
                        }
                    };
                    reader.readAsDataURL(file);
                }
                
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `上传中... ${progress}%`;
            }, 50);
        });
    }

    deleteAsset(assetId) {
        if (confirm('确定要删除这个素材吗？此操作不可恢复。')) {
            this.assets = this.assets.filter(asset => asset.id !== assetId);
            this.saveAssets();
            this.renderAssetsList();
            alert('素材删除成功！');
        }
    }

    renderAssetsList() {
        const assetsList = document.getElementById('assetsList');
        if (!assetsList) return;
        
        assetsList.innerHTML = '';

        if (this.assets.length === 0) {
            assetsList.innerHTML = '<p>暂无素材，请上传</p>';
            return;
        }

        this.assets.forEach(asset => {
            const assetItem = document.createElement('div');
            assetItem.className = 'preview-item';
            assetItem.innerHTML = `
                <img src="${asset.url}" alt="${asset.name}">
                <div class="preview-actions">
                    <button onclick="adminManager.copyAssetUrl(${asset.id})" title="复制链接">
                        <i class="fas fa-link"></i>
                    </button>
                    <button onclick="adminManager.deleteAsset(${asset.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            assetsList.appendChild(assetItem);
        });
    }

    copyAssetUrl(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (asset) {
            navigator.clipboard.writeText(asset.url)
                .then(() => alert('素材链接已复制到剪贴板'))
                .catch(() => alert('复制失败，请手动复制'));
        }
    }

    loadSettings() {
        document.getElementById('siteTitle').value = this.settings.siteTitle;
        document.getElementById('siteDescription').value = this.settings.siteDescription;
        document.getElementById('primaryColor').value = this.settings.primaryColor;
        document.getElementById('accentColor').value = this.settings.accentColor;
    }

    saveSettings() {
        this.settings = {
            siteTitle: document.getElementById('siteTitle').value,
            siteDescription: document.getElementById('siteDescription').value,
            primaryColor: document.getElementById('primaryColor').value,
            accentColor: document.getElementById('accentColor').value
        };
        
        this.saveSettingsToStorage();
        alert('网站设置已保存！');
    }

    savePages() {
        localStorage.setItem('websitePages', JSON.stringify(this.pages));
    }

    saveAssets() {
        localStorage.setItem('websiteAssets', JSON.stringify(this.assets));
    }

    saveSettingsToStorage() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

// 全局函数供HTML调用
function editPage(url) {
    adminManager.editPage(url);
}

function deletePage(url) {
    adminManager.deletePage(url);
}

function deleteAsset(assetId) {
    adminManager.deleteAsset(assetId);
}

function copyAssetUrl(assetId) {
    adminManager.copyAssetUrl(assetId);
}

// 初始化管理后台
const adminManager = new AdminManager();