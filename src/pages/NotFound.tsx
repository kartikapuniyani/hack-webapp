import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: ${(props) => props.theme.colors.primary};
`;

const ErrorMessage = styled.h2`
  font-size: 1.5rem;
  margin: ${(props) => props.theme.spacing.md} 0;
`;

const HomeButton = styled(Link)`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <HomeButton to="/">Back to Home</HomeButton>
    </Container>
  );
};

export default NotFound;
