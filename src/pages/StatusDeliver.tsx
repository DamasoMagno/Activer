import { Flex, Text, Stack, Center } from "@chakra-ui/react";
import { MdClose, MdDone } from "react-icons/md";
import { useParams } from "react-router-dom";


export function StatusDeliver() {
  const { status } = useParams();

  return (
    <Center
      h="100vh"
      w="100%"
      bg={status === "success" ? "primary" : "rgba(255, 0, 0, .85)"}
    >
      <Flex
        as={Stack}
        spacing={4}
        align="center"
      >
        {status === "success" ? (
          <>
            <MdDone
              size={48}
              color="#FFF"
            />
            <Text
              maxW={250}
              textAlign="center"
              fontSize={24}
              color="#FFF"
            >
              Envio de tarefa com sucesso
            </Text>
          </>
        ) : (
          <>
            <MdClose
              size={52}
              color="#FFF"
            />
            <Text
              maxW={250}
              textAlign="center"
              fontSize={24}
              color="#FFF"
            >
              Erro ao enviar a atividade
            </Text>
          </>
        )}
      </Flex>
    </Center>
  );
}