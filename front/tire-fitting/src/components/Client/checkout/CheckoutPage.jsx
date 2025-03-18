import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../../redux context/api/axiosConfig';
import { toast } from 'react-toastify';
import { CartContext } from '../../../redux context/CartContext';

function CheckoutPage() {
    const navigate = useNavigate();
    const { clearCart, totalAmount } = useContext(CartContext);

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [installationRequested, setInstallationRequested] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const paymentOptions = [
        'Кредитная карта',
        'PayPal',
        'Наличными при получении',
        'Банковский перевод'
    ];

    const deliveryOptions = [
        'самовывоз',
        'транспортная компания',
        'курьер продавца'
    ];

    // Вычисляем дату доставки (текущая дата + 3 дня)
    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const formattedDate = date.toISOString().split('T')[0];
        setEstimatedDeliveryDate(formattedDate);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                deliveryAddress,
                paymentMethod,
                installationRequested,
                deliveryMethod,
                estimatedDeliveryDate, // автоматическая дата доставки
            };
            const response = await axios.post('/api/orders', payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success(response.data.message || 'Заказ успешно создан');
            await clearCart();
            navigate(`/order-confirmation/${response.data.order.id}`);
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            toast.error(error.response?.data?.message || 'Ошибка при оформлении заказа');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="my-4">
            <h2>Оформление заказа</h2>
            <p>Общая сумма: {totalAmount.toFixed(2)} ₽</p>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="deliveryAddress" className="mb-3">
                    <Form.Label>Адрес доставки</Form.Label>
                    <Form.Control
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                    />
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="paymentMethod" className="mb-3">
                            <Form.Label>Способ оплаты</Form.Label>
                            <Form.Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                            >
                                <option value="">Выберите способ оплаты</option>
                                {paymentOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="deliveryMethod" className="mb-3">
                            <Form.Label>Способ доставки</Form.Label>
                            <Form.Select
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                required
                            >
                                <option value="">Выберите способ доставки</option>
                                {deliveryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="installationRequested" className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Требуется установка"
                        checked={installationRequested}
                        onChange={(e) => setInstallationRequested(e.target.checked)}
                    />
                </Form.Group>
                <Form.Group controlId="estimatedDeliveryDate" className="mb-3">
                    <Form.Label>Ожидаемая дата доставки</Form.Label>
                    <Form.Control
                        type="date"
                        value={estimatedDeliveryDate}
                        readOnly
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Оформление заказа...' : 'Оформить заказ'}
                </Button>
            </Form>
        </Container>
    );
}

export default CheckoutPage;
