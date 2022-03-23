import { Box, Flex, Image, Text, keyframes } from "@chakra-ui/react";

import logoImage from "../assets/logo.svg";

export function Splash() {
  const spin = keyframes`
  0% { position: relative; top: 0; }
  50% { position: relative; top: 10px }
  100% { position: relative; top: 0 }
`

  return (
    <Box
      h="100vh"
      bg="background"
      maxW="100%"
      mx="auto"
    >
      <Flex
        w="100%"
        mx="auto"
        maxW={720}
        direction="column"
      >
        <Image src={logoImage} mt="2.5rem"/>
        <Flex 
          direction="column"
          maxW={190}
          mx="auto"
          mt="-.75rem"
          animation={`${spin} infinite .85s linear`} 
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
        </Flex>
      </Flex>
    </Box>
  );
}