from flask import Blueprint, request, jsonify
from products.models.product_model import Products
from db.db import db

product_controller = Blueprint('product_controller', __name__)

@product_controller.route('/api/products', methods=['GET'])
def get_products():
    print("listado de productos")
    products = Products.query.all()
    result = [{'code':product.code, 'name': product.name, 'quantity': product.quantity, 'cost': product.cost, 'bag': product.bag } for product in products]
    return jsonify(result)

# Get single user by id
@product_controller.route('/api/products/<int:product_code>', methods=['GET'])
def get_product(product_code):
    print("obteniendo producto")
    product = Products.query.get_or_404(product_code)
    return jsonify({'code':product.code, 'name': product.name, 'quantity': product.quantity, 'cost': product.cost, 'bag': product.bag})

@product_controller.route('/api/products', methods=['POST'])
def create_product():
    print("creando producto")
    data = request.json
    #new_user = Users(name="oscar", email="oscar@gmail", username="omondragon", password="123")
    new_product = Products(name=data['name'], quantity=data['quantity'], cost=data['cost'], bag=data['bag'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product created successfully'}), 201

# Update an existing user
@product_controller.route('/api/products/<int:product_code>', methods=['PUT'])
def update_product(product_code):
    print("actualizando producto")
    product = Products.query.get_or_404(product_code)
    data = request.json
    #########################
    # Actualizar solo los campos presentes en el JSON
    if 'quantity' in data:
        product.quantity = data['quantity']
    if 'cost' in data:
        product.cost = data['cost']
    if 'bag' in data:
        product.bag = data['bag']
    # Solo actualiza el nombre si está presente (no obligatorio)
    if 'name' in data:
        product.name = data['name']

######################################

   # product.name = data['name']
   # product.quantity = data['quantity']
   # product.cost = data['cost']
   # product.bag = data['bag']
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})

# Delete an existing user
@product_controller.route('/api/products/<int:product_code>', methods=['DELETE'])
def delete_product(product_code):
    product = Products.query.get_or_404(product_code)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})
