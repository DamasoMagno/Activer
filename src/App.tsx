import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MdodalContextProvider } from "./contexts/ModalContext";
import { RoutesApp } from "./routes";
import { theme } from "./styles/themes";

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
          <MdodalContextProvider>
            <RoutesApp />
          </MdodalContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
