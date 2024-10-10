import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";

import { useDispatch, useSelector } from "react-redux";

import { useRegisterMutation } from "../../slices/userApiSlice";
import { setCredentials } from "../../slices/authSlice";

import { toast } from "react-toastify";

import Loader from "../../components/Loader";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [position, setPosition] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      try {
        const responseFromApiCall = await register({
          name,
          email,
          password,
          telephone,
          position
        }).unwrap();
        // Charlier Martin
        //dispatch(setCredentials({ ...responseFromApiCall }));
        toast.success('Your request has been sent.');
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.errors[0]?.message || err?.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register with Wetteren</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="telephone">
          <Form.Label>Telephone</Form.Label>
          <Form.Control
            type="text"
            placeholder="+32 000 00 00"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="position">
          <Form.Label>Position</Form.Label>
          <Form.Select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select Position</option>
            <option value="attacker">Attacker</option>
            <option value="defender">Defender</option>
            <option value="keeper">Keeper</option>
            <option value="middle">Middle</option>
          </Form.Select>
        </Form.Group>
        

        <Button type="submit" variant="primary" className="mt-3">
          {" "}
          Sign Up{" "}
        </Button>
      </Form>

      {isLoading && (
        <>
          {" "}
          <Loader />{" "}
        </>
      )}

      <Row className="py-3">
        <Col>
          {" "}
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
