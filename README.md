# React Native Offline-First Boilerplate

A production-ready React Native boilerplate configured with:

- **Offline-First Architecture** manually implemented
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
| Persistence       | AsyncStorage                 |
| Connectivity      | NetInfo                      |

---

# Features

- **Network Monitoring:** Real-time online/offline detection.
- **Data Persistence:** Local caching of app data.
- **Pending Action Queue:** Queueing actions while offline.
- **Background Sync:** Automatic synchronization when network returns.
- **Optimistic UI:** Instant UI updates with status indicators.
- Jest setup configured
- Detox setup configured
- TypeScript support
- Example Offline-First demo screen

---

# Installation

## Clone Repository

```bash
git clone https://github.com/bhatvinayak/boilerplate-test-react-native.git
```

---

## Install Dependencies

```bash
npm install
```

---

# Run the App

## Start Metro

```bash
npm start
```

## Run on iOS

```bash
npm run ios
```

## Run on Android

```bash
npm run android
```

---

# Unit Testing

```bash
npm test
```

---

# E2E Testing (Detox)

## Build App

```bash
# iOS
npm run e2e:build:ios

# Android
npm run e2e:build:android
```

## Run Tests

```bash
# iOS
npm run e2e:test:ios

# Android
npm run e2e:test:android
```

---

# Recommended Testing Strategy

## Unit Tests
Test business logic, hooks, and component behavior. Colocate tests beside components:
```txt
Component.tsx
Component.test.tsx
```

## E2E Tests
Test critical flows like offline transitions and sync logic. Keep E2E tests outside `src/`:
```txt
e2e/
```

---

# License
MIT
