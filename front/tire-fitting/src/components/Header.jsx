import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../redux context/AuthContext';

const Header = () => {
    const { authData, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/products">
                    Tire Fitting Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/products">
                            Продукты
                        </Nav.Link>
                        {authData.isAuthenticated && authData.role === 'user' && (
                            <>
                                <Nav.Link as={NavLink} to="/cart">
                                    Корзина
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/profile">
                                    Мой профиль
                                </Nav.Link>
                            </>
                        )}
                        {authData.isAuthenticated && authData.role === 'seller' && (
                            <>
                                <Nav.Link as={NavLink} to="/seller/products">
                                    Мои товары
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/seller/orders">
                                    Заказы
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/seller/consultations">
                                    Консультации
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/seller/reviews">
                                    Отзывы
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/seller/docs">
                                    Документы
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/seller/profile">
                                    Профиль продавца
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {!authData.isAuthenticated ? (
                            <>
                                <Nav.Link as={NavLink} to="/login">
                                    Вход
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/register">
                                    Регистрация
                                </Nav.Link>
                            </>
                        ) : (
                            <Button variant="outline-danger" onClick={handleLogout}>
                                Выйти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;