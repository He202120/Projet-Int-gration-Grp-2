import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

import { useSelector, useDispatch } from "react-redux";

import img from "../../assets/Parking_icon.svg.png";

import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../slices/userApiSlice.js";
import { logout } from "../../slices/authSlice.js";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { userPlayer } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logOutHandler = async () => {
    try {
      await logoutApiCall().unwrap();

      dispatch(logout());

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                alt=""
                src={img}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              ParkSmart
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="userName">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item> Profile </NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logOutHandler}>
                      {" "}
                      Logout{" "}
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : userPlayer ? (
                <>
                  <NavDropdown title={userInfo.name} id="userName">
                    <NavDropdown.Item onClick={logOutHandler}>
                      {" "}
                      Logout{" "}
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
