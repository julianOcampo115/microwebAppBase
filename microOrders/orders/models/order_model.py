from db.db import db



class Order(db.Model):
    __tablename__ = 'orders'


    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userName = db.Column(db.String(255), nullable=False)
    userEmail = db.Column(db.String(255), nullable=False)
    saleTotal = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=db.func.current_timestamp())


    def __init__(self, userName, userEmail, saleTotal):
        self.userName = userName
        self.userEmail = userEmail
        self.saleTotal = saleTotal
