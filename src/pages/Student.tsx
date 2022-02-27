import { FormEvent, useState } from "react";
import { Box, Text, Flex, Image, Stack } from "@chakra-ui/react";
import { MdArrowBackIos } from "react-icons/md";

export function Student() {
  const [confirmSend, setConfirmSend] = useState(false);

  const [name, setName] = useState("");
  const [called, setCalled] = useState("");
  const [files, setFiles] = useState("");

  function handleStudentConfirmation(e: FormEvent) {
    e.preventDefault();

    if (!confirmSend) return;

    console.log(name, called, files);
  }

  return (
    <Box w={340} mx={"auto"} my={"1rem"}>
      <Flex as="header" alignItems={"center"}>
        <MdArrowBackIos size={20} color="#7474FE"/>
        <Text flex={"1"} textAlign="center" fontWeight={500} fontSize={24}>Damaso Magno</Text>
      </Flex>

      <Box>
        <Box>
          <Text>Data da Entrega</Text>
          <Text>10/10/2022</Text>
        </Box>

        <Box>
          <Text>Número Chamada</Text>
          <Text>09</Text>
        </Box>

        <Box>
          <Text>Anexos</Text>
          <Stack spacing={4}>
            <Flex>
              <Image/>
            </Flex>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}