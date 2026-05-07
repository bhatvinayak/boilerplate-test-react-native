/// <reference types="detox" />
import { by, device, element, expect, waitFor } from 'detox';

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show validation error for invalid email', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    await element(by.id('email-input')).typeText('invalid-email');

    await element(by.id('password-input')).typeText('123456');

    // Wait 2 seconds so you can dismiss
    // iOS save-password modal manually
    await device.disableSynchronization();

    await new Promise(resolve => setTimeout(resolve, 2000));

    await device.enableSynchronization();

    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-text'))).toHaveText('Invalid email');
  });

  it('should show password validation error', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await element(by.id('email-input')).typeText('test@test.com');

    await element(by.id('password-input')).typeText('123');

    await device.disableSynchronization();

    //await new Promise(resolve => setTimeout(resolve, 2000));

    await device.enableSynchronization();

    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-text'))).toHaveText(
      'Password must be at least 6 characters',
    );
  });

  it('should login successfully', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    await element(by.id('email-input')).typeText('test@test.com');

    await element(by.id('password-input')).typeText('123456');

    await device.disableSynchronization();

    //await new Promise(resolve => setTimeout(resolve, 2000));

    await device.enableSynchronization();

    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('success-text')))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.id('success-text'))).toHaveText('Login Successful');
  });
});
