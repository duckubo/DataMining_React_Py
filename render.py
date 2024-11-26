import pandas as pd
import tensorflow as tf
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
import pymysql
from keras.models import Sequential
from keras.layers import Dense, LSTM
app = Flask(__name__)
CORS(app)

import pymysql
import pandas as pd 
# Database connection settings
db_settings = {
    'host': 'localhost',  # Change if necessary
    'port': 3306,         # Default MySQL port
    'user': 'root',       # Your MySQL username
    'password': 'root',   # Your MySQL password
    'database': 'stock_data'  # Replace with your database name
}

# Connect to the database
connection = pymysql.connect(**db_settings)

try:
    with connection.cursor() as cursor:
        # Write your SQL query
        sql_query = "SELECT * FROM stock_data_analyst WHERE code = 'AAPL' ORDER BY datetime ASC LIMIT 100"

        # Execute the query
        cursor.execute(sql_query)
        
        # Fetch all the results
        results = cursor.fetchall()
        
        # Print the results
        for row in results:
            print(row)
        column_names = [desc[0] for desc in cursor.description]
        
        # Create DataFrame with column names
        df = pd.DataFrame(list(results), columns=column_names)
        # Hiển thị các dòng đầu tiên
        print(df.head(30))
finally:
    # Close the connection
    connection.close()
df['datetime'] = pd.to_datetime(df['datetime'])
df["close"] = pd.to_numeric(df["close"], errors='coerce')
# Chia dữ liệu thành tập huấn luyện và tập kiểm tra
data = df[['datetime', 'close']]  # Use double brackets to select multiple columns
print(data)

# Convert the 'close' column to a numpy array
dataset = data['close'].values.reshape(-1, 1)
print(dataset)
training_data_len = int(np.ceil( len(dataset) * .8 ))
scaler = MinMaxScaler(feature_range=(0,1))
scaled_data = scaler.fit_transform(dataset)
train_data = scaled_data[0:int(training_data_len), :]
#Split the data into x_train and y_train data sets
x_train = []
y_train = []

for i in range(60, len(train_data)):
    x_train.append(train_data[i-60:i, 0])
    y_train.append(train_data[i, 0])
    if i<= 61:
        print(x_train)
        print(y_train)
        print()
x_train, y_train = np.array(x_train), np.array(y_train)
x_train = x_train.reshape((x_train.shape[0], x_train.shape[1], 1))

print(type(x_train))
print(np.isnan(x_train).any())
print(x_train[:5])  # Print the first 5 rows to check

#Build the LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape= (x_train.shape[1], 1)))
model.add(LSTM(50, return_sequences= False))
model.add(Dense(25))
model.add(Dense(1))

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

model.fit(x_train, y_train, batch_size=1, epochs=1)
test_data = scaled_data[training_data_len - 60: , :]
#Create the data sets x_test and y_test
x_test = []
y_test = dataset[training_data_len:, :]
for i in range(60, len(test_data)):
    x_test.append(test_data[i-60:i, 0])
    
# Convert the data to a numpy array
x_test = np.array(x_test)
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1 ))
# Get the models predicted price values 
predictions = model.predict(x_test)
predictions = scaler.inverse_transform(predictions)
rmse = np.sqrt(np.mean(((predictions - y_test) ** 2)))
training_data_len = int(len(data) * 0.8)  # 80% cho huấn luyện
train = data[:training_data_len]
valid = data[training_data_len:]

# # Thêm dự đoán vào tập kiểm tra (dữ liệu giả lập cho dự đoán)
# predictions = [train['close'].iloc[-1] + i for i in range(1, len(valid) + 1)]  # Dự đoán giả lập
valid['Predictions'] = predictions

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    # Chuyển đổi dữ liệu thành định dạng JSON
    train_json = train.to_dict(orient='records')  # Chuyển train thành JSON
    valid_json = valid.to_dict(orient='records')  # Chuyển valid thành JSON
    
#     # Chuẩn bị dữ liệu gửi đến frontend
    data = {
         'train': train_json,   # Dữ liệu huấn luyện
         'valid': valid_json     # Dữ liệu kiểm tra và dự đoán
     }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
