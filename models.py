class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

class Product(ProductCreate):
    id: int
