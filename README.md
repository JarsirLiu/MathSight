# 📐 公式识别系统

基于 LangChain 和 ModelScope Qwen3-VL-8B-Instruct 模型的数学公式识别工具。支持上传图片，自动识别公式并提供 LaTeX、Word、MathType 三种格式的代码。

## ✨ 功能特点

- 📷 支持点击或拖拽上传图片
- 🔍 自动识别数学公式
- 📝 提供三种格式输出：LaTeX、Word、MathType
- 📋 一键复制代码
- 👁️ 实时预览上传的图片

## 🚀 快速开始

### 环境要求

- Python 3.8+
- uv (Python 包管理器)

### 安装 uv

如果还没有安装 uv，请执行：

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 安装项目依赖

```bash
# 使用 uv 创建虚拟环境并安装依赖
uv venv

# Windows 激活虚拟环境
.venv\Scripts\activate

# Linux/macOS 激活虚拟环境
source .venv/bin/activate

# 安装依赖包
uv pip install -r requirements.txt --index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 配置 ModelScope API

首次使用前需要登录 ModelScope：

```bash
modelscope login
```

按照提示输入你的 ModelScope 账号和密码获取 API 密钥。

如果没有账号，请先访问 [ModelScope](https://modelscope.cn) 注册。

### 运行应用

```bash
python app.py
```

应用启动后，在浏览器打开：http://localhost:5000

## 📖 使用说明

1. 打开网页后，点击"选择图片"按钮或直接拖拽图片到上传区域
2. 预览图片后，点击"识别公式"按钮
3. 等待识别完成后，查看三种格式的结果
4. 点击"复制"按钮即可复制对应格式的代码

## 📁 项目结构

```
d:/learn/latex/
├── app.py                 # Flask 后端主程序
├── requirements.txt       # Python 依赖包列表
├── README.md             # 项目说明文档
└── templates/
    └── index.html        # 前端界面
```

## 🔧 技术栈

- **后端**: Flask + LangChain
- **模型**: Qwen3-VL-8B-Instruct (ModelScope)
- **前端**: HTML5 + CSS3 + JavaScript

## ⚠️ 注意事项

1. 确保网络连接正常，需要访问 ModelScope API
2. 首次加载模型可能较慢，请耐心等待
3. 上传的图片建议清晰度较高，公式部分明显
4. 支持的图片格式：PNG、JPG、JPEG 等

## 📄 依赖包

- flask==3.0.0 - Web 框架
- langchain==0.1.20 - LangChain 核心库
- langchain-community==0.0.38 - LangChain 社区插件
- modelscope==1.17.1 - ModelScope SDK
- pillow==10.3.0 - 图像处理库
- requests==2.31.0 - HTTP 请求库

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License
