from db.db import db

class Products(db.Model):
    code = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(100), unique=True, nullable=False)
    cost = db.Column(db.String(100), unique=True, nullable=False)
    bag = db.Column(db.String(100), nullable=False)

    def __init__(self, name, quantity, cost, bag):
        self.name = name
        self.quantity = quantity
        self.cost = cost
        self.bag = bag
