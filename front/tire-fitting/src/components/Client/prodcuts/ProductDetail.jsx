import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Form
} from 'react-bootstrap';
import axios from '../../../redux context/api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Компонент для выбора рейтинга с помощью звезд
const StarRating = ({ rating, onChange, readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div>
            {[1, 2, 3, 4, 5].map((value) => (
                <span
                    key={value}
                    onClick={() => {
                        if (!readonly) onChange(value);
                    }}
                    onMouseEnter={() => {
                        if (!readonly) setHoverRating(value);
                    }}
                    onMouseLeave={() => {
                        if (!readonly) setHoverRating(0);
                    }}
                    style={{
                        cursor: readonly ? 'default' : 'pointer',
                        fontSize: '1.5rem',
                        color: (hoverRating || rating) >= value ? '#ffc107' : '#e4e5e9'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [technicalDocs, setTechnicalDocs] = useState([]); // Состояние для технической документации

    // Модальное окно для создания отзыва
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        orderId: '',
        rating: 0,
        shortReview: '',
        reviewText: '',
        easeOfInstallation: 0,
        buildQuality: 0,
        technicalSupport: 0,
        valueForMoney: 0,
    });

    // Модальное окно для запроса консультации
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [consultationForm, setConsultationForm] = useState({
        consultationDate: '',
        userQuestion: ''
    });

    // Состояние заказов пользователя, в которых есть этот товар
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (product) {
            const fetchUserOrders = async () => {
                try {
                    const response = await axios.get('/api/orders');
                    const filteredOrders = response.data.filter(order =>
                        order.orderItems &&
                        order.orderItems.some(item => item.productId === product.id)
                    );
                    setUserOrders(filteredOrders);
                } catch (error) {
                    console.error('Ошибка при получении заказов:', error);
                    toast.error('Ошибка при получении ваших заказов');
                }
            };
            fetchUserOrders();

            const fetchReviews = async () => {
                try {
                    const response = await axios.get('/api/reviews');
                    const productReviews = response.data.filter(review => review.productId === product.id);
                    setReviews(productReviews);
                } catch (error) {
                    console.error('Ошибка при получении отзывов:', error);
                    toast.error('Ошибка при получении отзывов');
                }
            };
            fetchReviews();

            // Запрос для получения технической документации по товару
            const fetchTechnicalDocs = async () => {
                try {
                    const response = await axios.get(`/api/technicalDocuments?productId=${product.id}`);
                    setTechnicalDocs(response.data);
                } catch (error) {
                    console.error('Ошибка при получении технической документации:', error);
                    toast.error('Ошибка при получении технической документации');
                }
            };
            fetchTechnicalDocs();
        }
    }, [product]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Ошибка при получении товара:', error);
            toast.error('Ошибка при получении товара');
        } finally {
            setLoading(false);
        }
    };

    // Добавление товара в корзину (количество = 1)
    const handleAddToCart = async () => {
        try {
            await axios.post('/api/carts/add', { productId: product.id, quantity: 1 });
            toast.success('Товар добавлен в корзину');
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            toast.error('Ошибка при добавлении в корзину');
        }
    };

    // Открытие модального окна для запроса консультации
    const openConsultationModal = () => {
        setConsultationForm({ consultationDate: '', userQuestion: '' });
        setShowConsultationModal(true);
    };

    const closeConsultationModal = () => {
        setShowConsultationModal(false);
    };

    // Отправка запроса консультации
    const handleConsultationSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                equipmentSellerId: product.EquipmentSeller.id,
                productId: product.id,
                consultationDate: consultationForm.consultationDate,
                userQuestion: consultationForm.userQuestion,
            };
            await axios.post('/api/consultationRequests', payload);
            toast.success('Запрос консультации отправлен');
            closeConsultationModal();
        } catch (error) {
            console.error('Ошибка при отправке запроса консультации:', error);
            toast.error('Ошибка при отправке запроса консультации');
        }
    };

    // Открытие модального окна для добавления отзыва
    const openReviewModal = () => {
        setReviewForm({
            orderId: '',
            productId: product.id,
            rating: 0,
            shortReview: '',
            reviewText: '',
            easeOfInstallation: 0,
            buildQuality: 0,
            technicalSupport: 0,
            valueForMoney: 0,
        });
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
    };

    // Отправка отзыва
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reviews', reviewForm);
            toast.success('Отзыв отправлен');
            closeReviewModal();
            setReviews(prev => [
                ...prev,
                { ...reviewForm, id: Date.now(), User: { firstName: 'Вы', lastName: '' } }
            ]);
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            toast.error('Ошибка при отправке отзыва');
        }
    };

    if (loading) {
        return (
            <Container className="my-4">
                <p>Загрузка...</p>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="my-4">
                <p>Товар не найден.</p>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
                Назад
            </Button>
            <Row>
                <Col md={6}>
                    {product.photo ? (
                        <Card.Img
                            src={`http://localhost:5000${product.photo}`}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                    ) : (
                        <p>Фото отсутствует</p>
                    )}
                    {product.documentation && (
                        <Button
                            variant="info"
                            href={`http://localhost:5000${product.documentation}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3"
                        >
                            Скачать документацию
                        </Button>
                    )}
                </Col>
                <Col md={6}>
                    <h2>{product.name}</h2>
                    <p><strong>Цена:</strong> {product.price} ₽</p>
                    <p><strong>Категория:</strong> {product.category}</p>
                    <p><strong>Бренд:</strong> {product.brand}</p>
                    {product.model && <p><strong>Модель:</strong> {product.model}</p>}
                    <p><strong>Состояние:</strong> {product.condition}</p>
                    {product.warranty && <p><strong>Гарантия:</strong> {product.warranty}</p>}
                    <p><strong>Наличие:</strong> {product.stock}</p>
                    <p><strong>Тип оборудования:</strong> {product.equipmentType}</p>
                    <p><strong>Источник питания:</strong> {product.powerSupply}</p>
                    {product.voltage && <p><strong>Напряжение:</strong> {product.voltage}</p>}
                    {product.capacity && <p><strong>Мощность/Емкость:</strong> {product.capacity}</p>}
                    {product.wheelDiameterRange && <p><strong>Диапазон диаметров колес:</strong> {product.wheelDiameterRange}</p>}
                    {product.operatingPressure && <p><strong>Рабочее давление:</strong> {product.operatingPressure}</p>}
                    {product.dimensions && <p><strong>Габариты:</strong> {product.dimensions}</p>}
                    {product.weight && <p><strong>Вес:</strong> {product.weight}</p>}
                    {product.countryOfOrigin && <p><strong>Страна производства:</strong> {product.countryOfOrigin}</p>}
                    <p>
                        <strong>Установка:</strong> {product.installationRequired ? 'Требуется' : 'Не требуется'}
                    </p>
                    {product.EquipmentSeller && (
                        <div className="mt-3">
                            <h5>Продавец</h5>
                            <p><strong>Компания:</strong> {product.EquipmentSeller.companyName}</p>
                            <p><strong>Контактное лицо:</strong> {product.EquipmentSeller.contactPerson}</p>
                            <p><strong>Телефон:</strong> {product.EquipmentSeller.phone}</p>
                            <p><strong>Адрес:</strong> {product.EquipmentSeller.address}</p>
                        </div>
                    )}
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <h4>Описание товара</h4>
                    <p>{product.description}</p>
                </Col>
            </Row>

            {/* Секция для технической документации */}
            <Row className="mt-4">
                <Col>
                    <h4>Техническая документация</h4>
                    {technicalDocs.length === 0 ? (
                        <p>Документация отсутствует.</p>
                    ) : (
                        technicalDocs.map((doc) => (
                            <Card key={doc.id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{doc.documentType}</Card.Title>
                                    <Card.Text>
                                        <strong>Язык:</strong> {doc.language}<br />
                                        <strong>Дата загрузки:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </Card.Text>
                                    <Button
                                        variant="info"
                                        href={`http://localhost:5000${doc.filePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Скачать документ
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>

            <Row className="mt-4">
                <Col className="d-flex gap-3">
                    <Button variant="success" onClick={handleAddToCart}>
                        Добавить в корзину
                    </Button>
                    <Button variant="primary" onClick={openConsultationModal}>
                        Запрос консультации
                    </Button>
                    <Button variant="warning" onClick={openReviewModal}>
                        Оставить отзыв
                    </Button>
                </Col>
            </Row>

            {/* Секция для отображения отзывов */}
            <Row className="mt-5">
                <Col>
                    <h4>Отзывы о товаре</h4>
                    {reviews.length === 0 ? (
                        <p>Отзывов пока нет.</p>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review.id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-2">
                                        <StarRating rating={review.rating} readonly />
                                        <span className="ms-2">
                                            {review.User ? `${review.User.firstName} ${review.User.lastName}` : 'Аноним'}
                                        </span>
                                    </div>
                                    <Card.Title>{review.shortReview}</Card.Title>
                                    {review.reviewText && <Card.Text>{review.reviewText}</Card.Text>}
                                    <div className="d-flex gap-3">
                                        <small>Легкость установки: <StarRating rating={review.easeOfInstallation} readonly /></small>
                                        <small>Качество сборки: <StarRating rating={review.buildQuality} readonly /></small>
                                        <small>Техподдержка: <StarRating rating={review.technicalSupport} readonly /></small>
                                        <small>Цена/качество: <StarRating rating={review.valueForMoney} readonly /></small>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>

            {/* Модальное окно для запроса консультации */}
            <Modal show={showConsultationModal} onHide={closeConsultationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Запрос консультации</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleConsultationSubmit}>
                        <Form.Group controlId="consultationDate" className="mb-3">
                            <Form.Label>Дата консультации</Form.Label>
                            <Form.Control
                                type="date"
                                value={consultationForm.consultationDate}
                                onChange={(e) =>
                                    setConsultationForm((prev) => ({
                                        ...prev,
                                        consultationDate: e.target.value,
                                    }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="userQuestion" className="mb-3">
                            <Form.Label>Ваш вопрос</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={consultationForm.userQuestion}
                                onChange={(e) =>
                                    setConsultationForm((prev) => ({
                                        ...prev,
                                        userQuestion: e.target.value,
                                    }))
                                }
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Отправить запрос
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для оставления отзыва */}
            <Modal show={showReviewModal} onHide={closeReviewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Оставить отзыв</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleReviewSubmit}>
                        <Form.Group controlId="orderId" className="mb-3">
                            <Form.Label>Выберите заказ</Form.Label>
                            <Form.Select
                                value={reviewForm.orderId}
                                onChange={(e) =>
                                    setReviewForm((prev) => ({ ...prev, orderId: e.target.value }))
                                }
                                required
                            >
                                <option value="">Выберите заказ</option>
                                {userOrders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                        {order.trackingNumber} - {order.orderItems && order.orderItems.map(item => item.Product ? item.Product.name : '').join(', ')}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="rating" className="mb-3">
                            <Form.Label>Общая оценка</Form.Label>
                            <StarRating
                                rating={Number(reviewForm.rating)}
                                onChange={(value) =>
                                    setReviewForm((prev) => ({ ...prev, rating: value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="shortReview" className="mb-3">
                            <Form.Label>Краткий отзыв</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Кратко опишите товар"
                                value={reviewForm.shortReview}
                                onChange={(e) =>
                                    setReviewForm((prev) => ({ ...prev, shortReview: e.target.value }))
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="reviewText" className="mb-3">
                            <Form.Label>Подробный отзыв</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reviewForm.reviewText}
                                onChange={(e) =>
                                    setReviewForm((prev) => ({ ...prev, reviewText: e.target.value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="easeOfInstallation" className="mb-3">
                            <Form.Label>Легкость установки</Form.Label>
                            <StarRating
                                rating={Number(reviewForm.easeOfInstallation)}
                                onChange={(value) =>
                                    setReviewForm((prev) => ({ ...prev, easeOfInstallation: value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="buildQuality" className="mb-3">
                            <Form.Label>Качество сборки</Form.Label>
                            <StarRating
                                rating={Number(reviewForm.buildQuality)}
                                onChange={(value) =>
                                    setReviewForm((prev) => ({ ...prev, buildQuality: value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="technicalSupport" className="mb-3">
                            <Form.Label>Техническая поддержка</Form.Label>
                            <StarRating
                                rating={Number(reviewForm.technicalSupport)}
                                onChange={(value) =>
                                    setReviewForm((prev) => ({ ...prev, technicalSupport: value }))
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="valueForMoney" className="mb-3">
                            <Form.Label>Соотношение цена/качество</Form.Label>
                            <StarRating
                                rating={Number(reviewForm.valueForMoney)}
                                onChange={(value) =>
                                    setReviewForm((prev) => ({ ...prev, valueForMoney: value }))
                                }
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Отправить отзыв
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ProductDetail;
