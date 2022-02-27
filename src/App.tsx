import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AppContext } from "./hooks/useAuth";
import { RoutesApp } from "./routes";

export function App() {
  return (
    <ChakraProvider>
      <AppContext>
        <RoutesApp />
      </AppContext>
    </ChakraProvider>
  );
}
