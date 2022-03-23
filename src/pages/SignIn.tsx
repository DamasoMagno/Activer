import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";

import { useAuth } from "../contexts/AuthContext";

import logoImage from "../assets/logo.svg";

export function SignIn() {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  async function handleSignUser() {
    await signIn();
    navigate("/");
  }

  return (
    <Box
      bg="background"
      h="100vh"
    >
      <Image src={logoImage} pt="2.5rem" mx="auto"/>
      <Flex
        maxW={720}
        mx="auto"
        mt="-.75rem"
        w="90%"
        direction="column"
        justify="space-between"
        h="55vh"
      >
        <Box
          maxW={190}
          mx="auto"
          mt="-.75rem"
        >
          <Text
            color="primaryText"
            fontSize="3.25rem"
            as="strong"
          >
            Activ<Text color="heading" as="span">er.</Text>
          </Text>
          <Text
            color="rgba(255, 255, 255, 1)"
            fontSize="1rem"
            fontWeight={600}
          >
            Seu Gerenciador online de tarefas e eventos
          </Text>
        </Box>

        <Button
          onClick={handleSignUser}
          bg="primaryText"
          color="background"
          py="1.5rem"
        >
          <Text
            flex={1}
            fontSize={20}
          >
            Entrar
          </Text>
          <MdLogin color="background" size={20} />
        </Button>
      </Flex>
    </Box>
  );
}