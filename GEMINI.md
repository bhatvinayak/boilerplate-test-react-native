# BoilerPlate - React Native Offline-First Boilerplate

This project is a React Native boilerplate optimized for robust offline-first development, featuring TypeScript support and pre-configured unit and E2E testing frameworks.

## Project Overview

- **Framework:** React Native (0.85.3)
- **Language:** TypeScript
- **State Management:** React Hooks (`useState`)
- **Styling:** React Native `StyleSheet`
- **Offline Support:** Manual implementation using `@react-native-community/netinfo` and `@react-native-async-storage/async-storage`.
- **Testing:**
    - **Unit/Component:** Jest + React Native Testing Library
    - **E2E:** Detox

## Architecture & Conventions

### Directory Structure
- `src/component/`: Reusable UI components and feature screens (e.g., `OfflineDemo`).
- `src/hooks/`: Custom React hooks (e.g., `useNetworkStatus`).
- `src/services/`: Business logic and background services (e.g., `OfflineService`).
- `jest/`: Jest setup and component tests.
- `e2e/`: Detox end-to-end test flows and configuration.
- `android/` & `ios/`: Platform-specific native code.

### Offline-First Architecture
- **Connectivity Monitoring:** The `useNetworkStatus` hook provides real-time online/offline status using:
    - **NetInfo Events:** Listening for native connectivity changes.
    - **AppState Monitoring:** Triggering a refresh immediately when the app returns to the **foreground**.
    - **Custom Truth Check:** Performing a lightweight ping (google.com) to verify real internet access when native indicators are unreliable.
    - **Exponential Backoff Polling:** Automatically checking for connection every 2n seconds (up to 32s) while offline.
- **Persistence:** `OfflineService` uses `AsyncStorage` to cache data and manage a pending action queue.
- **Optimistic UI:** UI updates immediately when an action is performed. If offline, the action is queued; if online, it is sent to the "server" (simulated).
- **Background Sync:** When the app detects a transition from offline to online, it automatically processes the pending queue.

### Testing Conventions
- **Unit Tests:** Colocate tests with components whenever possible (e.g., `ComponentName.test.tsx`) or place them in `jest/component/`.
- **E2E Tests:** Keep E2E tests in the `e2e/flows/` directory.
- **Test IDs:** Always use `testID` props on components that need to be targeted by tests (both Unit and E2E).
- **Detox Stability:** Prefer `replaceText()` over `typeText()` for more reliable text input in E2E tests.

### Code Quality
- **Linting:** ESLint is used for code quality. Run with `npm run lint`.
- **Formatting:** Prettier is used for consistent code style.
- **Types:** TypeScript is strictly enforced. Definitions are in `tsconfig.json`.

## Building and Running

### Development
- **Install Dependencies:** `npm install`
- **Start Metro Bundler:** `npm start`
- **Run on iOS:** `npm run ios`
- **Run on Android:** `npm run android`

### Testing
- **Run Unit Tests:** `npm test`
- **Run Unit Tests (Watch):** `npm test -- --watch`
- **Generate Coverage:** `npm test -- --coverage`

### End-to-End (Detox)
- **Build iOS:** `npm run e2e:build:ios`
- **Test iOS:** `npm run e2e:test:ios`
- **Build Android:** `npm run e2e:build:android`
- **Test Android:** `npm run e2e:test:android`

## CI/CD Recommendations
- **PR Checks:** Run `lint`, `typecheck` (via `tsc`), and `test` (unit tests).
- **Release/Nightly:** Run full Detox E2E suites.
