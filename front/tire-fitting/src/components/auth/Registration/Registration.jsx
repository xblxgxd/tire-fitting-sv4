import React, { useState } from 'react';
import axios from '../../../redux context/api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Registration.css';

function Registration() {
    // Начальное состояние с полями для обоих типов пользователей
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        // Для пользователя:
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        birthDate: '',
        description: '',
        address: '',
        // Для продавца оборудования:
        companyName: '',
        contactPerson: '',
        registrationNumber: '',
        sellerPhone: '',
        sellerDescription: '',
        // Новые поля для продавца:
        establishedYear: '',
        specialization: '',
        serviceAvailability: '', // можно использовать селект (true/false)
        certification: '',
        serviceArea: '',
    });
    const [file, setFile] = useState(null);
    const [fileUploaded, setFileUploaded] = useState(false);

    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileUploaded(!!selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        const data = new FormData();

        // Добавляем общие поля
        data.append('email', formData.email);
        data.append('password', formData.password);

        if (role === 'user') {
            // Для пользователя (UserController)
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('phone', formData.phone);
            data.append('birthDate', formData.birthDate);
            data.append('description', formData.description);
            data.append('address', formData.address);
            if (file) {
                data.append('photo', file);
            }
        } else {
            // Для продавца оборудования (EquipmentSellerController)
            data.append('companyName', formData.companyName);
            data.append('contactPerson', formData.contactPerson);
            data.append('registrationNumber', formData.registrationNumber);
            data.append('phone', formData.sellerPhone);
            data.append('description', formData.sellerDescription);
            data.append('address', formData.address);
            // Новые поля для продавца
            data.append('establishedYear', formData.establishedYear);
            data.append('specialization', formData.specialization);
            data.append('serviceAvailability', formData.serviceAvailability);
            data.append('certification', formData.certification);
            data.append('serviceArea', formData.serviceArea);
            if (file) {
                data.append('logo', file);
            }
        }

        try {
            const url =
                role === 'user'
                    ? '/api/users/registration'
                    : '/api/equipmentsellers/registration';
            await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Регистрация прошла успешно!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            toast.error('Ошибка при регистрации');
        }
    };

    return (
        <Container className="py-4 registration-container">
            <h4 className="mb-4 registration-title">Регистрация</h4>
            <ToastContainer />
            <Form onSubmit={handleSubmit} className="registration-form">
                <Form.Group controlId="roleSelect" className="mb-3">
                    <Form.Label>Я хочу зарегистрироваться как</Form.Label>
                    <Form.Select value={role} onChange={handleRoleChange} className="registration-select">
                        <option value="user">Покупатель</option>
                        <option value="seller">Продавец оборудования</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите email"
                        className="registration-input"
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль"
                        className="registration-input"
                    />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                    <Form.Label>Подтвердите пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Повторите пароль"
                        className="registration-input"
                    />
                </Form.Group>
                {role === 'user' ? (
                    <>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Введите имя"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Введите фамилию"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Введите номер телефона"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthDate" className="mb-3">
                            <Form.Label>Дата рождения</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Введите адрес"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Расскажите о себе"
                                className="registration-textarea"
                            />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Фото</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={fileUploaded}
                                className="registration-input"
                            />
                            {fileUploaded && (
                                <div className="mt-2 text-success registration-photo-status">
                                    Фотография загружена
                                </div>
                            )}
                        </Form.Group>
                    </>
                ) : (
                    <>
                        <Form.Group controlId="formCompanyName" className="mb-3">
                            <Form.Label>Название компании</Form.Label>
                            <Form.Control
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Введите название компании"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formContactPerson" className="mb-3">
                            <Form.Label>Контактное лицо</Form.Label>
                            <Form.Control
                                name="contactPerson"
                                required
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="Введите имя контактного лица"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formRegistrationNumber" className="mb-3">
                            <Form.Label>Регистрационный номер</Form.Label>
                            <Form.Control
                                name="registrationNumber"
                                required
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="Введите регистрационный номер"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formSellerPhone" className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                name="sellerPhone"
                                required
                                value={formData.sellerPhone}
                                onChange={handleChange}
                                placeholder="Введите номер телефона"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Введите адрес компании"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formSellerDescription" className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="sellerDescription"
                                value={formData.sellerDescription}
                                onChange={handleChange}
                                placeholder="Расскажите о компании"
                                className="registration-textarea"
                            />
                        </Form.Group>
                        {/* Новые поля для продавца */}
                        <Form.Group controlId="formEstablishedYear" className="mb-3">
                            <Form.Label>Год основания</Form.Label>
                            <Form.Control
                                type="number"
                                name="establishedYear"
                                value={formData.establishedYear}
                                onChange={handleChange}
                                placeholder="Введите год основания"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formSpecialization" className="mb-3">
                            <Form.Label>Специализация</Form.Label>
                            <Form.Select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="registration-select"
                            >
                                <option value="">Выберите специализацию</option>
                                <option value="легковой транспорт">Легковой транспорт</option>
                                <option value="грузовой транспорт">Грузовой транспорт</option>
                                <option value="мотоциклы">Мотоциклы</option>
                                <option value="универсальное оборудование">Универсальное оборудование</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formServiceAvailability" className="mb-3">
                            <Form.Label>Наличие сервиса</Form.Label>
                            <Form.Select
                                name="serviceAvailability"
                                value={formData.serviceAvailability}
                                onChange={handleChange}
                                className="registration-select"
                            >
                                <option value="">Выберите</option>
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formCertification" className="mb-3">
                            <Form.Label>Сертификация</Form.Label>
                            <Form.Control
                                name="certification"
                                value={formData.certification}
                                onChange={handleChange}
                                placeholder="Введите информацию о сертификатах"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formServiceArea" className="mb-3">
                            <Form.Label>Область сервиса</Form.Label>
                            <Form.Control
                                name="serviceArea"
                                value={formData.serviceArea}
                                onChange={handleChange}
                                placeholder="Введите область сервиса"
                                className="registration-input"
                            />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Логотип</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={fileUploaded}
                                className="registration-input"
                            />
                            {fileUploaded && (
                                <div className="mt-2 text-success registration-photo-status">
                                    Логотип загружен
                                </div>
                            )}
                        </Form.Group>
                    </>
                )}
                <Button variant="primary" type="submit" className="registration-btn">
                    Зарегистрироваться
                </Button>
            </Form>
        </Container>
    );
}

export default Registration;
