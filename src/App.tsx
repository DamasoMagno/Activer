import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { RoutesApp } from "./routes";
import { theme } from "./styles/themes";


export function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <RoutesApp />
      </AuthContextProvider>
    </ChakraProvider>
  );
}
