from flask import Flask, render_template
from users.controllers.user_controller import user_controller
from db.db import db
from flask_cors import CORS
#from users.controllers.product_controller import product_controller

app = Flask(__name__)
app.secret_key = 'secret123'

# Configurar CORS para permitir solicitudes desde el frontend (http://192.168.80.3:5001)
CORS(app, resources={r"/api/*": {"origins": "http://192.168.80.3:5001"}}, supports_credentials=True)

app.config.from_object('config.Config')
db.init_app(app)


#with app.app_context():
#    db.create_all()


# Registrando el blueprint del controlador de usuarios
app.register_blueprint(user_controller)
#app.register_blueprint(product_controller)

@app.route('/healthcheck')
def health_check():
    return '', 200


if __name__ == '__main__':
    app.run()
