import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function SignIn() {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  async function handleSignUser() {
    await signIn();
    navigate("/");
  }

  return (
    <Flex
      maxW={340}
      mx="auto"
      direction="column"
      h="70vh"
      justify="space-between"
      mt="25vh"
    >
      <Box>
        <Heading
          as="h1"
          color="primary"
          fontSize="3rem"
        >
          Activer
        </Heading>
        <Text
          maxW={250}
          textAlign="left"
          fontSize={28}
          mt="4rem"
          color="primary"
        >
          Aqui você cria uma tarefa
          compartilha, sucesso amigão.
        </Text>
      </Box>
      <Flex align="center">
        <Button
          onClick={handleSignUser}
          py={5}
          bg="primary"
          color="#FFF"
          flex={1}
        >
          <Text
            flex={1}
            fontSize={20}
          >
            Entrar
          </Text>
          <MdLogin color="#FFF" size={20} />
        </Button>
      </Flex>
    </Flex>
  );
}