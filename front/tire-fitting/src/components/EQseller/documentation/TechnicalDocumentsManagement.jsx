import React, { useState, useEffect } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import Select from 'react-select';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

function TechnicalDocumentsManagement() {
    // Состояние для списка документов
    const [documents, setDocuments] = useState([]);
    // Состояние поля поиска по названию продукта
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние модального окна для добавления/редактирования документа
    const [showModal, setShowModal] = useState(false);
    // Режим модального окна: 'add' или 'edit'
    const [modalMode, setModalMode] = useState('add');
    // Текущий id редактируемого документа
    const [currentDocumentId, setCurrentDocumentId] = useState(null);

    // Начальное состояние формы документа
    const initialFormState = {
        productId: '',
        documentType: 'инструкция',
        language: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    // Состояние для загружаемого файла (техническая документация)
    const [documentFile, setDocumentFile] = useState(null);

    // Состояние для списка продуктов (для выпадающего списка)
    const [productOptions, setProductOptions] = useState([]);

    // Состояние для модального окна просмотра деталей документа
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsDocument, setDetailsDocument] = useState(null);

    useEffect(() => {
        fetchDocuments();
        fetchProductsSelect();
    }, []);

    // Получение списка документов с сервера
    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/api/technicalDocuments');
            setDocuments(response.data);
        } catch (error) {
            console.error('Ошибка при получении документов:', error);
            toast.error('Ошибка при получении документов');
        }
    };

    // Получение списка продуктов для выпадающего списка
    const fetchProductsSelect = async () => {
        try {
            const response = await axios.get('/api/products');
            const options = response.data.map((product) => ({
                value: product.id,
                label: product.name,
            }));
            setProductOptions(options);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    // Фильтрация документов по названию продукта (если информация о продукте присутствует)
    const filteredDocuments = documents.filter((doc) => {
        if (!searchQuery.trim()) return true;
        return doc.Product && doc.Product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Открытие модального окна для добавления или редактирования документа
    const handleShowModal = (mode, document = null) => {
        setModalMode(mode);
        if (mode === 'edit' && document) {
            setCurrentDocumentId(document.id);
            setFormData({
                productId: document.productId || '',
                documentType: document.documentType || 'инструкция',
                language: document.language || '',
            });
        } else {
            setCurrentDocumentId(null);
            setFormData(initialFormState);
        }
        setDocumentFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Обработка изменения полей формы
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Обработка выбора файла
    const handleFileChange = (e) => {
        setDocumentFile(e.target.files[0]);
    };

    // Отправка данных формы на сервер (добавление или редактирование документа)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (documentFile) {
            data.append('file', documentFile);
        }
        try {
            if (modalMode === 'add') {
                await axios.post('/api/technicalDocuments', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Документ успешно загружен');
            } else {
                await axios.put(`/api/technicalDocuments/${currentDocumentId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Документ успешно обновлен');
            }
            fetchDocuments();
            handleCloseModal();
        } catch (error) {
            console.error('Ошибка при сохранении документа:', error);
            toast.error('Ошибка при сохранении документа');
        }
    };

    // Удаление документа
    const handleDelete = async (docId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
            try {
                await axios.delete(`/api/technicalDocuments/${docId}`);
                toast.success('Документ успешно удален');
                fetchDocuments();
            } catch (error) {
                console.error('Ошибка при удалении документа:', error);
                toast.error('Ошибка при удалении документа');
            }
        }
    };

    // Открытие модального окна для просмотра деталей документа
    const handleViewDetails = (document) => {
        setDetailsDocument(document);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setDetailsDocument(null);
    };

    return (
        <Container className="my-4">
            <h2>Управление технической документацией</h2>
            {/* Поле поиска по названию продукта */}
            <Form.Group className="mb-3" controlId="searchDocuments">
                <Form.Control
                    type="text"
                    placeholder="Поиск по названию продукта..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" className="mb-3" onClick={() => handleShowModal('add')}>
                Загрузить новый документ
            </Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Продукт</th>
                        <th>Тип документа</th>
                        <th>Язык</th>
                        <th>Дата загрузки</th>
                        <th>Файл</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDocuments && filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.id}</td>
                                <td>{doc.Product ? doc.Product.name : 'Не указано'}</td>
                                <td>{doc.documentType}</td>
                                <td>{doc.language}</td>
                                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                                <td>
                                    {doc.filePath ? (
                                        <a
                                            href={`http://localhost:5000${doc.filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Скачать
                                        </a>
                                    ) : (
                                        'Нет файла'
                                    )}
                                </td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleShowModal('edit', doc)}>
                                        Редактировать
                                    </Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Нет документов для отображения
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Модальное окно для добавления/редактирования документа */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? 'Загрузить документ' : 'Редактировать документ'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formProductId">
                                    <Form.Label>Продукт</Form.Label>
                                    <Select
                                        options={productOptions}
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({ ...prev, productId: selectedOption.value }))
                                        }
                                        value={
                                            productOptions.find(
                                                (option) => option.value === Number(formData.productId)
                                            ) || null
                                        }
                                        placeholder="Выберите продукт..."
                                        isSearchable
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3" controlId="formDocumentType">
                                    <Form.Label>Тип документа</Form.Label>
                                    <Form.Select
                                        name="documentType"
                                        value={formData.documentType}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="инструкция">Инструкция</option>
                                        <option value="паспорт изделия">Паспорт изделия</option>
                                        <option value="сертификат соответствия">Сертификат соответствия</option>
                                        <option value="гарантийный талон">Гарантийный талон</option>
                                        <option value="схема подключения">Схема подключения</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3" controlId="formLanguage">
                                    <Form.Label>Язык</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="formFile">
                            <Form.Label>Файл документа</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                accept="application/pdf,image/*"
                                required={modalMode === 'add'}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalMode === 'add' ? 'Загрузить документ' : 'Сохранить изменения'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default TechnicalDocumentsManagement;
