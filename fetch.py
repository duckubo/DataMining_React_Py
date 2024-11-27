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
df_googl = df[df['code'] == 'GOOG']
df_amzn = df[df['code'] == 'AMZN']

# Xử lý dữ liệu
df_aapl['datetime'] = pd.to_datetime(df_aapl['datetime'])
df_aapl["close"] = pd.to_numeric(df_aapl["close"], errors='coerce')

df_googl['datetime'] = pd.to_datetime(df_googl['datetime'])
df_googl["close"] = pd.to_numeric(df_googl["close"], errors='coerce')

df_amzn['datetime'] = pd.to_datetime(df_amzn['datetime'])
df_amzn["close"] = pd.to_numeric(df_amzn["close"], errors='coerce')

df_aapl.set_index('datetime', inplace=True)  # Đặt datetime làm index
df_googl.set_index('datetime', inplace=True)  # Đặt datetime làm index
df_amzn.set_index('datetime', inplace=True)  # Đặt datetime làm index
    
weekly_resample_appl = df_aapl.resample('W').mean()
monthly_resample_appl = df_aapl.resample('M').mean()

weekly_resample_googl = df_googl.resample('W').mean()
monthly_resample_googl = df_googl.resample('M').mean()

weekly_resample_amzn = df_amzn.resample('W').mean()
monthly_resample_amzn = df_amzn.resample('M').mean()

# Reset lại index để có thể chuyển đổi thành dict
df_aapl_day = df_aapl.reset_index()
df_aapl_week = weekly_resample_appl.reset_index()
df_aapl_month = weekly_resample_appl.reset_index()

df_googl_day = df_googl.reset_index()
df_googl_week = weekly_resample_googl.reset_index()
df_googl_month = monthly_resample_googl.reset_index()

df_amzn_day = df_amzn.reset_index()
df_amzn_week = weekly_resample_amzn.reset_index()
df_amzn_month = monthly_resample_amzn.reset_index()
# Tạo bản sao của tập dữ liệu
apple_corr_df = df_aapl_day.copy()
apple_corr_df.reset_index(inplace=True)

google_corr_df = df_googl_day.copy()
google_corr_df.reset_index(inplace=True)

amazon_corr_df = df_amzn_day.copy()
amazon_corr_df.reset_index(inplace=True)

# Thêm các cột mới
apple_corr_df['Open-High'] = apple_corr_df['open'] - apple_corr_df['high']
apple_corr_df['Open-Low'] = apple_corr_df['open'] - apple_corr_df['low']
apple_corr_df['Close-High'] = apple_corr_df['close'] - apple_corr_df['high']
apple_corr_df['Close-Low'] = apple_corr_df['close'] - apple_corr_df['low']
apple_corr_df['High-Low'] = apple_corr_df['high'] - apple_corr_df['low']
apple_corr_df['Open-Close'] = apple_corr_df['open'] - apple_corr_df['close']

google_corr_df['Open-High'] = google_corr_df['open'] - google_corr_df['high']
google_corr_df['Open-Low'] = google_corr_df['open'] - google_corr_df['low']
google_corr_df['Close-High'] = google_corr_df['close'] - google_corr_df['high']
google_corr_df['Close-Low'] = google_corr_df['close'] - google_corr_df['low']
google_corr_df['High-Low'] = google_corr_df['high'] - google_corr_df['low']
google_corr_df['Open-Close'] = google_corr_df['open'] - google_corr_df['close']

amazon_corr_df['Open-High'] = amazon_corr_df['open'] - amazon_corr_df['high']
amazon_corr_df['Open-Low'] = amazon_corr_df['open'] - amazon_corr_df['low']
amazon_corr_df['Close-High'] = amazon_corr_df['close'] - amazon_corr_df['high']
amazon_corr_df['Close-Low'] = amazon_corr_df['close'] - amazon_corr_df['low']
amazon_corr_df['High-Low'] = amazon_corr_df['high'] - amazon_corr_df['low']
amazon_corr_df['Open-Close'] = amazon_corr_df['open'] - amazon_corr_df['close']

# Tính toán ma trận tương quan
apple_corr_df2 = apple_corr_df.drop(['index', 'id', 'datetime', 'open', 'high', 'low', 'close', 'code', 'volume'], axis=1)
apple_corr = apple_corr_df2.corr()

google_corr_df2 = google_corr_df.drop(['index', 'id', 'datetime', 'open', 'high', 'low', 'close', 'code', 'volume'], axis=1)
google_corr = google_corr_df2.corr()

amazon_corr_df2 = amazon_corr_df.drop(['index', 'id', 'datetime', 'open', 'high', 'low', 'close', 'code', 'volume'], axis=1)
amazon_corr = amazon_corr_df2.corr()

# Lấy dữ liệu đóng cửa trong 365 ngày
apple = df_aapl_day['close'].head(365)
google = df_googl_day['close'].head(365)
amazon = df_amzn_day['close'].head(365)

