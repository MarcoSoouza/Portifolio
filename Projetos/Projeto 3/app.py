from flask import Flask, render_template, jsonify
import random
import time

app = Flask(__name__, static_folder='imagem')

# Sample data generator
def generate_sample_data():
    sales = [random.randint(100, 500) for _ in range(12)]
    category_sales = [random.randint(200, 800) for _ in range(4)]
    total_sales = sum(sales)
    avg_sales = total_sales / len(sales)
    return {
        'sales': sales,
        'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'categories': ['A', 'B', 'C', 'D'],
        'category_sales': category_sales,
        'total_sales': total_sales,
        'avg_sales': round(avg_sales, 2),
        'total_category_sales': sum(category_sales)
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    return jsonify(generate_sample_data())

if __name__ == '__main__':
    app.run(debug=True)
