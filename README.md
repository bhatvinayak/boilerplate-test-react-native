# React Native Testing Boilerplate

A production-ready React Native boilerplate configured with:

- Unit Testing using Jest + React Native Testing Library
- End-to-End (E2E) Testing using Detox
- TypeScript support
- Scalable testing setup
- iOS + Android support

---

# Tech Stack

| Purpose           | Library                      |
| ----------------- | ---------------------------- |
| Unit Testing      | Jest                         |
| Component Testing | React Native Testing Library |
| E2E Testing       | Detox                        |
| Language          | TypeScript                   |
| Mobile Framework  | React Native                 |

---

# Features

- Jest setup configured
- Detox setup configured
- TypeScript support for tests
- Example login form component
- Example unit tests
- Example Detox E2E tests
- iOS + Android automation support

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

# Unit Testing Setup

This project uses:

- Jest
- React Native Testing Library

---

# Run Unit Tests

## Run Tests

```bash
npm test
```

---

## Watch Mode

```bash
npm test -- --watch
```

---

## Coverage

```bash
npm test -- --coverage
```

---

# Example Unit Test

```tsx
it('renders correctly', () => {
  const { getByTestId } = render(<LoginForm />);

  expect(getByTestId('login-screen')).toBeTruthy();
});
```

---

# E2E Testing Setup

This project uses Detox for end-to-end testing.

---

# Prerequisites

## iOS

Install:

- Xcode
- CocoaPods

Install applesimutils:

```bash
brew tap wix/brew
brew install applesimutils
```

---

## Android

Install:

- Android Studio
- Android Emulator

---

# Run E2E Tests

---

## Start Emulator / Simulator

### iOS

```bash
open -a Simulator
```

---

### Android

```bash
emulator -avd Pixel_8_API_34
```

---

# Build Detox App

## iOS

```bash
npm run e2e:build:ios
```

---

## Android

```bash
npm run e2e:build:android
```

---

# Run Detox Tests

## iOS

```bash
npm run e2e:test:ios
```

---

## Android

```bash
npm run e2e:test:android
```

---

# Sample E2E Test

```ts
await element(by.id('email-input')).typeText('test@test.com');

await element(by.id('password-input')).replaceText('123456');

await element(by.id('login-button')).tap();

await expect(element(by.id('success-text'))).toHaveText('Login Successful');
```

---

# Recommended Testing Strategy

## Unit Tests

Test:

- business logic
- hooks
- reducers
- validation
- utilities
- component behavior

Avoid over-testing implementation details.

---

## E2E Tests

Test only critical flows:

- onboarding
- login
- signup
- payments
- navigation
- offline handling

Keep E2E suite small and stable.

---

# Important Detox Notes

## iOS Password Autofill Issues

Disable autofill for stable E2E tests:

```tsx
<TextInput
  textContentType="none"
  autoComplete="off"
  importantForAutofill="no"
/>
```

---

## Prefer replaceText()

Use:

```ts
replaceText();
```

instead of:

```ts
typeText();
```

for better Detox stability.

---

# Useful Commands

## Run Single E2E File

```bash
detox test e2e/login.e2e.ts -c ios.sim.debug
```

---

## Verbose Logs

```bash
detox test -c ios.sim.debug --loglevel verbose
```

---

## Disable Android Animations

```bash
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
```

---

# Recommended Folder Convention

## Unit Tests

Colocate tests beside components:

```txt
Component.tsx
Component.test.tsx
```

---

## E2E Tests

Keep E2E tests outside `src/`:

```txt
e2e/
```

---

# CI/CD Recommendation

## Pull Requests

Run:

- lint
- typecheck
- unit tests

---

## Release / Nightly Builds

Run:

- Detox E2E tests

This keeps CI fast and scalable.

---

# Future Improvements

Possible additions:

- GitHub Actions CI
- Firebase Test Lab
- Maestro support
- Mock Service Worker (MSW)
- Code coverage reporting
- Snapshot testing
- Visual regression testing

---

# License

MIT
