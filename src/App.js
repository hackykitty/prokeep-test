import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const LoginContainer = styled.div`
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const MessageBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid red;
  color: red;
  background-color: #ffe6e6; // light red background
  border-radius: 4px;
  display: ${({ show }) =>
    show ? "block" : "none"}; // This will make the box conditionally visible
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (currentEmail, currentPassword) => {
    const newErrors = {};
    if (!currentEmail.includes("@")) newErrors.email = "Invalid email format.";
    if (!currentPassword) newErrors.password = "Password cannot be empty.";
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.keys(errors).length) {
      setLoading(true);

      try {
        await axios.post("https://reqres.in/api/login", { email, password });
        setLoginMessage("Login successful");
      } catch {
        setLoginMessage("Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <LoginContainer>
      <form onSubmit={handleSubmit}>
        <div>
          <StyledInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange(e.target.value, email);
            }}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </div>
        <div>
          <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleChange(email, e.target.value);
            }}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </div>
        <StyledButton type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </StyledButton>
        <MessageBox show={loginMessage}>{loginMessage}</MessageBox>
      </form>
    </LoginContainer>
  );
}

export default LoginForm;
