import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
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
    <Box
      bg="primary"
      h="100vh"
      pt="25vh"
    >
      <Flex
        maxW={720}
        mx="auto"
        w="90%"
        direction="column"
        position="relative"
        h="70vh"
        justify="space-between"
      >
        <Box>
          <Flex align="baseline">
            <FaTasks color="#FFF" size={32} />
            <Heading
              as="h1"
              color="#FFF"
              fontSize="3rem"
              ml={5}
            >
              Activer
            </Heading>
          </Flex>
          <Text
            maxW={225}
            textAlign="left"
            fontSize={28}
            mt="4rem"
            color="#FFF"
          >
            Seu gerenciador online
            de tarefas e eventos.
          </Text>
        </Box>

        <Button
          onClick={handleSignUser}
          bg="#FFF"
          color="primary"
          py={5}
        >
          <Text
            flex={1}
            fontSize={20}
          >
            Entrar
          </Text>
          <MdLogin color="#7474FE" size={20} />
        </Button>

        <FaTasks
          size={125}
          color="rgba(255, 255, 255, .1)"
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            transform: "translate(-10%, 80%)",
          }}
        />
      </Flex>
    </Box>
  );
}