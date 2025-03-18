import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { Container, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../redux context/AuthContext';

const allowedStatuses = ['запрошена', 'в работе', 'проведена', 'отменена'];

function ConsultationRequests() {
    const { authData } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newSellerResponse, setNewSellerResponse] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    // Получение списка запросов консультаций
    const fetchRequests = async () => {
        try {
            // Если пользователь является продавцом, можно добавить фильтр по equipmentSellerId
            // Пример: axios.get(`/api/consultationRequests?equipmentSellerId=${authData.equipmentSellerId}`)
            const response = await axios.get('/api/consultationRequests');
            setRequests(response.data);
        } catch (error) {
            console.error('Ошибка при получении запросов консультации:', error);
            toast.error('Ошибка при получении запросов консультации');
        }
    };

    // Фильтрация списка по статусу (если выбрано)
    const filteredRequests = requests.filter((req) => {
        if (!filterStatus) return true;
        return req.status === filterStatus;
    });

    // Открытие модального окна с подробностями запроса
    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setNewStatus(request.status);
        setNewSellerResponse(request.sellerResponse || '');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    // Обновление запроса консультации (отправка ответа и изменение статуса)
    const handleUpdateRequest = async () => {
        try {
            const payload = {
                status: newStatus,
                sellerResponse: newSellerResponse,
            };
            await axios.put(`/api/consultationRequests/${selectedRequest.id}`, payload);
            toast.success('Запрос обновлен');
            fetchRequests();
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при обновлении запроса консультации:', error);
            toast.error('Ошибка при обновлении запроса консультации');
        }
    };

    return (
        <Container className="my-4">
            <h2>Запросы консультаций</h2>

            {/* Фильтр по статусу */}
            <Form className="mb-3">
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="filterStatus">
                            <Form.Label>Статус запроса</Form.Label>
                            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Все</option>
                                {allowedStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            {/* Таблица с запросами */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата консультации</th>
                        <th>Продукт</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests && filteredRequests.length > 0 ? (
                        filteredRequests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.id}</td>
                                <td>{new Date(req.consultationDate).toLocaleString()}</td>
                                <td>{req.Product ? req.Product.name : 'N/A'}</td>
                                <td>{req.status}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleViewDetails(req)}>
                                        Детали
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Нет запросов для отображения
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Модальное окно для просмотра деталей запроса и отправки ответа */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Детали запроса консультации</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest ? (
                        <>
                            <p><strong>ID:</strong> {selectedRequest.id}</p>
                            <p>
                                <strong>Дата консультации:</strong>{' '}
                                {new Date(selectedRequest.consultationDate).toLocaleString()}
                            </p>
                            {selectedRequest.Product && (
                                <p>
                                    <strong>Продукт:</strong> {selectedRequest.Product.name}
                                    {selectedRequest.Product.price && ` – ${selectedRequest.Product.price}`}
                                </p>
                            )}
                            {selectedRequest.User && (
                                <p>
                                    <strong>Клиент:</strong> {selectedRequest.User.firstName} {selectedRequest.User.lastName} (
                                    {selectedRequest.User.email})
                                </p>
                            )}
                            {selectedRequest.userQuestion && (
                                <p>
                                    <strong>Вопрос клиента:</strong> {selectedRequest.userQuestion}
                                </p>
                            )}
                            <Form.Group controlId="newStatus" className="mb-3">
                                <Form.Label>Статус запроса</Form.Label>
                                <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                    {allowedStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="newSellerResponse" className="mb-3">
                                <Form.Label>Ответ продавца</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newSellerResponse}
                                    onChange={(e) => setNewSellerResponse(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleUpdateRequest}>
                                Отправить ответ
                            </Button>
                        </>
                    ) : (
                        <p>Загрузка данных...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ConsultationRequests;
