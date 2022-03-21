import { Center, Flex, Stack, Text } from "@chakra-ui/react";
import { FaTasks } from "react-icons/fa";

export function Splash() {
  return (
    <Center
      h="100vh"
      bg="background"
      maxW="100%"
      mx="auto"
    >
      <Flex
        as={Stack}
        spacing={4}
        maxW={720}
        mx="auto"
        align="center"
        position="relative"
        direction="column"
      >
        <FaTasks color="#FFF" size={50} />
        <Text
          color="#FFF"
          fontSize="1.5rem"
        >
          Carregando
        </Text>

        <FaTasks
          size={300}
          color="rgba(255, 255, 255, .25)"
          style={{
            position: "absolute",
            left: "-50vw",
            top: "-20vh",
            transform: "translateY(-50%)"
          }}
        />
      </Flex>
    </Center>
  );
}