# Tạo đối tượng phân rã cho mô hình nhân
decomposition_aapl = seasonal_decompose(apple, model='multiplicative', period=12)
trend_aapl = pd.DataFrame(decomposition_aapl.trend).dropna()
seasonal_aapl = pd.DataFrame(decomposition_aapl.seasonal).dropna()

decomposition_googl = seasonal_decompose(google, model='multiplicative', period=12)
trend_googl = pd.DataFrame(decomposition_googl.trend).dropna()
seasonal_googl = pd.DataFrame(decomposition_googl.seasonal).dropna()

decomposition_amzn = seasonal_decompose(amazon, model='multiplicative', period=12)
trend_amzn = pd.DataFrame(decomposition_amzn.trend).dropna()
seasonal_amzn = pd.DataFrame(decomposition_amzn.seasonal).dropna()

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    # Chuyển đổi dữ liệu thành định dạng JSON
    # Đảm bảo df_aapl_day, df_aapl_week, df_aapl_month luôn là DataFrame trước khi chuyển sang dict
    df_aapl_day_records = df_aapl_day.to_dict(orient='records')
    df_aapl_week_records = df_aapl_week.to_dict(orient='records')
    df_aapl_month_records = df_aapl_month.to_dict(orient='records')
    
    df_googl_day_records = df_googl_day.to_dict(orient='records')
    df_googl_week_records = df_googl_week.to_dict(orient='records')
    df_googl_month_records = df_googl_month.to_dict(orient='records')
    
    df_amzn_day_records = df_amzn_day.to_dict(orient='records')
    df_amzn_week_records = df_amzn_week.to_dict(orient='records')
    df_amzn_month_records = df_amzn_month.to_dict(orient='records')
    
    heatmap_aapl = apple_corr.to_dict(orient='records')
    heatmap_googl = google_corr.to_dict(orient='records')
    heatmap_amzn = amazon_corr.to_dict(orient='records')
    
    # Chuyển đổi trend và seasonal thành JSON
    trend_data_aapl = trend_aapl.to_dict(orient='records') if not trend_aapl.empty else None
    seasonal_data_aapl = seasonal_aapl.to_dict(orient='records') if not seasonal_aapl.empty else None
    
    trend_data_googl = trend_googl.to_dict(orient='records') if not trend_googl.empty else None
    seasonal_data_googl = seasonal_googl.to_dict(orient='records') if not seasonal_googl.empty else None

    trend_data_amzn = trend_amzn.to_dict(orient='records') if not trend_amzn.empty else None
    seasonal_data_amzn = seasonal_amzn.to_dict(orient='records') if not seasonal_amzn.empty else None



    # Chuẩn bị dữ liệu gửi đến frontend
    response_data = {
        'df_aapl_day': df_aapl_day_records,
        'df_aapl_week': df_aapl_week_records,
        'df_aapl_month': df_aapl_month_records,
        'df_googl_day': df_googl_day_records,
        'df_googl_week': df_googl_week_records,
        'df_googl_month': df_googl_month_records,
        'df_amzn_day': df_amzn_day_records,
        'df_amzn_week': df_amzn_week_records,
        'df_amzn_month': df_amzn_month_records,
        'heatmap_aapl': heatmap_aapl,
        'heatmap_googl': heatmap_googl,
        'heatmap_amzn': heatmap_amzn,
        'trend_aapl': trend_data_aapl,
        'seasonal_aapl': seasonal_data_aapl,
        'trend_googl': trend_data_googl,
        'seasonal_googl': seasonal_data_googl,
        'trend_amzn': trend_data_amzn,
        'seasonal_amzn': seasonal_data_amzn,
    }
    
    return jsonify(response_data)

@app.route('/api/stock-info', methods=['GET'])
def stock_info():
    # Nhận tham số 'nm' từ yêu cầu
    
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('stocks_data.csv')

    # Lọc dữ liệu cho mã cổ phiếu tương ứng
    df_symbol_aapl = df[df['code'] == 'AAPL']
    df_symbol_googl = df[df['code'] == 'GOOG']
    df_symbol_amzn = df[df['code'] == 'AMZN']

    # Chuyển đổi cột 'datetime' thành kiểu datetime
    df_symbol_aapl['datetime'] = pd.to_datetime(df_symbol_aapl['datetime'])
    df_symbol_googl['datetime'] = pd.to_datetime(df_symbol_googl['datetime'])
    df_symbol_amzn['datetime'] = pd.to_datetime(df_symbol_amzn['datetime'])

    # Lấy giá trị mới nhất của cột 'close'
    newest_aapl = df_symbol_aapl.tail(1).to_dict(orient='records')[0]  # Sử dụng .values[0] để lấy giá trị đầu tiên từ Series
    newest_googl = df_symbol_googl.tail(1).to_dict(orient='records')[0]  # Sử dụng .values[0] để lấy giá trị đầu tiên từ Series
    newest_amzn = df_symbol_amzn.tail(1).to_dict(orient='records')[0]  # Sử dụng .values[0] để lấy giá trị đầu tiên từ Series
    
    return jsonify({
        'newest_aapl': newest_aapl,
        'newest_googl': newest_googl,
        'newest_amzn': newest_amzn,
        })

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
