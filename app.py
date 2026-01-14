from flask import Flask, render_template, request, jsonify
import base64
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
# 加载 .env 文件
load_dotenv()

app = Flask(__name__)

def get_chat_model():
    """使用ChatOpenAI接口调用魔搭模型"""
    model = ChatOpenAI(
        openai_api_base=os.getenv('MODELSCOPE_API_BASE', 'https://api-inference.modelscope.cn/v1'),
        openai_api_key=os.getenv('MODELSCOPE_API_KEY', ''),
        model_name=os.getenv('MODEL_NAME', 'Qwen/Qwen2.5-VL-72B-Instruct'),
        temperature=float(os.getenv('TEMPERATURE', '0.1')),
        max_tokens=int(os.getenv('MAX_TOKENS', '2048'))
    )
    return model

def _encode_image_to_base64(file_data):
    """将图片数据编码为 base64"""
    return base64.b64encode(file_data).decode()


def _build_formula_prompt():
    """构造公式识别提示词"""
    return """请识别图片中的所有数学公式。如果有多个公式，请按从左到右、从上到下的顺序列出所有公式。

严格按照以下格式输出，每个代码块都要包含所有公式（如果有多个公式，每行一个）：

```latex
{第一个公式的LaTeX代码}
{第二个公式的LaTeX代码}
{...}
```

```mathtype
{第一个公式的MathType代码，与LaTeX几乎完全相同，只有一点不同：将\\left和\\right删除，直接用对应的括号。保留所有其他LaTeX命令，如\\sqrt, \\beta, \\mid, \\frac, \\mathbf等。下标统一用_{}包围。}
{第二个公式的MathType代码}
{...}
```

重要：必须输出两个代码块（latex和mathtype），两个代码块都要包含所有公式，不要遗漏任何公式。MathType格式要保留所有LaTeX命令（\\sqrt, \\beta, \\frac等），只去掉\\left和\\right。"""


def _get_model_response(model, img_base64, prompt):
    """调用模型获取响应"""
    messages = [
        HumanMessage(content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_base64}"}}
        ])
    ]
    response = model.invoke(messages)

    return response.content if hasattr(response, 'content') else str(response)


def recognize_formula(file_data):
    """使用模型识别公式"""
    img_base64 = _encode_image_to_base64(file_data)
    prompt = _build_formula_prompt()
    model = get_chat_model()

    return _get_model_response(model, img_base64, prompt)

def extract_formula_codes(response_text):
    """从响应中提取两种格式的代码"""
    codes = {}
    formats = ['latex', 'mathtype']

    for fmt in formats:
        start = response_text.find(f'```{fmt}')
        if start != -1:
            content_start = response_text.find('\n', start) + 1
            end = response_text.find('```', content_start)
            codes[fmt] = response_text[content_start:end].strip() if end != -1 else ''
        else:
            codes[fmt] = ''

    return codes

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

def _validate_uploaded_file():
    """验证上传的文件"""
    if 'image' not in request.files:
        raise ValueError('未上传图片')

    file = request.files['image']
    if file.filename == '':
        raise ValueError('未选择文件')

    return file


def _build_recognition_result(codes):
    """构造识别结果"""
    return jsonify({
        'success': True,
        'latex': codes['latex'],
        'mathtype': codes['mathtype']
    })


@app.route('/recognize', methods=['POST'])
def recognize():
    """识别公式接口"""
    try:
        file = _validate_uploaded_file()
        file_data = file.read()

        response_text = recognize_formula(file_data)
        codes = extract_formula_codes(response_text)

        return _build_recognition_result(codes)

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        return jsonify({'error': str(e), 'detail': error_detail}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
