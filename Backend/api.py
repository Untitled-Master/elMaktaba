from flask import Flask, render_template, request, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load existing books from books.json (create the file if it doesn't exist)
try:
    with open('books.json', 'r', encoding='utf-8') as file:
        books = json.load(file)
except FileNotFoundError:
    books = []


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/post')
def post():
    return render_template('post.html')


@app.route('/api/post-book', methods=['POST'])
def post_book():
    data = request.get_json()

    if not data or not all(key in data
                           for key in ['title', 'author', 'link', 'image', 'language', 'tag']):
        return jsonify({'error': 'All fields are required'}), 400

    new_book = {
        'title': data['title'],
        'author': data['author'],
        'link': data['link'],
        'image': data['image'],
        'language': data['language'],
        'tag': data['tag']
    }

    books.append(new_book)

    # Write updated books back to the file
    with open('books.json', 'w', encoding='utf-8') as file:
        json.dump(books, file, ensure_ascii=False, indent=2)

    return jsonify({'success': True, 'message': 'Book added successfully'})


@app.route('/api/books')
def get_books():
    return jsonify(books)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
