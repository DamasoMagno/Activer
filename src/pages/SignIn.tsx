import { Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function SignIn(){
  const navigate = useNavigate();

  const { signIn } = useAuth();

  async function handleSignUser(){
    await signIn();
    navigate("/");
  }

  return (
    <Flex maxW={340} mx="auto" flexDirection="column" justify="center" h="100vh">
      <Text
        fontSize={24}
        color="primary"
        textAlign="center"
      >
        Login
      </Text>
      <Button 
        onClick={handleSignUser} 
        bg="primary" 
        mt={12}
        color="#FFF"
      >
        Google
      </Button>
    </Flex>
  );
}