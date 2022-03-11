import { ChakraProvider, Modal, ModalBody, ModalContent } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { MdBlock } from "react-icons/md";

import { AuthContextProvider } from "./contexts/AuthContext";
import { RoutesApp } from "./routes";

export function App() {
  const [limitMobileScreen, setLimitMobileScreen] = useState(false);

 

  return limitMobileScreen ? (
    <Modal closeOnOverlayClick={false} isOpen={limitMobileScreen} onClose={() => { }}>
      <ModalContent h="80%" bg="gray.400">
        <ModalBody>
          <MdBlock color="white" size={32} />
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <ChakraProvider>
      <AuthContextProvider>
        <RoutesApp />
      </AuthContextProvider>
    </ChakraProvider>
  );
}
