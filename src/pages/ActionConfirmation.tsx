import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { MdDone } from "react-icons/md";
import { To, useNavigate, useParams, useSearchParams } from "react-router-dom";

import logoImage from "../assets/logo.png";

export function ActionConfirmation() {
  const { pageType } = useParams();

  const messageConfirmation = {
    title: pageType === "register" ? "Tarefa cadastrada!" : "Tarefa enviada!",
    description: pageType === "register" ? "Tarefa cadastrada com sucesso" : "Tarefa enviada com sucesso",
    pageDestination: "/"
  }

  const navigate = useNavigate();

  return (
    <Flex
      position="absolute"
      top="0"
      w="100vw"
      h="100vh"
      justify="center"
      direction="column"
      bg="background"
    >
      <Box 
        h="90%"
        mx="auto"
        maxW={720}
        w="100%"
      >
        <Image
          src={logoImage}
          mx="auto"
          alt="X representando a logo do projeto"
        />
        <Flex
          direction="column"
          align="center"
          justify="space-between"
          h="60%"
          mt="-3rem"
        >
          <Flex
            border="8px solid #6F4FEB"
            w="20%"
            maxW="5rem"
            h="5rem"
            justify="center"
            align="center"
            borderRadius=".25rem"
          >
            <MdDone color="#03B252" size="100%" />
          </Flex>

          <Flex
            direction="column"
            align="center"
          >
            <Heading color="#E1E1E6">{messageConfirmation.title}</Heading>
            <Text
              mt=".5rem"
              textAlign="center"
              color="#A8A8B3"
              maxW={150}
            >
              {messageConfirmation.description}
            </Text>
          </Flex>

          <Button
            bg="#6F4FEB"
            mt="3rem"
            onClick={() => navigate(messageConfirmation.pageDestination)}
            color="primaryText"
            borderRadius={0}
            p="1.85rem"
          >
            Ok
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}