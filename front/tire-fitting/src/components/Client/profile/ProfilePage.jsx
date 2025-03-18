import React, { useContext, useState, useEffect } from 'react';
import {
    Container,
    Tab,
    Tabs,
    Row,
    Col,
    Image,
    Card,
    Form,
    Button,
    Table,
    Modal
} from 'react-bootstrap';
import axios from '../../../redux context/api/axiosConfig';
import { AuthContext } from '../../../redux context/AuthContext';
import { toast } from 'react-toastify';


// Компонент для просмотра и редактирования личных данных
const ProfileDetails = () => {
    const { authData, login } = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (authData.user) {
            setFirstName(authData.user.firstName || '');
            setLastName(authData.user.lastName || '');
            setEmail(authData.user.email || '');
            setPhone(authData.user.phone || '');
            setBirthDate(authData.user.birthDate ? authData.user.birthDate.split('T')[0] : '');
            setDescription(authData.user.description || '');
            setAddress(authData.user.address || '');
            setPhoto(authData.user.photo || '');
        }
    }, [authData.user]);

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
            setPhoto(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('birthDate', birthDate);
            formData.append('description', description);
            formData.append('address', address);
            if (password) {
                formData.append('password', password);
            }
            if (photoFile) {
                formData.append('photo', photoFile);
            }
            const response = await axios.put(
                `/api/users/${authData.user.id}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const updatedUser = response.data;
            login({ user: updatedUser, token: authData.token, role: authData.role });
            toast.success('Данные успешно обновлены');
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
            toast.error(error.response?.data?.message || 'Ошибка при обновлении данных');
        } finally {
            setSubmitting(false);
        }
    };

    const photoUrl = photo
        ? (photo.startsWith('http') ? photo : `http://localhost:5000${photo}`)
        : 'https://via.placeholder.com/150';

    return (
        <div>
            {/* Шапка профиля */}
            <div
                className="profile-header mb-4"
                style={{
                    background: '#f8f9fa',
                    padding: '30px 0',
                    textAlign: 'center',
                    borderRadius: '8px'
                }}
            >
                <Image
                    src={photoUrl}
                    alt="Фото пользователя"
                    roundedCircle
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '5px solid #fff',
                        marginBottom: '10px'
                    }}
                />
                <h2 style={{ marginBottom: '5px' }}>
                    {firstName} {lastName}
                </h2>
                {description && (
                    <p style={{ fontStyle: 'italic', color: '#6c757d' }}>{description}</p>
                )}
            </div>

            {/* Форма редактирования профиля */}
            <Card>
                <Card.Body>
                    <Card.Title>Редактировать профиль</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="phone" className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="birthDate" className="mb-3">
                            <Form.Label>Дата рождения</Form.Label>
                            <Form.Control
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите новый пароль, если хотите изменить"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="photo" className="mb-3">
                            <Form.Label>Фото профиля</Form.Label>
                            <Form.Control type="file" onChange={handlePhotoChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};


// Компонент для отображения истории заказов с модальным окном для деталей заказа
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const response = await axios.get('/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Ошибка при получении заказов:', error);
                toast.error('Ошибка при получении заказов');
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    return (
        <div>
            <h3>История заказов</h3>
            {loadingOrders ? (
                <p>Загрузка заказов...</p>
            ) : orders.length === 0 ? (
                <p>Заказов нет.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Номер заказа</th>
                            <th>Дата</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.trackingNumber}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.totalCost}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Button variant="link" onClick={() => handleShowDetails(order)}>
                                        Подробнее
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Модальное окно с деталями заказа */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Детали заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div>
                            <p><strong>Номер заказа:</strong> {selectedOrder.trackingNumber}</p>
                            <p>
                                <strong>Дата заказа:</strong>{' '}
                                {new Date(selectedOrder.orderDate).toLocaleDateString()}
                            </p>
                            <p><strong>Сумма:</strong> {selectedOrder.totalCost}</p>
                            <p><strong>Статус:</strong> {selectedOrder.status}</p>
                            {selectedOrder.installationRequested !== undefined && (
                                <p>
                                    <strong>Требуется установка:</strong>{' '}
                                    {selectedOrder.installationRequested ? 'Да' : 'Нет'}
                                </p>
                            )}
                            {selectedOrder.deliveryMethod && (
                                <p>
                                    <strong>Способ доставки:</strong> {selectedOrder.deliveryMethod}
                                </p>
                            )}
                            {selectedOrder.estimatedDeliveryDate && (
                                <p>
                                    <strong>Ожидаемая дата доставки:</strong>{' '}
                                    {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}
                                </p>
                            )}

                            <h5 className="mt-4">Товары в заказе</h5>
                            {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Товар</th>
                                            <th>Количество</th>
                                            <th>Цена за единицу</th>
                                            <th>Итого</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.orderItems.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.Product?.name || '—'}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.priceAtPurchase}</td>
                                                <td>{(item.quantity * item.priceAtPurchase).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>Товары не найдены.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


// Компонент для управления отзывами пользователя
const ReviewManagement = () => {
    const { authData } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [editRating, setEditRating] = useState('');
    const [editShortReview, setEditShortReview] = useState('');
    const [editReviewText, setEditReviewText] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                const response = await axios.get('/api/reviews');
                const myReviews = response.data.filter(review => review.userId === authData.user.id);
                setReviews(myReviews);
            } catch (error) {
                console.error('Ошибка при получении отзывов:', error);
                toast.error('Ошибка при получении отзывов');
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, [authData.user.id]);

    const handleEditClick = (review) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditShortReview(review.shortReview);
        setEditReviewText(review.reviewText);
        setShowEditModal(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            try {
                await axios.delete(`/api/reviews/${reviewId}`);
                setReviews(reviews.filter(r => r.id !== reviewId));
                toast.success('Отзыв успешно удалён');
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
                toast.error('Ошибка при удалении отзыва');
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/reviews/${editingReview.id}`, {
                rating: editRating,
                shortReview: editShortReview,
                reviewText: editReviewText,
            });
            setReviews(reviews.map(r => r.id === editingReview.id ? response.data : r));
            toast.success('Отзыв успешно обновлён');
            setShowEditModal(false);
            setEditingReview(null);
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            toast.error('Ошибка при обновлении отзыва');
        }
    };

    return (
        <div>
            <h3>Мои отзывы</h3>
            {loadingReviews ? (
                <p>Загрузка отзывов...</p>
            ) : reviews.length === 0 ? (
                <p>У вас нет отзывов.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Заказ</th>
                            <th>Оценка</th>
                            <th>Краткий отзыв</th>
                            <th>Детальный отзыв</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id}>
                                <td>{review.orderId}</td>
                                <td>{review.rating}</td>
                                <td>{review.shortReview}</td>
                                <td>{review.reviewText}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEditClick(review)}>
                                        Редактировать
                                    </Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteReview(review.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать отзыв</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="editRating" className="mb-3">
                            <Form.Label>Оценка</Form.Label>
                            <Form.Control
                                type="number"
                                value={editRating}
                                onChange={(e) => setEditRating(e.target.value)}
                                min="1"
                                max="5"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="editShortReview" className="mb-3">
                            <Form.Label>Краткий отзыв</Form.Label>
                            <Form.Control
                                type="text"
                                value={editShortReview}
                                onChange={(e) => setEditShortReview(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="editReviewText" className="mb-3">
                            <Form.Label>Детальный отзыв</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editReviewText}
                                onChange={(e) => setEditReviewText(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="primary" type="submit">
                            Сохранить изменения
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};


// Новый компонент для запроса консультации пользователя
const ConsultationRequests = () => {
    const { authData } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoadingRequests(true);
            try {
                // Получаем запросы текущего пользователя (например, используя query параметр)
                const response = await axios.get(`/api/consultationRequests?userId=${authData.user.id}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Ошибка при получении запросов консультации:', error);
                toast.error('Ошибка при получении запросов консультации');
            } finally {
                setLoadingRequests(false);
            }
        };
        fetchRequests();
    }, [authData.user.id]);

    return (
        <div>
            <h3>Запросы консультации</h3>
            {loadingRequests ? (
                <p>Загрузка запросов...</p>
            ) : requests.length === 0 ? (
                <p>У вас нет запросов консультации.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Дата консультации</th>
                            <th>Статус</th>
                            <th>Ваш вопрос</th>
                            <th>Ответ продавца</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{new Date(req.consultationDate).toLocaleDateString()}</td>
                                <td>{req.status}</td>
                                <td>{req.userQuestion}</td>
                                <td>{req.sellerResponse || 'Ожидается'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};


// Родительский компонент, объединяющий все разделы через вкладки
const AccountDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <Container className="my-4">
            <h2>Мой аккаунт</h2>
            <Tabs
                id="account-dashboard-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="profile" title="Профиль">
                    <ProfileDetails />
                </Tab>
                <Tab eventKey="orders" title="История заказов">
                    <OrderHistory />
                </Tab>
                <Tab eventKey="reviews" title="Мои отзывы">
                    <ReviewManagement />
                </Tab>
                <Tab eventKey="consultations" title="Запросы консультации">
                    <ConsultationRequests />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AccountDashboard;
