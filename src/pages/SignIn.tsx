import { Button, Text, Box } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

export function SignIn(){
  
  const { signIn } = useAuth();

  return (
    <Box maxW={340} mx="auto">
      <Text border="1px solid red" w="100%" textAlign="center">ACTIVER</Text>
      <Button onClick={signIn}>
        Google
      </Button>
    </Box>
  );
}