import React, { useState, useEffect } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './styles/ProductCatalogStyles.css';

function ProductCatalog() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Фильтры
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');
    const [equipmentTypeFilter, setEquipmentTypeFilter] = useState('');
    const [powerSupplyFilter, setPowerSupplyFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('newest'); 

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, searchQuery, categoryFilter, brandFilter, conditionFilter, equipmentTypeFilter, powerSupplyFilter, minPrice, maxPrice, sortOption]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            toast.error('Ошибка при получении товаров');
        }
    };

    const filterAndSortProducts = () => {
        let result = [...products];

        // Фильтрация по поиску по названию (без учета регистра)
        if (searchQuery.trim()) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        // Фильтрация по категории
        if (categoryFilter) {
            result = result.filter(product => product.category === categoryFilter);
        }
        // Фильтрация по бренду
        if (brandFilter) {
            result = result.filter(product => product.brand === brandFilter);
        }
        // Фильтрация по состоянию
        if (conditionFilter) {
            result = result.filter(product => product.condition === conditionFilter);
        }
        // Фильтрация по типу оборудования
        if (equipmentTypeFilter) {
            result = result.filter(product => product.equipmentType === equipmentTypeFilter);
        }
        // Фильтрация по источнику питания
        if (powerSupplyFilter) {
            result = result.filter(product => product.powerSupply === powerSupplyFilter);
        }
        // Фильтрация по цене
        if (minPrice) {
            result = result.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
        }
        if (maxPrice) {
            result = result.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
        }
        // Сортировка
        if (sortOption === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === 'priceLowToHigh') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortOption === 'priceHighToLow') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortOption === 'alphabetical') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }
        setFilteredProducts(result);
    };

    // Статичные опции фильтров
    const categoryOptions = ['Авто', 'Мото', 'Грузовое', 'Специальное'];
    const brandOptions = ['BrandA', 'BrandB', 'BrandC'];
    const conditionOptions = ['new', 'used'];
    const equipmentTypeOptions = [
        'шиномонтажный стенд',
        'балансировочный стенд',
        'домкрат',
        'компрессор',
        'вулканизатор',
        'инструменты',
        'расходные материалы',
        'подъемники'
    ];
    const powerSupplyOptions = ['электрическое', 'пневматическое', 'гидравлическое', 'ручное'];

    return (
        <Container className="my-4">
            <h2>Каталог товаров</h2>
            <Form className="mb-4">
                <Row className="align-items-end">
                    <Col md={3}>
                        <Form.Group controlId="searchQuery">
                            <Form.Label>Поиск по названию</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название товара..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="categoryFilter">
                            <Form.Label>Категория</Form.Label>
                            <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                <option value="">Все</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="brandFilter">
                            <Form.Label>Бренд</Form.Label>
                            <Form.Select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                                <option value="">Все</option>
                                {brandOptions.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="conditionFilter">
                            <Form.Label>Состояние</Form.Label>
                            <Form.Select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
                                <option value="">Все</option>
                                {conditionOptions.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {cond}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="sortOption">
                            <Form.Label>Сортировка</Form.Label>
                            <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                <option value="newest">Новизна</option>
                                <option value="priceLowToHigh">Цена: от низкой к высокой</option>
                                <option value="priceHighToLow">Цена: от высокой к низкой</option>
                                <option value="alphabetical">По алфавиту</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={2}>
                        <Form.Group controlId="minPrice">
                            <Form.Label>Мин. цена</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="maxPrice">
                            <Form.Label>Макс. цена</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="equipmentTypeFilter">
                            <Form.Label>Тип оборудования</Form.Label>
                            <Form.Select value={equipmentTypeFilter} onChange={(e) => setEquipmentTypeFilter(e.target.value)}>
                                <option value="">Все</option>
                                {equipmentTypeOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="powerSupplyFilter">
                            <Form.Label>Источник питания</Form.Label>
                            <Form.Select value={powerSupplyFilter} onChange={(e) => setPowerSupplyFilter(e.target.value)}>
                                <option value="">Все</option>
                                {powerSupplyOptions.map((ps) => (
                                    <option key={ps} value={ps}>
                                        {ps}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                        <Button variant="secondary" onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('');
                            setBrandFilter('');
                            setConditionFilter('');
                            setEquipmentTypeFilter('');
                            setPowerSupplyFilter('');
                            setMinPrice('');
                            setMaxPrice('');
                            setSortOption('newest');
                        }}>
                            Сбросить фильтры
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Row className="mt-4">
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Col md={4} key={product.id} className="mb-4">
                            <Card>
                                {product.photo && (
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:5000${product.photo}`}
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Цена:</strong> {product.price} ₽
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Категория:</strong> {product.category}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Бренд:</strong> {product.brand}
                                    </Card.Text>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        Подробнее
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p className="text-center">Нет товаров для отображения</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default ProductCatalog;