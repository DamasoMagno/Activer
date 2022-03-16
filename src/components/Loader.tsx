import { Center, Flex, Stack, Text } from "@chakra-ui/react";
import { FaTasks } from "react-icons/fa";

export function Loader(){
  return (
    <Center
      h="100vh"
      bg="primary"
      maxW="100%"
      mx="auto"
    >
      <Flex
        as={Stack}
        spacing={4}
        align="center"
        direction="column"
      >
        <FaTasks color="#FFF" size={50} />
        <Text
          color="#FFF"
          fontSize="1.5rem"
        >
          Carregando
        </Text>
      </Flex>
      <FaTasks 
        size={300}
        color="rgba(255, 255, 255, .25)"
        style={{
          position: "absolute",
          left: "-10%",
          top: "20%",
          transform: "translateY(-50%)"
        }}
      />
    </Center>
  );
}