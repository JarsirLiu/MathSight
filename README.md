# 📐 公式识别系统

基于 LangChain 和 ModelScope Qwen2.5-VL-72B-Instruct 模型的数学公式识别工具。支持上传图片，自动识别公式并提供 LaTeX 和 MathType 两种格式的代码。

## ✨ 功能特点

- 📷 支持点击、拖拽或粘贴上传图片
- 🔍 自动识别数学公式（支持多个公式同时识别）
- 📝 提供两种格式输出：LaTeX、MathType
- 📋 一键复制单个公式代码
- 👁️ 实时预览上传的图片
- ⚙️ 支持自定义 API 配置（兼容 OpenAI 格式）

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

### 配置 API Key

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 ModelScope API Key：

```env
MODELSCOPE_API_KEY=your_api_key_here
MODELSCOPE_API_BASE=https://api-inference.modelscope.cn/v1
MODEL_NAME=Qwen/Qwen2.5-VL-72B-Instruct
TEMPERATURE=0.1
MAX_TOKENS=2048
```

如果没有 ModelScope 账号，请先访问 [ModelScope](https://modelscope.cn) 注册并获取 API Key。

### 运行应用

```bash
python app.py
```

应用启动后，在浏览器打开：http://localhost:5000

## 📖 使用说明

### 基本使用

1. 打开网页后，点击"选择图片"按钮、拖拽图片到上传区域，或按 `Ctrl+V` 粘贴图片
2. 预览图片后，点击"识别公式"按钮
3. 等待识别完成后，查看 LaTeX 和 MathType 两种格式的结果
4. 鼠标悬停在公式上可以看到源代码
5. 点击公式或右上角的复制图标即可复制对应格式的代码

### 自定义 API 配置

点击页面右上角的设置图标，可以自定义 API 配置：
- **API Base URL**: 支持任何 OpenAI 兼容的 API 端点
- **API Key**: 对应服务的 API 密钥
- **模型名称**: 使用的模型名称
- **Temperature**: 控制输出随机性（0-2）
- **Max Tokens**: 最大输出 token 数

配置会保存在浏览器本地存储中。

## 📁 项目结构

```
d:/learn/latex/
├── app.py                 # Flask 后端主程序
├── requirements.txt       # Python 依赖包列表
├── README.md             # 项目说明文档
├── .env.example          # 环境变量配置示例
├── .gitignore           # Git 忽略文件配置
├── static/
│   ├── css/
│   │   └── style.css     # 前端样式
│   └── js/
│       └── app.js        # 前端交互逻辑
└── templates/
    └── index.html        # 前端页面
```

## 🔧 技术栈

- **后端**: Flask + LangChain
- **模型**: Qwen2.5-VL-72B-Instruct (ModelScope)
- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **公式渲染**: MathJax 3.x

## ⚠️ 注意事项

1. 确保网络连接正常，需要访问 ModelScope API
2. 首次识别可能较慢，请耐心等待
3. 上传的图片建议清晰度较高，公式部分明显
4. 支持的图片格式：PNG、JPG、JPEG 等
5. API Key 请妥善保管，不要泄露或提交到代码仓库
6. 系统会自动识别图片中的多个公式，每行一个

## 📄 依赖包

- **flask** - Web 框架
- **langchain** - LangChain 核心库
- **langchain-openai** - LangChain OpenAI 集成（用于调用 ModelScope API）
- **openai** - OpenAI 客户端库
- **python-dotenv** - 环境变量管理
- **pillow>=10.4.0** - 图像处理库

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License
