import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../redux context/api/axiosConfig';
import { AuthContext } from '../../../redux context/AuthContext';
import { toast } from 'react-toastify';

function SellerReviewsManagement() {
    const { authData } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const sellerId = authData.user?.id;
                console.log("sellerId:", sellerId);
                // Используем sellerId вместо authData.equipmentSellerId
                const response = await axios.get(`/api/reviews/seller/${sellerId}`);
                console.log("Полученные отзывы:", response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке отзывов:', error);
                toast.error('Ошибка при загрузке отзывов');
            } finally {
                setLoading(false);
            }
        };
        if (authData.user?.id) {
            fetchReviews();
        }
    }, [authData.user]);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setResponseText(review.sellerResponse || '');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedReview(null);
        setShowModal(false);
    };

    const handleResponseSubmit = async () => {
        try {
            // Отправляем обновление отзыва с ответом продавца через новый endpoint
            const payload = { sellerResponse: responseText };
            const response = await axios.put(`/api/reviews/${selectedReview.id}/response`, payload);
            // Обновляем локальный список отзывов
            setReviews(prev =>
                prev.map((r) => (r.id === selectedReview.id ? response.data : r))
            );
            toast.success('Ответ отправлен');
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при отправке ответа:', error);
            toast.error('Ошибка при отправке ответа');
        }
    };

    return (
        <Container className="my-4">
            <h2>Управление отзывами</h2>
            {loading ? (
                <p>Загрузка отзывов...</p>
            ) : reviews.length === 0 ? (
                <p>Отзывов пока нет.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Товар</th>
                            <th>Оценка</th>
                            <th>Краткий отзыв</th>
                            <th>Удобство установки</th>
                            <th>Качество сборки</th>
                            <th>Техподдержка</th>
                            <th>Цена/качество</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td>{review.id}</td>
                                <td>{review.Product ? review.Product.name : '—'}</td>
                                <td>{review.rating}</td>
                                <td>{review.shortReview}</td>
                                <td>{review.easeOfInstallation}</td>
                                <td>{review.buildQuality}</td>
                                <td>{review.technicalSupport}</td>
                                <td>{review.valueForMoney}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleOpenModal(review)}>
                                        Детали
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Детали отзыва</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReview && (
                        <div>
                            <p><strong>ID:</strong> {selectedReview.id}</p>
                            <p>
                                <strong>Товар:</strong> {selectedReview.Product ? selectedReview.Product.name : '—'}
                            </p>
                            <p><strong>Оценка:</strong> {selectedReview.rating}</p>
                            <p><strong>Краткий отзыв:</strong> {selectedReview.shortReview}</p>
                            <p><strong>Подробный отзыв:</strong> {selectedReview.reviewText}</p>
                            <p><strong>Удобство установки:</strong> {selectedReview.easeOfInstallation}</p>
                            <p><strong>Качество сборки:</strong> {selectedReview.buildQuality}</p>
                            <p><strong>Техническая поддержка:</strong> {selectedReview.technicalSupport}</p>
                            <p><strong>Соотношение цена/качество:</strong> {selectedReview.valueForMoney}</p>
                            <Form.Group controlId="sellerResponse" className="mt-3">
                                <Form.Label>Ваш ответ на отзыв</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleResponseSubmit}>
                        Отправить ответ
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SellerReviewsManagement;
