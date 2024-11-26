import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
from statsmodels.tsa.seasonal import seasonal_decompose
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Đọc dữ liệu từ file CSV
df = pd.read_csv('stocks_data.csv')

# Lọc dữ liệu cho mã cổ phiếu 'AAPL'
df_aapl = df[df['code'] == 'AAPL']

# Xử lý dữ liệu
df_aapl['datetime'] = pd.to_datetime(df_aapl['datetime'])
df_aapl["close"] = pd.to_numeric(df_aapl["close"], errors='coerce')
data = df_aapl[['datetime', 'close']]

# Tạo bản sao của tập dữ liệu
amazon_corr_df = df_aapl.copy()
amazon_corr_df.reset_index(inplace=True)

# Thêm các cột mới
amazon_corr_df['Open-High'] = amazon_corr_df['open'] - amazon_corr_df['high']
amazon_corr_df['Open-Low'] = amazon_corr_df['open'] - amazon_corr_df['low']
amazon_corr_df['Close-High'] = amazon_corr_df['close'] - amazon_corr_df['high']
amazon_corr_df['Close-Low'] = amazon_corr_df['close'] - amazon_corr_df['low']
amazon_corr_df['High-Low'] = amazon_corr_df['high'] - amazon_corr_df['low']
amazon_corr_df['Open-Close'] = amazon_corr_df['open'] - amazon_corr_df['close']

# Tính toán ma trận tương quan
amazon_corr_df2 = amazon_corr_df.drop(['index', 'id', 'datetime', 'open', 'high', 'low', 'close', 'code', 'volume'], axis=1)
amazon_corr = amazon_corr_df2.corr()

# Lấy dữ liệu đóng cửa trong 365 ngày
amazon = df_aapl['close'].head(365)

# Tạo đối tượng phân rã cho mô hình nhân
decomposition = seasonal_decompose(amazon, model='multiplicative', period=12)
trend = pd.DataFrame(decomposition.trend).dropna()
seasonal = pd.DataFrame(decomposition.seasonal).dropna()

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    # Chuyển đổi dữ liệu thành định dạng JSON
    data = df_aapl.to_dict(orient='records')
    data2 = amazon_corr.to_dict(orient='records')
    
    # Chuyển đổi trend và seasonal thành JSON
    trend_data = trend.to_dict(orient='records') if not trend.empty else None
    seasonal_data = seasonal.to_dict(orient='records') if not seasonal.empty else None

    # Chuẩn bị dữ liệu gửi đến frontend
    response_data = {
        'data': data,
        'data2': data2,
        'trend': trend_data,
        'seasonal': seasonal_data
    }
    
    return jsonify(response_data)

@app.route('/api/stock-info', methods=['POST'])
def stock_info():
    # Nhận tham số 'nm' từ yêu cầu
    data = request.get_json()
    stock_symbol = data.get('nm')
    
    if not stock_symbol:
        return jsonify({'error': 'Stock symbol (nm) is required.'}), 400
    
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('stocks_data.csv')

    # Lọc dữ liệu cho mã cổ phiếu tương ứng
    df_symbol = df[df['code'] == stock_symbol]

    # Kiểm tra nếu không có dữ liệu cho cổ phiếu
    if df_symbol.empty:
        return jsonify({'error': f'No data found for stock symbol: {stock_symbol}'}), 404

    # Chuyển đổi cột 'datetime' thành kiểu datetime
    df_symbol['datetime'] = pd.to_datetime(df_symbol['datetime'])

    # Lấy giá trị mới nhất của cột 'close'
    newest = df_symbol.tail(1).to_dict(orient='records')[0]  # Sử dụng .values[0] để lấy giá trị đầu tiên từ Series
    return jsonify({'newest': newest})

@app.route('/api/get-forecast', methods=['GET'])
def get_forecast():
    ticket = request.args.get('ticket')
    # Nhận tham số 'nm' từ yêu cầu
 
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    try:
        # Đọc dữ liệu từ file CSV
        df = pd.read_csv('forecast_results.csv')  # Giả sử mỗi mã cổ phiếu có file CSV riêng
        
        # Chuyển đổi dữ liệu thành JSON
        forecast_results = df.to_dict(orient='records')
        
        return jsonify(forecast_results)  # Trả về dữ liệu dưới dạng JSON
    
    except FileNotFoundError:
        return jsonify({'error': f'Data for {ticket} not found'}), 404


