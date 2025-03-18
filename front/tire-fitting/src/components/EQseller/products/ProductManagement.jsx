import React, { useState, useEffect } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './ProductManagementStyles.css';

function ProductManagement() {
    // Состояние для списка товаров
    const [products, setProducts] = useState([]);
    // Состояние поля поиска
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние модального окна для добавления/редактирования
    const [showModal, setShowModal] = useState(false);
    // Режим модального окна: 'add' или 'edit'
    const [modalMode, setModalMode] = useState('add');
    // Текущий id редактируемого товара (при edit)
    const [currentProductId, setCurrentProductId] = useState(null);

    // Начальное состояние формы товара
    const initialFormState = {
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        model: '',
        condition: 'new',
        warranty: '',
        stock: '',
        equipmentType: 'шиномонтажный стенд',
        powerSupply: 'электрическое',
        voltage: '',
        capacity: '',
        wheelDiameterRange: '',
        operatingPressure: '',
        dimensions: '',
        weight: '',
        countryOfOrigin: '',
        installationRequired: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    // Состояния для файлов (фото и документация)
    const [photoFile, setPhotoFile] = useState(null);
    const [documentationFile, setDocumentationFile] = useState(null);

    // Состояние для модального окна просмотра деталей товара
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsProduct, setDetailsProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Получение списка товаров
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            toast.error('Ошибка при получении товаров');
        }
    };

    // Фильтрация товаров по поисковому запросу
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Открытие модального окна для добавления/редактирования
    const handleShowModal = (mode, product = null) => {
        setModalMode(mode);
        if (mode === 'edit' && product) {
            setCurrentProductId(product.id);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                brand: product.brand || '',
                model: product.model || '',
                condition: product.condition || 'new',
                warranty: product.warranty || '',
                stock: product.stock || '',
                equipmentType: product.equipmentType || 'шиномонтажный стенд',
                powerSupply: product.powerSupply || 'электрическое',
                voltage: product.voltage || '',
                capacity: product.capacity || '',
                wheelDiameterRange: product.wheelDiameterRange || '',
                operatingPressure: product.operatingPressure || '',
                dimensions: product.dimensions || '',
                weight: product.weight || '',
                countryOfOrigin: product.countryOfOrigin || '',
                installationRequired: product.installationRequired || false,
            });
        } else {
            setCurrentProductId(null);
            setFormData(initialFormState);
        }
        // Сброс состояния файлов
        setPhotoFile(null);
        setDocumentationFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Открытие модального окна для просмотра деталей товара
    const handleViewDetails = (product) => {
        setDetailsProduct(product);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setDetailsProduct(null);
    };

    // Обработка изменения полей формы
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Обработка изменения файлов
    const handleFileChange = (e) => {
        const { name } = e.target;
        if (name === 'photo') {
            setPhotoFile(e.target.files[0]);
        } else if (name === 'documentation') {
            setDocumentationFile(e.target.files[0]);
        }
    };

    // Отправка данных формы на сервер (добавление или редактирование)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (photoFile) {
            data.append('photo', photoFile);
        }
        if (documentationFile) {
            data.append('documentation', documentationFile);
        }
        try {
            if (modalMode === 'add') {
                await axios.post('/api/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Продукт успешно добавлен');
            } else {
                await axios.put(`/api/products/${currentProductId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Продукт успешно обновлен');
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при сохранении продукта:', error);
            toast.error('Ошибка при сохранении продукта');
        }
    };

    // Удаление товара
    const handleDelete = async (productId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
            try {
                await axios.delete(`/api/products/${productId}`);
                toast.success('Продукт успешно удален');
                fetchProducts();
            } catch (error) {
                console.error('Ошибка при удалении продукта:', error);
                toast.error('Ошибка при удалении продукта');
            }
        }
    };

    return (
        <Container className="my-4">
            <h2>Управление товарами</h2>
            {/* Поле поиска */}
            <Form.Group className="mb-3" controlId="searchProducts">
                <Form.Control
                    type="text"
                    placeholder="Поиск по названию товара..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" className="mb-3" onClick={() => handleShowModal('add')}>
                Добавить продукт
            </Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Наличие</th>
                        <th>Категория</th>
                        <th>Тип оборудования</th>
                        <th>Источник питания</th>
                        <th>Установка</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.category}</td>
                                <td>{product.equipmentType}</td>
                                <td>{product.powerSupply}</td>
                                <td>{product.installationRequired ? 'Да' : 'Нет'}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleViewDetails(product)}>
                                        Просмотр
                                    </Button>{' '}
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal('edit', product)}>
                                        Редактировать
                                    </Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Нет продуктов для отображения
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'add' ? 'Добавить продукт' : 'Редактировать продукт'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Название</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formPrice">
                                    <Form.Label>Цена</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formCategory">
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formBrand">
                                    <Form.Label>Бренд</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formModel">
                                    <Form.Label>Модель</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formCondition">
                                    <Form.Label>Состояние</Form.Label>
                                    <Form.Select name="condition" value={formData.condition} onChange={handleFormChange}>
                                        <option value="new">Новый</option>
                                        <option value="used">Б/у</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formWarranty">
                                    <Form.Label>Гарантия</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="warranty"
                                        value={formData.warranty}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formStock">
                                    <Form.Label>Наличие</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formEquipmentType">
                                    <Form.Label>Тип оборудования</Form.Label>
                                    <Form.Select name="equipmentType" value={formData.equipmentType} onChange={handleFormChange}>
                                        <option value="шиномонтажный стенд">шиномонтажный стенд</option>
                                        <option value="балансировочный стенд">балансировочный стенд</option>
                                        <option value="домкрат">домкрат</option>
                                        <option value="компрессор">компрессор</option>
                                        <option value="вулканизатор">вулканизатор</option>
                                        <option value="инструменты">инструменты</option>
                                        <option value="расходные материалы">расходные материалы</option>
                                        <option value="подъемники">подъемники</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formPowerSupply">
                                    <Form.Label>Источник питания</Form.Label>
                                    <Form.Select name="powerSupply" value={formData.powerSupply} onChange={handleFormChange}>
                                        <option value="электрическое">электрическое</option>
                                        <option value="пневматическое">пневматическое</option>
                                        <option value="гидравлическое">гидравлическое</option>
                                        <option value="ручное">ручное</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formInstallationRequired">
                                    <Form.Label>Установка</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="installationRequired"
                                        label="Требуется установка"
                                        checked={formData.installationRequired}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formVoltage">
                                    <Form.Label>Напряжение</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="voltage"
                                        value={formData.voltage}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formCapacity">
                                    <Form.Label>Мощность / Емкость</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formWheelDiameterRange">
                                    <Form.Label>Диапазон диаметров колес</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="wheelDiameterRange"
                                        value={formData.wheelDiameterRange}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formOperatingPressure">
                                    <Form.Label>Рабочее давление</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="operatingPressure"
                                        value={formData.operatingPressure}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formDimensions">
                                    <Form.Label>Габариты</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dimensions"
                                        value={formData.dimensions}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" controlId="formWeight">
                                    <Form.Label>Вес</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formCountryOfOrigin">
                                    <Form.Label>Страна производства</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="countryOfOrigin"
                                        value={formData.countryOfOrigin}
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formDocumentation">
                                    <Form.Label>Документация</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="documentation"
                                        onChange={handleFileChange}
                                        accept="application/pdf,image/*"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="formPhoto">
                            <Form.Label>Фото</Form.Label>
                            <Form.Control
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalMode === 'add' ? 'Добавить продукт' : 'Сохранить изменения'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальное окно для просмотра полной информации о товаре */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Детали продукта</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailsProduct ? (
                        <>
                            <h4>{detailsProduct.name}</h4>
                            <p>
                                <strong>Описание:</strong> {detailsProduct.description}
                            </p>
                            <p>
                                <strong>Цена:</strong> {detailsProduct.price}
                            </p>
                            <p>
                                <strong>Категория:</strong> {detailsProduct.category}
                            </p>
                            <p>
                                <strong>Бренд:</strong> {detailsProduct.brand}
                            </p>
                            <p>
                                <strong>Модель:</strong> {detailsProduct.model}
                            </p>
                            <p>
                                <strong>Состояние:</strong> {detailsProduct.condition}
                            </p>
                            <p>
                                <strong>Гарантия:</strong> {detailsProduct.warranty}
                            </p>
                            <p>
                                <strong>Наличие:</strong> {detailsProduct.stock}
                            </p>
                            <p>
                                <strong>Тип оборудования:</strong> {detailsProduct.equipmentType}
                            </p>
                            <p>
                                <strong>Источник питания:</strong> {detailsProduct.powerSupply}
                            </p>
                            <p>
                                <strong>Напряжение:</strong> {detailsProduct.voltage}
                            </p>
                            <p>
                                <strong>Мощность/Емкость:</strong> {detailsProduct.capacity}
                            </p>
                            <p>
                                <strong>Диапазон диаметров колес:</strong> {detailsProduct.wheelDiameterRange}
                            </p>
                            <p>
                                <strong>Рабочее давление:</strong> {detailsProduct.operatingPressure}
                            </p>
                            <p>
                                <strong>Габариты:</strong> {detailsProduct.dimensions}
                            </p>
                            <p>
                                <strong>Вес:</strong> {detailsProduct.weight}
                            </p>
                            <p>
                                <strong>Страна производства:</strong> {detailsProduct.countryOfOrigin}
                            </p>
                            <p>
                                <strong>Установка:</strong> {detailsProduct.installationRequired ? 'Да' : 'Нет'}
                            </p>
                            {detailsProduct.photo && (
                                <div>
                                    <strong>Фото:</strong>
                                    <br />
                                    <img
                                        src={`http://localhost:5000${detailsProduct.photo}`}
                                        alt={detailsProduct.name}
                                        style={{ maxWidth: '100%' }}
                                    />
                                </div>
                            )}
                            {detailsProduct.documentation && (
                                <p>
                                    <strong>Документация:</strong>{' '}
                                    <a
                                        href={`http://localhost:5000${detailsProduct.documentation}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Скачать
                                    </a>
                                </p>
                            )}
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

export default ProductManagement;
