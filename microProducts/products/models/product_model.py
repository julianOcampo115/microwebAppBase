from db.db import db

class Products(db.Model):
    __tablename__ = 'products'

    code = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    bag = db.Column(db.String(100), nullable=False)


    def __init__(self, name, quantity, cost, bag):
        self.name = name
        self.quantity = quantity
        self.cost = cost
        self.bag = bag
