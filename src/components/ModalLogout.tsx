import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, Button } from '@chakra-ui/react';

export function ModalLogout() {
  const { isOpen, onClose } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Deseja Sair?
        </ModalHeader>
        <ModalBody>
          <Button onClick={onClose} color="red">
            Cancelar
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}