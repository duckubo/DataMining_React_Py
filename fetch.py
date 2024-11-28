import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
from statsmodels.tsa.seasonal import seasonal_decompose
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    
    ticket = request.args.get('ticket')
    # Nhận tham số 'nm' từ yêu cầu
 
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv('stocks_data.csv')

    # Lọc dữ liệu cho mã cổ phiếu 'AAPL'
    df = df[df['code'] == ticket].copy()
    df['datetime'] = pd.to_datetime(df['datetime'])
    df["close"] = pd.to_numeric(df["close"])

    df.set_index('datetime', inplace=True)  # Đặt datetime làm index
        
    weekly_resample = df.resample('W').mean()
    monthly_resample = df.resample('M').mean()

    # Reset lại index để có thể chuyển đổi thành dict
    df_day = df.reset_index()
    df_week = weekly_resample.reset_index()
    df_month = monthly_resample.reset_index()

    # Tạo bản sao của tập dữ liệu
    corr_df = df_day.copy()
    corr_df.reset_index(inplace=True)

    # Thêm các cột mới
    corr_df['Open-High'] = corr_df['open'] - corr_df['high']
    corr_df['Open-Low'] = corr_df['open'] - corr_df['low']
    corr_df['Close-High'] = corr_df['close'] - corr_df['high']
    corr_df['Close-Low'] = corr_df['close'] - corr_df['low']
    corr_df['High-Low'] = corr_df['high'] - corr_df['low']
    corr_df['Open-Close'] = corr_df['open'] - corr_df['close']

    # Tính toán ma trận tương quan
    corr_df2 = corr_df.drop(['index', 'id', 'datetime', 'open', 'high', 'low', 'close', 'code', 'volume'], axis=1)
    corr = corr_df2.corr()
    
    # Lấy dữ liệu đóng cửa trong 365 ngày
    data = df_day['close'].head(365)
    
    # Tạo đối tượng phân rã cho mô hình nhân
    decomposition = seasonal_decompose(data, model='multiplicative', period=12)
    trend = pd.DataFrame(decomposition.trend).dropna()
    seasonal = pd.DataFrame(decomposition.seasonal).dropna()
    
    # Chuyển đổi dữ liệu thành định dạng JSON
    # Đảm bảo df_aapl_day, df_aapl_week, df_aapl_month luôn là DataFrame trước khi chuyển sang dict
    df_day_records = df_day.to_dict(orient='records')
    df_week_records = df_week.to_dict(orient='records')
    df_month_records = df_month.to_dict(orient='records')

    heatmap = corr.to_dict(orient='records')
    
    # Chuyển đổi trend và seasonal thành JSON
    trend_data = trend.to_dict(orient='records') if not trend.empty else None
    seasonal_data = seasonal.to_dict(orient='records') if not seasonal.empty else None

    # Chuẩn bị dữ liệu gửi đến frontend
    response_data = {
        'df_day': df_day_records,
        'df_week': df_week_records,
        'df_month': df_month_records,
        'heatmap': heatmap,
        'trend': trend_data,
        'seasonal': seasonal_data,
    }
    
    return jsonify(response_data)

@app.route('/api/stock-info', methods=['GET'])
def stock_info():
    # Nhận tham số 'nm' từ yêu cầu
    ticket = request.args.get('ticket')
    # Nhận tham số 'nm' từ yêu cầu
 
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    # Đọc dữ liệu từ file CSV
    df = pd.read_csv(f'newest_stock_data.csv')

    # Lọc dữ liệu cho mã cổ phiếu tương ứng
    df_symbol = df[df['code'] == ticket].copy()

    # Chuyển đổi cột 'datetime' thành kiểu datetime
    df_symbol['datetime'] = pd.to_datetime(df_symbol['datetime'])

    # Lấy giá trị mới nhất của cột 'close'
    newest = df_symbol.to_dict(orient='records')[0]  # 
    # Sử dụng .values[0] để lấy giá trị đầu tiên từ Series
    return jsonify({
        'newest_data': newest,
    })

@app.route('/api/get-forecast', methods=['GET'])
def get_forecast():
    ticket = request.args.get('ticket')
    # Nhận tham số 'nm' từ yêu cầu
 
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    try:
        # Đọc dữ liệu từ file CSV
        df = pd.read_csv(f'forecast_results_{ticket}.csv')  # Giả sử mỗi mã cổ phiếu có file CSV riêng
        
        # Chuyển đổi dữ liệu thành JSON
        forecast_results = df.to_dict(orient='records')
        
        return jsonify(forecast_results)  # Trả về dữ liệu dưới dạng JSON
    
    except FileNotFoundError:
        return jsonify({'error': f'Data for {ticket} not found'}), 404

@app.route('/api/get-cluster-data-trend', methods=['GET'])
def get_cluster_datatrend():
    # Đọc dữ liệu từ file CSV
    ticket = request.args.get('ticket')
    
    # Kiểm tra nếu ticket không được cung cấp hoặc không hợp lệ
    if not ticket:
        return jsonify({'error': 'No stock symbol (ticket) provided'}), 400
    
    df = pd.read_csv(f'scatter_data_trend_{ticket}.csv')
    
    # Chuyển đổi cột 'index' thành định dạng chuỗi để JSON hóa
    df['index'] = pd.to_datetime(df['index']).dt.strftime('%Y-%m-%d')
    
    # Chuyển đổi dữ liệu thành JSON
    cluster_data = df.to_dict(orient='records')

    return jsonify(cluster_data)  # Trả về dữ liệu dưới dạng JSON

@app.route('/api/get-season-counts-trend', methods=['GET'])
def get_season_counts_trend():
    # Đọc dữ liệu từ file CSV
    ticket = request.args.get('ticket')
    
    df = pd.read_csv(f'scatter_data_trend_{ticket}.csv') 
    
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
@app.route('/api/monthly-volume', methods=['GET'])
def get_monthly_volume():
    try:
        ticket = request.args.get('ticket')
        # Đọc dữ liệu từ file CSV
        df = pd.read_csv(f'yearly_volumes_{ticket}.csv')


        monthly_volume = df.to_dict(orient='records')

        return jsonify(monthly_volume)  # Trả về dữ liệu dưới dạng JSON
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
    
@app.route('/api/prediction-arima', methods=['GET'])
def prediction_arima():
    # Đọc tệp CSV
    df = pd.read_csv('predictions_arima.csv')  # Thay 'path_to_your_file.csv' bằng đường dẫn thực tế đến tệp CSV
    
    # Chuyển đổi dữ liệu thành danh sách các từ điển (mỗi dòng là một từ điển)
    data = df.to_dict(orient='records')

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(data)

@app.route('/api/prediction-lstm', methods=['GET'])
def prediction_lstm():
    # Đọc tệp CSV
    df = pd.read_csv('predictions_lstm.csv')  # Thay 'path_to_your_file.csv' bằng đường dẫn thực tế đến tệp CSV
    
    # Chuyển đổi dữ liệu thành danh sách các từ điển (mỗi dòng là một từ điển)
    data = df.to_dict(orient='records')

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(data)

@app.route('/api/prediction-lr', methods=['GET'])
def prediction_lr():
    # Đọc tệp CSV
    df = pd.read_csv('predictions_lr.csv')  # Thay 'path_to_your_file.csv' bằng đường dẫn thực tế đến tệp CSV
    
    # Chuyển đổi dữ liệu thành danh sách các từ điển (mỗi dòng là một từ điển)
    data = df.to_dict(orient='records')

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
