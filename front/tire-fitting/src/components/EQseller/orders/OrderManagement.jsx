import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { Container, Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../redux context/AuthContext';
import * as XLSX from 'xlsx';
import {
    Document,
    Packer,
    Paragraph,
    Table as DocxTable,
    TableRow,
    TableCell,
    HeadingLevel,
} from 'docx';

const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function SellerOrderManagement() {
    const { authData } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Состояния для модального окна деталей/изменения заказа
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newEstimatedDeliveryDate, setNewEstimatedDeliveryDate] = useState('');

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    // Получение заказов для продавца
    const fetchSellerOrders = async () => {
        try {
            const response = await axios.get('/api/orders/sellerOrders');
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при получении заказов продавца:', error);
            toast.error('Ошибка при получении заказов');
        }
    };

    // Фильтрация заказов по статусу и диапазону дат
    const filteredOrders = orders.filter((order) => {
        let statusMatch = true;
        let dateMatch = true;
        if (filterStatus) {
            statusMatch = order.status === filterStatus;
        }
        if (filterStartDate) {
            dateMatch = new Date(order.orderDate) >= new Date(filterStartDate);
        }
        if (filterEndDate) {
            dateMatch = dateMatch && new Date(order.orderDate) <= new Date(filterEndDate);
        }
        return statusMatch && dateMatch;
    });

    // Открытие модального окна с деталями заказа
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        // Устанавливаем значение даты в формате YYYY-MM-DD
        setNewEstimatedDeliveryDate(
            order.estimatedDeliveryDate
                ? new Date(order.estimatedDeliveryDate).toISOString().slice(0, 10)
                : ''
        );
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrder(null);
    };

    // Обновление заказа: статус + предполагаемая дата доставки
    const handleUpdateOrder = async () => {
        if (!allowedStatuses.includes(newStatus)) {
            toast.error('Выбран недопустимый статус');
            return;
        }
        try {
            // Обновляем статус заказа
            await axios.put(`/api/orders/${selectedOrder.id}/status`, { status: newStatus });
            // Если дата изменилась, обновляем детали заказа (эндпоинт updateOrderDetails)
            const currentDate = selectedOrder.estimatedDeliveryDate
                ? new Date(selectedOrder.estimatedDeliveryDate).toISOString().slice(0, 10)
                : '';
            if (newEstimatedDeliveryDate && newEstimatedDeliveryDate !== currentDate) {
                await axios.put(`/api/orders/${selectedOrder.id}/details`, {
                    estimatedDeliveryDate: newEstimatedDeliveryDate,
                });
            }
            toast.success('Данные заказа обновлены');
            fetchSellerOrders();
            handleCloseDetailsModal();
        } catch (error) {
            console.error('Ошибка при обновлении заказа:', error);
            toast.error('Ошибка при обновлении заказа');
        }
    };

    // Экспорт в Excel
    const handleExportExcel = () => {
        const data = filteredOrders.map(order => ({
            'ID заказа': order.id,
            'Дата заказа': new Date(order.orderDate).toLocaleString(),
            'Общая стоимость': order.totalCost,
            'Способ оплаты': order.paymentMethod,
            'Трек-номер': order.trackingNumber,
            'Статус': order.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders_report.xlsx');
    };

    // Экспорт в DOCX
    const handleExportDocx = async () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "Отчет заказов",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({ text: "\n" }),
                    new DocxTable({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("ID заказа")] }),
                                    new TableCell({ children: [new Paragraph("Дата заказа")] }),
                                    new TableCell({ children: [new Paragraph("Общая стоимость")] }),
                                    new TableCell({ children: [new Paragraph("Способ оплаты")] }),
                                    new TableCell({ children: [new Paragraph("Трек-номер")] }),
                                    new TableCell({ children: [new Paragraph("Статус")] }),
                                ]
                            }),
                            ...filteredOrders.map(order =>
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph(String(order.id))] }),
                                        new TableCell({ children: [new Paragraph(new Date(order.orderDate).toLocaleString())] }),
                                        new TableCell({ children: [new Paragraph(String(order.totalCost))] }),
                                        new TableCell({ children: [new Paragraph(order.paymentMethod)] }),
                                        new TableCell({ children: [new Paragraph(order.trackingNumber)] }),
                                        new TableCell({ children: [new Paragraph(order.status)] }),
                                    ]
                                })
                            )
                        ]
                    })
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'orders_report.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Container className="my-4">
            <h2>Управление заказами (Панель продавца)</h2>
            <Form className="mb-3">
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="filterStatus">
                            <Form.Label>Статус заказа</Form.Label>
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
                    <Col md={4}>
                        <Form.Group controlId="filterStartDate">
                            <Form.Label>Начало периода</Form.Label>
                            <Form.Control
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="filterEndDate">
                            <Form.Label>Конец периода</Form.Label>
                            <Form.Control
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            {/* Кнопки для экспорта отчета */}
            <Row className="mb-3">
                <Col md={6}>
                    <Button variant="success" onClick={handleExportExcel} className="me-2">
                        Экспорт в Excel
                    </Button>
                    <Button variant="info" onClick={handleExportDocx}>
                        Экспорт в DOCX
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата заказа</th>
                        <th>Общая стоимость</th>
                        <th>Способ оплаты</th>
                        <th>Трек-номер</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>{order.totalCost}</td>
                                <td>{order.paymentMethod}</td>
                                <td>{order.trackingNumber}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleViewDetails(order)}>
                                        Детали
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Нет заказов для отображения
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Модальное окно для просмотра полной информации о заказе и изменения данных */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Детали заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder ? (
                        <>
                            <p><strong>ID заказа:</strong> {selectedOrder.id}</p>
                            <p>
                                <strong>Дата:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}
                            </p>
                            <p><strong>Общая стоимость:</strong> {selectedOrder.totalCost}</p>
                            <p>
                                <strong>Способ оплаты:</strong> {selectedOrder.paymentMethod}
                            </p>
                            <p>
                                <strong>Трек-номер:</strong> {selectedOrder.trackingNumber}
                            </p>
                            <p><strong>Статус:</strong> {selectedOrder.status}</p>

                            {/* Дополнительная информация */}
                            {selectedOrder.deliveryAddress && (
                                <p>
                                    <strong>Адрес доставки:</strong> {selectedOrder.deliveryAddress}
                                </p>
                            )}
                            {selectedOrder.installationRequested !== undefined && (
                                <p>
                                    <strong>Установка:</strong> {selectedOrder.installationRequested ? 'Да' : 'Нет'}
                                </p>
                            )}
                            {selectedOrder.deliveryMethod && (
                                <p>
                                    <strong>Способ доставки:</strong> {selectedOrder.deliveryMethod}
                                </p>
                            )}
                            {selectedOrder.estimatedDeliveryDate && (
                                <p>
                                    <strong>Предполагаемая дата доставки:</strong>{' '}
                                    {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString()}
                                </p>
                            )}
                            {selectedOrder.User && (
                                <p>
                                    <strong>Клиент:</strong> {selectedOrder.User.firstName} {selectedOrder.User.lastName} (Телефон: {selectedOrder.User.phone})
                                </p>
                            )}

                            {/* Список товаров заказа */}
                            {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                                <>
                                    <h5 className="mt-3">Товары заказа</h5>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Продукт</th>
                                                <th>Количество</th>
                                                <th>Цена покупки</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.orderItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.Product?.name || 'N/A'}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.priceAtPurchase}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                            )}

                            <hr />
                            <h5>Изменить данные заказа</h5>
                            <Form.Group controlId="newStatus" className="mb-3">
                                <Form.Label>Новый статус</Form.Label>
                                <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                    {allowedStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="newEstimatedDeliveryDate" className="mb-3">
                                <Form.Label>Новая предполагаемая дата доставки</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newEstimatedDeliveryDate}
                                    onChange={(e) => setNewEstimatedDeliveryDate(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleUpdateOrder}>
                                Обновить данные заказа
                            </Button>
                        </>
                    ) : (
                        <p>Загрузка данных...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SellerOrderManagement;
