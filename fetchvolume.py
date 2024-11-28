import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
@app.route('/api/monthly-volume', methods=['GET'])
def get_monthly_volume():
    try:
        # Đọc dữ liệu từ file CSV
        df = pd.read_csv('stocks_data.csv')
        df_aapl = df[df['code'] == 'AAPL'].copy()

        df_aapl['datetime'] = pd.to_datetime(df_aapl['datetime'])
        df_aapl['month_year'] = df_aapl['datetime'].dt.to_period('M')
        monthly_data = df_aapl.groupby('month_year')['volume'].sum().reset_index()

        result = {
            'months': monthly_data['month_year'].astype(str).tolist(),
            'volumes': monthly_data['volume'].tolist()
        }
        
        return jsonify(result)
    except Exception as e:
        print("Error in API:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/tweet-data', methods=['GET'])
def get_tweet_data():
    
    ticket = request.args.get('ticket')
    try:
        # Đọc dữ liệu từ CSV
        df = pd.read_csv(f'processed_tweet_data_{ticket}.csv')

        # Chuyển dữ liệu thành dạng dictionary (json)
        tweet_data = df.to_dict(orient='records')

        # Trả về dữ liệu dưới dạng JSON
        return jsonify(tweet_data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

