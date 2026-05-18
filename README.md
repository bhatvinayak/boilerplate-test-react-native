# React Native Boilerplate - Feature Branches

This repository contains multiple production-ready React Native boilerplates, each focused on a specific architectural goal. Switch branches to see the different implementations.

## 🚀 Branches in this Repo

| Branch | Focus | Key Features |
| :--- | :--- | :--- |
| **`main` / `testing`** | **Robust Testing** | Jest, React Native Testing Library, Detox E2E, LoginForm example. |
| **`offline`** (Current) | **Offline-First** | Manual sync engine, NetInfo, AsyncStorage, Connectivity Truth-Check, AppState recovery. |

---

# 📱 Offline-First Boilerplate (`offline` branch)

This branch provides a robust, manual implementation of an offline-first architecture without heavy third-party state managers.

### Key Offline Features
- **Connectivity Truth-Check:** Uses a custom ping (`google.com`) to override unreliable native connectivity indicators.
- **Lifecycle Recovery:** Automatically refreshes connection status when the app returns from the background to the **foreground**.
- **Manual Sync Engine:** Implements a pending action queue using `AsyncStorage` to process offline actions.
- **Optimistic UI:** UI updates immediately with "Pending" badges for offline actions.
- **Exponential Backoff Polling:** Automatically retries connection checks every $2^n$ seconds while offline.

### Tech Stack
- **Persistence:** `@react-native-async-storage/async-storage`
- **Connectivity:** `@react-native-community/netinfo` + Custom Ping Logic
- **Testing:** Jest & Detox
- **Language:** TypeScript

---

# 🛠️ Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/bhatvinayak/boilerplate-test-react-native.git
cd boilerplate-test-react-native
npm install
```

### 2. Native Dependencies
```bash
# iOS
cd ios && pod install && cd ..
```

---

# 🏃 Running the App

### Start Metro
```bash
npm start
```

### Run on iOS
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

---

# 🧪 Testing

### Unit & Component Tests
```bash
npm test
```

### E2E Tests (Detox)
```bash
# Build
npm run e2e:build:ios # or android

# Test
npm run e2e:test:ios # or android
```

---

# 📖 Architecture Documentation

For a deep dive into the internal conventions, hooks, and services used in this branch, please refer to the [GEMINI.md](./GEMINI.md) file.

---

# License
MIT
