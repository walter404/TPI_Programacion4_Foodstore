"""Carga datos iniciales. Es idempotente: se puede correr varias veces sin duplicar.

    python -m app.db.seed
"""

from sqlmodel import select

from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

ADMIN = {
    "username": "admin",
    "full_name": "Administrador",
    "email": "admin@foodstore.com",
    "password": "Admin1234!",
}

CATEGORIAS = [
    ("Hamburguesas", "Hamburguesas artesanales con papas"),
    ("Pizzas", "Pizzas a la piedra"),
    ("Bebidas", "Gaseosas, aguas y cervezas"),
    ("Postres", "Algo dulce para cerrar"),
]

# (categoría, nombre, descripción, precio, stock)
PRODUCTOS = [
    ("Hamburguesas", "Clásica", "Carne, cheddar, lechuga y tomate", 6500.0, 20),
    ("Hamburguesas", "Doble bacon", "Doble carne, bacon crocante y barbacoa", 8900.0, 15),
    ("Hamburguesas", "Veggie", "Medallón de lentejas y rúcula", 6200.0, 12),
    ("Pizzas", "Muzzarella", "Salsa de tomate y muzzarella", 7200.0, 10),
    ("Pizzas", "Napolitana", "Muzzarella, tomate fresco y ajo", 8100.0, 10),
    ("Bebidas", "Gaseosa 500 ml", "Cola, lima-limón o naranja", 1800.0, 50),
    ("Bebidas", "Agua mineral", "Sin gas, 500 ml", 1200.0, 60),
    ("Postres", "Flan casero", "Con dulce de leche y crema", 3200.0, 14),
]


def seed() -> None:
    create_all_tables()
    with session_factory() as session:
        if not session.exec(select(Usuario).where(Usuario.username == ADMIN["username"])).first():
            session.add(
                Usuario(
                    username=ADMIN["username"],
                    full_name=ADMIN["full_name"],
                    email=ADMIN["email"],
                    hashed_password=hash_password(ADMIN["password"]),
                    role="admin",
                )
            )

        categorias: dict[str, Categoria] = {}
        for nombre, descripcion in CATEGORIAS:
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
                session.flush()
            categorias[nombre] = categoria

        for cat_nombre, nombre, descripcion, precio, stock in PRODUCTOS:
            existe = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if existe is None:
                session.add(
                    Producto(
                        categoria_id=categorias[cat_nombre].id,  # type: ignore[arg-type]
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio,
                        stock=stock,
                    )
                )
        session.commit()
    print("Seed listo: usuario admin (admin / Admin1234!), categorías y productos cargados.")


if __name__ == "__main__":
    seed()
