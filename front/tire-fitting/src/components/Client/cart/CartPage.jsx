import React, { useContext } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { CartContext } from '../../../redux context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CartPage() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        loading,
        error,
    } = useContext(CartContext);
    const navigate = useNavigate();

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <Container className="my-4">
            <h2>Корзина</h2>
            {loading && <p>Загрузка корзины...</p>}
            {error && <p className="text-danger">{error}</p>}
            {cartItems && cartItems.length > 0 ? (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Фото</th>
                                <th>Название товара</th>
                                <th>Цена</th>
                                <th>Количество</th>
                                <th>Сумма</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.productId}>
                                    <td>
                                        {item.Product && item.Product.photo ? (
                                            <img
                                                src={`http://localhost:5000${item.Product.photo}`}
                                                alt={item.Product.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span>Нет фото</span>
                                        )}
                                    </td>
                                    <td>{item.Product ? item.Product.name : 'Неизвестно'}</td>
                                    <td>{item.Product ? item.Product.price : '-'}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.productId,
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        {item.Product
                                            ? (parseFloat(item.Product.price) * item.quantity).toFixed(2)
                                            : '-'}
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemove(item.productId)}
                                        >
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Row className="mb-3">
                        <Col md={{ span: 4, offset: 8 }}>
                            <h4>Общая сумма: {totalAmount.toFixed(2)} ₽</h4>
                        </Col>
                    </Row>
                    <Button variant="secondary" onClick={clearCart} className="me-2">
                        Очистить корзину
                    </Button>
                    <Button variant="primary" onClick={handleCheckout}>
                        Оформить заказ
                    </Button>
                </>
            ) : (
                <p>Ваша корзина пуста.</p>
            )}
        </Container>
    );
}

export default CartPage;
