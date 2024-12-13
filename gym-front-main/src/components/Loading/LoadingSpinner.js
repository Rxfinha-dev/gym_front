import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top: 8px solid #00bbff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: auto;
`;

const LoadingSpinner = () => (
  <LoadingContainer>
    <Spinner />
  </LoadingContainer>
);

export default LoadingSpinner;
