from flask import Blueprint, request, jsonify, session
from db.db import db
from orders.models.order_model import Order
import requests
#from flask_cors import CORS

order_controller = Blueprint('order_controller', __name__)


# Habilitar CORS en este controlador
#CORS(order_controller)



# Ruta para obtener todas las órdenes
@order_controller.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    orders_list = [{"id": o.id, "userName": o.userName, "userEmail": o.userEmail, "saleTotal": o.saleTotal, "date": o.date} for o in orders]
    return jsonify(orders_list), 200

    #if not orders:
    #    return jsonify({'message': 'Orden no encontrada'}), 404

    #orders_list = [{
    #    "id": o.id,
    #    "userName": o.userName,
    #    "userEmail": o.userEmail,
    #    "saleTotal": o.saleTotal,
    #    "date": o.date,
    #    "products": [{"name": p.name, "quantity": p.quantity} for p in o.products]  # Agregar productos correctamente
    #} for o in orders]
    #return jsonify(orders_list), 200


# Ruta para obtener una orden específica
@order_controller.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Orden no encontrada'}), 404
    order_data = {"id": order.id, "userName": order.userName, "userEmail": order.userEmail, "saleTotal": order.saleTotal, "date": order.date}
    return jsonify(order_data), 200

# Ruta para crear una orden de compra
@order_controller.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()


    # Simulación de sesión (en producción, esto vendría de autenticación real)
    #session['username'] = "juan"
    #session['email'] = "juan@gmail.com"
    #user_name = session.get('username')
    #user_email = session.get('email')

    user_name = session.get('username')
    user_email = session.get('email')

    if not user_name or not user_email:
        return jsonify({'message': 'Información de usuario inválida'}), 400

    products = data.get('products', [])
    if not products or not isinstance(products, list):
        return jsonify({'message': 'Falta o es inválida la información de los productos'}), 400

    # Consultar productos en el microservicio de productos
    product_service_url = "http://192.168.80.3:5003/api/products"


    total = 0
    #product_objects = []


    for product in products:
        product_id = product.get('id')
        quantity = product.get('quantity')

    ####
        #producto = product.get('name')
    ####

        if not product_id or not quantity:
            return jsonify({'message': 'Información de producto incompleta'}), 400


        # Consultar disponibilidad del producto
        product_response = requests.get(f"{product_service_url}/{product_id}")
        if product_response.status_code != 200:
            return jsonify({'message': f'Producto con ID {product_id} no encontrado'}), 404
                                                                                                                     

        product_data = product_response.json()
        available_quantity = int(product_data.get("quantity"))

        if available_quantity < quantity:
            return jsonify({'message': f'No hay suficiente stock para el producto {product_id}'}), 400

        #product_name = product_data.get('name')
        #product_price = product_data.get('cost')

        # Calcular total de la orden
        total += float(product_data.get("cost")) * quantity



        # Agregar producto a la lista
        #product_objects.append(product)




        # Crear la orden en la base de datos

        new_order = Order(userName=user_name, userEmail=user_email, saleTotal=total)

        #new_order.products = product_objects  # Asocia los productos con la orden

        db.session.add(new_order)
        db.session.commit()





        # Actualizar el inventario

        for product in products:
            product_id = product.get('id')
            quantity = product.get('quantity')

#CUANDO YA FUNCIONABA SE AGREGARON ESTAS LINEAS

           # Consultar disponibilidad del producto
            product_response = requests.get(f"{product_service_url}/{product_id}")
            if product_response.status_code != 200:
                return jsonify({'message': f'Producto con ID {product_id} no encontrado'}), 404

            product_data = product_response.json()
            available_quantity = int(product_data.get("quantity"))

            new_quantity = available_quantity - quantity
            update_response = requests.put(f"{product_service_url}/{product_id}", json={"quantity": new_quantity})

            if update_response.status_code != 200:
                return jsonify({'message': f'Error al actualizar el inventario para el producto {product_id}'}), 500
###########################


        return jsonify({'message': 'Orden creada exitosamente'}), 201





@order_controller.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Orden no encontrada'}), 404
    data = request.get_json()
    order.userName = data.get('userName', order.userName)
    order.userEmail = data.get('userEmail', order.userEmail)
    order.saleTotal = data.get('saleTotal', order.saleTotal)
    db.session.commit()

    return jsonify({'message': 'Orden actualizada exitosamente'}), 200
