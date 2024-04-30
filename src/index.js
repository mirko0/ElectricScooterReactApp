import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Link, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import Login from './components/authorization/Login';
import { logout } from './services/auth';
import ProtectedRoute from './components/authorization/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
import ViewTrotineti from './components/trotineti/ViewTrotineti';
import AddTrotinet from './components/trotineti/AddTrotinet';

const App = () => {
    const jwt = localStorage.getItem("jwt");
    const jwtDecoded = jwt ? jwtDecode(jwt) : null;
    const role = jwt ? jwtDecoded.role.authority : "GOST";
    const name = jwt ? jwtDecoded.sub : null;
    // U zavisnosti od toga da li postoji jwt u local storage-u (da li je korisnik ulogovan)
    // vracamo nazad drugaciju Home stranicu koja prikazuje drugacije stvari u nav bar-u
    return (
        <>
            <Router>
                <Navbar expand bg="dark" variant="dark" className="justify-content-between px-3" >
                    <Navbar.Brand as={Link} to="/">
                        JWD
                    </Navbar.Brand>

                    <Nav>
                        <Nav.Link as={Link} to="/trotineti">
                            Trotineti
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        {!jwt &&
                            <Button variant='success' as={Link} to="/login">
                                Login
                            </Button>
                        }

                        {jwt &&
                            <>
                                <Button onClick={(e) => logout()} variant='danger'>
                                    Logout
                                </Button>
                                <p style={{ color: 'white' }}>
                                    Signed in as: {name}
                                    <br />
                                    Role: {role}
                                </p>
                            </>
                        }
                    </Nav>


                </Navbar>
                <Container style={{ paddingTop: "10px" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trotineti" element={<ProtectedRoute requiredRoles={["ROLE_KORISNIK", "ROLE_ADMIN"]} userRole={role}> <ViewTrotineti userRole={role} /> </ProtectedRoute>} />
                        <Route path="/trotineti/add" element={<ProtectedRoute requiredRoles={["ROLE_ADMIN"]} userRole={role}> <AddTrotinet userRole={role} /> </ProtectedRoute>} />
                        {/* <Route path="/tasks/edit/:id" element={<ProtectedRoute requiredRoles={["ROLE_ADMIN"]} userRole={role}> <EditTask userRole={role} /> </ProtectedRoute>} /> */}
                        <Route path="/login" element={<ProtectedRoute requiredRoles={["GOST"]} userRole={role}> <Login /> </ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </Router>
        </>
    );

};


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <App />,
);
