import { FormEvent, useState } from "react";
import { Box, Text, Flex, Button, Input, FormControl } from "@chakra-ui/react";
import { FiShare2 } from "react-icons/fi";

export function Deliver() {
  const [confirmSend, setConfirmSend] = useState(false);

  const [name, setName] = useState("");
  const [studentCalled, setStudentCalled] = useState(0);
  const [files, setFiles] = useState([]);

  function handleStudentConfirmation(e: FormEvent) {
    e.preventDefault();

    if (!confirmSend) return;

    console.log(name, studentCalled, files);
  }

  return (
    <>
      <FormControl onSubmit={handleStudentConfirmation}>
        <Flex 
          maxW={350} 
          mx="auto" 
          direction="column" 
          justify="space-around" 
          h="100vh"
        >
          <Flex 
            justify="space-between" 
            gridGap={4} 
            align="stretch"
          >
            <Box
              mt={4}
              w="100%"
              borderWidth={1}
              borderRadius={4}
              p={4}
            >
              <Text fontSize={14}>Nome</Text>
              <Input 
                variant="flushed" 
                onChange={e => setName(e.target.value)} 
              />
            </Box>
            <Box 
              mt={4} 
              borderWidth={1} 
              borderRadius={4} 
              p={4}
            >
              <Text fontSize={14}>Número</Text>
              <Input 
                variant="flushed" 
                onChange={e => setStudentCalled(Number(e.target.value))} 
              />
            </Box>
          </Flex>

          <Input 
            type="file" 
            borderStyle="dashed" 
            p={4} 
            border="1px solid red" 
          />

          <Flex
            as="button"
            bg="transparent"
            borderWidth={1}
            p={4}
            justify="center"
            align="center"
            borderColor="#7474FE"
          >
            <Text 
              color="#7474FE" 
              mr={2}
            >Compartilhar</Text>
            <FiShare2 color="#7474FE" />
          </Flex>
          <Button 
            bg="#7474FE" 
            p={8} 
            type="submit" 
            disabled={!name || !studentCalled}
          >
            <Text color="#FFF">ENVIAR</Text>
          </Button>
        </Flex>
      </FormControl>
    </>
  );
}