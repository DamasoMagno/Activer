import { Modal, ModalBody, ModalCloseButton, Text, Image, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Button, Flex, Heading, Box } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import logoImage from "../assets/logo.svg";

type Modal = {
  title: string;
  description: string;
  pageDestination: string;
}

type ModaContextProps = {
  modal: Modal;
  openModal: (modal: Modal) => void;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

const ModalContxt = createContext({} as ModaContextProps);

export function MdodalContextProvider({ children }: AuthContextProviderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modal, setModal] = useState({} as Modal);
  const navigate = useNavigate();

  function openModal(modal: Modal) {
    setModal(modal);
    onOpen();
  }

  function closeModal() {
    navigate(modal.pageDestination);
    onClose();
  }

  return (
    <ModalContxt.Provider value={{ modal, openModal }}>
      {children}

      <Modal isOpen={isOpen} onClose={closeModal}>
        <Flex
          w="100vw"
          position="absolute"
          top="0"
          h="100vh"
          justify="center"
          direction="column"
          bg="background"
        >
          <Box
            h="90%"
            mx="auto"
            maxW={720}
            w="100%"
          >
            <Image
              src={logoImage}
              mx="auto"
              alt="X representando a logo do projeto"
            />
            <Flex
              direction="column"
              align="center"
              justify="space-between"
              h="60%"
              mt="-3rem"
            >
              <Flex
                border="8px solid #6F4FEB"
                w="20%"
                maxW="5rem"
                h="5rem"
                justify="center"
                align="center"
                borderRadius=".25rem"
              >
                <MdDone color="#03B252" size="100%" />
              </Flex>

              <Flex
                direction="column"
                align="center"
              >
                <Heading color="#E1E1E6">{modal.title}</Heading>
                <Text
                  mt=".5rem"
                  textAlign="center"
                  color="#A8A8B3"
                  maxW={150}
                >
                  {modal.description}
                </Text>
              </Flex>

              <Button
                bg="#6F4FEB"
                mt="3rem"
                onClick={closeModal}
                color="primaryText"
                borderRadius={0}
                p="1.85rem"
              >
                Ok
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Modal>
    </ModalContxt.Provider>
  );
}

export function useModal() {
  return useContext(ModalContxt);
}
