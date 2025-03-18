import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../redux context/AuthContext';
// import './EquipmentSellerProfileSettings.css';

function EquipmentSellerProfileSettings() {
    const { authData, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    // Состояние профиля продавца
    const [profile, setProfile] = useState({
        id: '',
        companyName: '',
        contactPerson: '',
        registrationNumber: '',
        phone: '',
        description: '',
        email: '',
        address: '',
        establishedYear: '',
        specialization: '',
        serviceAvailability: false,
        certification: '',
        serviceArea: '',
        logo: '',
    });

    // Поле для нового пароля (если нужно изменить)
    const [password, setPassword] = useState('');
    // Состояние для нового логотипа
    const [logoFile, setLogoFile] = useState(null);
    // Пример дополнительной настройки уведомлений
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    // Получение профиля продавца (endpoint: /api/equipmentsellers/auth)
    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/equipmentsellers/auth');
            setProfile(response.data);
        } catch (error) {
            console.error('Ошибка при получении профиля продавца:', error);
            toast.error('Ошибка при получении профиля');
        }
    };

    // Обработка изменения полей профиля
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Обработка изменения логотипа
    const handleLogoChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    // Обработка изменения нового пароля
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Обработка изменения настроек уведомлений
    const handleNotificationsToggle = (e) => {
        setNotificationsEnabled(e.target.checked);
    };

    // Отправка данных формы обновления профиля
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            // Добавляем поля профиля (пропуская logo, т.к. обновляем его отдельно)
            data.append('companyName', profile.companyName);
            data.append('contactPerson', profile.contactPerson);
            data.append('registrationNumber', profile.registrationNumber);
            data.append('phone', profile.phone);
            data.append('description', profile.description);
            data.append('email', profile.email); // хотя email не меняется
            data.append('address', profile.address);
            data.append('establishedYear', profile.establishedYear);
            data.append('specialization', profile.specialization);
            data.append('serviceAvailability', profile.serviceAvailability);
            data.append('certification', profile.certification);
            data.append('serviceArea', profile.serviceArea);
            // Дополнительная настройка уведомлений (если backend поддерживает)
            data.append('notificationsEnabled', notificationsEnabled);
            // Новый пароль, если введён
            if (password) {
                data.append('password', password);
            }
            // Если выбран новый логотип, добавляем его
            if (logoFile) {
                data.append('logo', logoFile);
            }

            // Отправляем PUT-запрос на обновление профиля продавца
            const response = await axios.put(`/api/equipmentsellers/${profile.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(response.data);
            toast.success('Профиль успешно обновлен');
            // Обновляем данные в контексте аутентификации
            login({ user: response.data, token: authData.token, role: authData.role });
            // При необходимости можно сбросить поле пароля
            setPassword('');
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            toast.error('Ошибка при обновлении профиля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <h2>Профиль продавца</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="companyName" className="mb-3">
                            <Form.Label>Название компании</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={profile.companyName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="contactPerson" className="mb-3">
                            <Form.Label>Контактное лицо</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactPerson"
                                value={profile.contactPerson}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="registrationNumber" className="mb-3">
                            <Form.Label>Регистрационный номер</Form.Label>
                            <Form.Control
                                type="text"
                                name="registrationNumber"
                                value={profile.registrationNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="phone" className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Описание компании</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                        disabled
                    />
                    <Form.Text className="text-muted">Email менять нельзя</Form.Text>
                </Form.Group>
                <Form.Group controlId="address" className="mb-3">
                    <Form.Label>Адрес</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="establishedYear" className="mb-3">
                            <Form.Label>Год основания</Form.Label>
                            <Form.Control
                                type="number"
                                name="establishedYear"
                                value={profile.establishedYear || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="specialization" className="mb-3">
                            <Form.Label>Специализация</Form.Label>
                            <Form.Control
                                type="text"
                                name="specialization"
                                value={profile.specialization}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="serviceAvailability" className="mb-3">
                            <Form.Label>Наличие сервиса</Form.Label>
                            <Form.Select
                                name="serviceAvailability"
                                value={profile.serviceAvailability ? 'true' : 'false'}
                                onChange={(e) =>
                                    setProfile((prev) => ({
                                        ...prev,
                                        serviceAvailability: e.target.value === 'true',
                                    }))
                                }
                            >
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="certification" className="mb-3">
                            <Form.Label>Сертификация</Form.Label>
                            <Form.Control
                                type="text"
                                name="certification"
                                value={profile.certification}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="serviceArea" className="mb-3">
                            <Form.Label>Область сервиса</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceArea"
                                value={profile.serviceArea}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="logo" className="mb-3">
                    <Form.Label>Логотип компании</Form.Label>
                    {profile.logo && (
                        <div className="mb-2">
                            <img
                                src={`http://localhost:5000${profile.logo}`}
                                alt="Логотип"
                                style={{ maxWidth: '200px' }}
                            />
                        </div>
                    )}
                    <Form.Control
                        type="file"
                        name="logo"
                        onChange={handleLogoChange}
                        accept="image/*"
                    />
                </Form.Group>
                <hr />
                <h4>Настройки безопасности и уведомлений</h4>
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Новый пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Введите новый пароль (если нужно)"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>
                <Form.Group controlId="notifications" className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Включить уведомления по email"
                        checked={notificationsEnabled}
                        onChange={handleNotificationsToggle}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </Form>
        </Container>
    );
}

export default EquipmentSellerProfileSettings;