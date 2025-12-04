// App.tsx
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./src/store";

export default function App() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
