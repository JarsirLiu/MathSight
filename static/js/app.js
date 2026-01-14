const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const workspaceGrid = document.getElementById('workspaceGrid');
const previewImage = document.getElementById('previewImage');
const recognizeBtn = document.getElementById('recognizeBtn');
const loading = document.getElementById('loading');
const resultContent = document.getElementById('resultContent');
let currentFile = null;

// 文件上传处理
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        displayPreview(file);
    }
});

// 拖拽上传
uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        displayPreview(file);
    }
});

// 粘贴上传
document.addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            displayPreview(blob);
            break;
        }
    }
});

// 显示预览
function displayPreview(file) {
    currentFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        workspaceGrid.style.display = 'grid';

        // 清除之前的识别结果
        resultContent.innerHTML = `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p>点击右侧"识别公式"按钮开始转换</p>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// 重置上传
function resetUpload() {
    currentFile = null;
    previewImage.src = '';
    workspaceGrid.style.display = 'none';
    uploadArea.style.display = 'block';
    fileInput.value = '';
    resultContent.innerHTML = `
        <div class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>上传图片后点击"识别公式"开始转换</p>
        </div>
    `;
}

// 识别公式
async function recognizeFormula() {
    loading.style.display = 'flex';
    recognizeBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', currentFile);

    try {
        const response = await fetch('/recognize', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data);
            showToast('识别成功！', 'success');
        } else {
            showToast(data.error || '识别失败', 'error');
        }
    } catch (error) {
        showToast('网络错误: ' + error.message, 'error');
    } finally {
        loading.style.display = 'none';
        recognizeBtn.disabled = false;
    }
}

// 显示结果
function displayResults(data) {
    const latexFormulas = data.latex.split('\n').filter(f => f.trim());
    const mathtypeFormulas = data.mathtype.split('\n').filter(f => f.trim());

    let html = '<div class="result-section">';

    // LaTeX 格式
    html += `
        <div class="formula-card">
            <div class="formula-header">
                <div class="formula-title">
                    <svg class="formula-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    LaTeX 格式
                </div>
            </div>
            <div class="formula-content">
                ${renderFormulaList(latexFormulas, 'latex')}
            </div>
        </div>
    `;

    // MathType 格式
    html += `
        <div class="formula-card">
            <div class="formula-header">
                <div class="formula-title">
                    <svg class="formula-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    MathType 格式
                </div>
            </div>
            <div class="formula-content">
                ${renderFormulaList(mathtypeFormulas, 'mathtype')}
            </div>
        </div>
    `;

    html += '</div>';
    resultContent.innerHTML = html;

    // 重新渲染 MathJax
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([resultContent]).then(() => {
            console.log('MathJax rendering complete');
            // 绑定点击事件
            bindFormulaEvents();
        }).catch(err => {
            console.error('MathJax rendering error:', err);
        });
    }
}

// 渲染公式列表
function renderFormulaList(formulas, type) {
    const showMore = formulas.length > 5;
    const visibleCount = showMore ? 3 : formulas.length;

    let html = '<div class="formula-list">';

    formulas.forEach((formula, index) => {
        const isHidden = showMore && index >= visibleCount;
        html += `
            <div class="formula-item ${isHidden ? 'hidden-formula' : ''}" data-type="${type}" data-formula="${escapeJs(formula)}" onclick="copySingleFormula('${escapeJs(formula)}')">
                <div class="formula-render">\\[${escapeHtml(formula)}\\]</div>
                <div class="formula-source">${escapeHtml(formula)}</div>
                <div class="copy-icon" onclick="event.stopPropagation(); copySingleFormula('${escapeJs(formula)}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                </div>
            </div>
        `;
    });

    html += '</div>';

    if (showMore) {
        html += `
            <div class="show-more" onclick="showMoreFormulas(this, '${type}')">
                查看其余 ${formulas.length - visibleCount} 个公式
            </div>
        `;
    }

    return html;
}

// 显示更多公式
function showMoreFormulas(btn, type) {
    const hiddenFormulas = document.querySelectorAll(`.formula-item[data-type="${type}"].hidden-formula`);
    hiddenFormulas.forEach(formula => {
        formula.classList.add('visible');
    });
    btn.style.display = 'none';

    // 重新渲染新显示的公式
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([resultContent]).catch(err => {
            console.error('MathJax rendering error:', err);
        });
    }
}

// 绑定公式点击事件
function bindFormulaEvents() {
    // 点击事件已经通过 onclick 属性绑定，这里不需要额外处理
}

// 复制单个公式
function copySingleFormula(text) {
    copyToClipboard(text);
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制！', 'success');
    }).catch(err => {
        showToast('复制失败', 'error');
    });
}

// 显示提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// JavaScript 字符串转义
function escapeJs(text) {
    return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}
