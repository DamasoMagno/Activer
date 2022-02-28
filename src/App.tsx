import { ChakraProvider } from "@chakra-ui/react";

import { AuthContextProvider } from "./contexts/AuthContext";
import { RoutesApp } from "./routes";

export function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <RoutesApp />
      </AuthContextProvider>
    </ChakraProvider>
  );
}
