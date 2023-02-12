from flask import Flask
from flask import make_response, request, json
from flask_cors import CORS
from .api import get_answer_from_ai, ingest

app = Flask(__name__)
CORS(app)


@app.route("/qa", methods=['POST'])
def qa():
    data = request.json
    qa_str = data['qa']
    err_str = ''
    print('qa')
    print(data)

    if qa_str:
        try:
            result = get_answer_from_ai(qa_str)
            response = make_response(json.dumps({
                "success": True,
                "content": result
            }, ensure_ascii=False))
        except Exception as err:
            err_str = str(err)
            response = make_response(json.dumps({
                "success": False,
                "message": err_str,
            }, ensure_ascii=False))
    else:
        response = make_response(json.dumps({
            "success": False,
            "message": 'no qa string',
        }, ensure_ascii=False))

    response.headers['Content-Type'] = 'application/json'
    return response


@app.route("/learn", methods=['POST'])
def learn():
    data = request.json
    message = ''

    if data and data['title'] and data['content']:
        try:
            success = ingest(data['title'] + '\n' + data['content'])
        except Exception as err:
            success = False
            message = str(err)
    else:
        success = False

    response = make_response(json.dumps(
        {"success": success, "message": message}, ensure_ascii=False))
    response.headers['Content-Type'] = 'application/json'
    return response
