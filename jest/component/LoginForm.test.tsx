import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LoginForm from '../../src/component/LoginForm';

describe('LoginForm', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<LoginForm />);

    expect(getByTestId('login-screen')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('shows invalid email error', async () => {
    const { getByTestId, findByTestId } = render(<LoginForm />);

    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');

    fireEvent.changeText(getByTestId('password-input'), '123456');

    fireEvent.press(getByTestId('login-button'));

    const errorText = await findByTestId('error-text');

    expect(errorText.props.children).toBe('Invalid email');
  });

  it('shows password validation error', async () => {
    const { getByTestId, findByTestId } = render(<LoginForm />);

    fireEvent.changeText(getByTestId('email-input'), 'test@test.com');

    fireEvent.changeText(getByTestId('password-input'), '123');

    fireEvent.press(getByTestId('login-button'));

    const errorText = await findByTestId('error-text');

    expect(errorText.props.children).toBe(
      'Password must be at least 6 characters',
    );
  });

  it('shows loader during login', async () => {
    const { getByTestId, findByTestId } = render(<LoginForm />);

    fireEvent.changeText(getByTestId('email-input'), 'test@test.com');

    fireEvent.changeText(getByTestId('password-input'), '123456');

    fireEvent.press(getByTestId('login-button'));

    expect(await findByTestId('loader')).toBeTruthy();
  });

  it('shows success message after login', async () => {
    const { getByTestId } = render(<LoginForm />);

    fireEvent.changeText(getByTestId('email-input'), 'test@test.com');

    fireEvent.changeText(getByTestId('password-input'), '123456');

    fireEvent.press(getByTestId('login-button'));

    await waitFor(
      () => {
        expect(getByTestId('success-text').props.children).toBe(
          'Login Successful',
        );
      },
      {
        timeout: 3000,
      },
    );
  });
});