@app.route('/api/get-cluster-data', methods=['GET'])
def get_cluster_data():
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('scatter_data.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    
    # Chuyển đổi dữ liệu thành JSON
    cluster_data = df.to_dict(orient='records')

    return jsonify(cluster_data)  # Trả về dữ liệu dưới dạng JSON

@app.route('/api/get-cluster-data-trend', methods=['GET'])
def get_cluster_datatrend():
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('scatter_data_trend.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    
    # Chuyển đổi dữ liệu thành JSON
    cluster_data = df.to_dict(orient='records')

    return jsonify(cluster_data)  # Trả về dữ liệu dưới dạng JSON

@app.route('/api/get-season-counts', methods=['GET'])
def get_season_counts():
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('scatter_data.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    df['year'] = pd.to_datetime(df['index']).dt.year  # Đảm bảo cột 'year' được tạo đúng
    df['season'] = df['season'].map({0: 'Winter', 1: 'Spring', 2: 'Summer', 3: 'Fall'})

    # Tính số ngày trong từng mùa cho mỗi năm
    season_counts = df.groupby(['year', 'season']).size().unstack(fill_value=0)
    # Chuyển đổi dữ liệu thành JSON
    season_counts = season_counts.reset_index()
    season_counts = season_counts.to_dict(orient='records')

    return jsonify(season_counts)  # Trả về dữ liệu dưới dạng JSON
@app.route('/api/get-season-counts-trend', methods=['GET'])
def get_season_counts_trend():
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('scatter_data_trend.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    df['year'] = pd.to_datetime(df['index']).dt.year  # Đảm bảo cột 'year' được tạo đúng
    df['season'] = df['season'].map({0: 'Low', 1: 'High', 2: 'Average',3:'Spike', 4:'Ultra_High', 5:'VeryLow'})

    # Tính số ngày trong từng mùa cho mỗi năm
    season_counts = df.groupby(['year', 'season']).size().unstack(fill_value=0)
    # Chuyển đổi dữ liệu thành JSON
    season_counts = season_counts.reset_index()
    season_counts = season_counts.to_dict(orient='records')

    return jsonify(season_counts)  # Trả về dữ liệu dưới dạng JSON
@app.route('/api/get-trend-data', methods=['GET'])
def get_trend_data():
    # Lấy giá trị của ticket từ query parameter
    ticket = request.args.get('ticket')
    
    # Kiểm tra nếu ticket không được cung cấp hoặc không hợp lệ
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    try:
        # Đọc dữ liệu từ file CSV
        df = pd.read_csv(f'trend_data_{ticket}.csv')  # Giả sử mỗi mã cổ phiếu có file CSV riêng
        
        # Chuyển đổi cột 'Date' thành định dạng chuỗi
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        
        # Chuyển đổi dữ liệu thành JSON
        trend_data = df.to_dict(orient='records')
        
        return jsonify(trend_data)  # Trả về dữ liệu dưới dạng JSON
    
    except FileNotFoundError:
        return jsonify({'error': f'Data for {ticket} not found'}), 404


@app.route('/api/get-arima-data', methods=['GET'])
def get_arima_data():
    ticket = request.args.get('ticket')
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    try:
    # Đọc dữ liệu từ file CSVz
        df = pd.read_csv(f'stock_price_comparison_arima_{ticket}.csv')
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
        # Chuyển đổi dữ liệu thành JSON
        arima_data = df.to_dict(orient='records')

        return jsonify(arima_data)  # Trả về dữ liệu dưới dạng JSON
    except FileNotFoundError:
        return jsonify({'error': f'Data for {ticket} not found'}), 404
    
@app.route('/api/get-lstm-data', methods=['GET'])
def get_lstm_data():
    ticket = request.args.get('ticket')
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv(f'stock_price_comparison_lstm_{ticket}.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    # Chuyển đổi dữ liệu thành JSON
    arima_data = df.to_dict(orient='records')

    return jsonify(arima_data)  # Trả về dữ liệu dưới dạng JSON

@app.route('/api/get-linear-data', methods=['GET'])
def get_linear_data():
    ticket = request.args.get('ticket')
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv(f'stock_price_comparison_linear_{ticket}.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    # Chuyển đổi dữ liệu thành JSON
    arima_data = df.to_dict(orient='records')

    return jsonify(arima_data)  # Trả về dữ liệu dưới dạng JSON

if __name__ == '__main__':
    app.run(debug=True)
