import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/get-cluster-data', methods=['GET'])
def get_cluster_data():
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('scatter_data.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    
    # Chuyển đổi dữ liệu thành JSON
    cluster_data = df.to_dict(orient='records')

    return jsonify(cluster_data)  # Trả về dữ liệu dưới dạng JSON

if __name__ == '__main__':
    app.run(debug=True)
