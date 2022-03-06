import { FormEvent, useEffect, useState } from "react";
import { Text, Flex, Button, Input, FormControl, Box, Stack, Center, Image } from "@chakra-ui/react";
import { FiShare2 } from "react-icons/fi";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { MdDone } from "react-icons/md";

import { app } from "../services/firebase";

export function Deliver() {
  const storage = getStorage(app);

  const [attachments, setAttachments] = useState<File>({} as File);
  const [previewAttachments, setPreviewAttachments] = useState<string>("");
  const [activityIsShared, setActivityIsShared] = useState(false);


  async function copyUrl() {
    const url = location.href;
    await navigator.clipboard.writeText(url);

    setActivityIsShared(true);
  }

  useEffect(() => {
    try {
      if (!attachments.name) return

      const binaryData = [];
      binaryData.push(attachments as BlobPart);

      const imageUrl = URL.createObjectURL(new Blob(binaryData));

      setPreviewAttachments(imageUrl);
    } catch (error){
      console.log(error);
    } 
  }, [attachments]);

  
  async function handleSubmitName(e: FormEvent){
    e.preventDefault();

    const storageRef = ref(storage, `images/${attachments.name}`);

    try {
      await uploadBytes(storageRef, attachments);
      console.log("Arquivo enviado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FormControl onSubmit={handleSubmitName}>
      <Flex
        maxW={350}
        mx="auto"
        py={8}
        direction="column"
        justify="space-between"
        h="100vh"
      >
        <Text>Formatura 2022</Text>

        <Stack spacing={4}>
          <Box
            border="3px dashed #7474FE"
            borderRadius={8}
            h="250px"
            background="rgba(116, 116, 253, .65)"
          >
            {previewAttachments ? (
              <Image
                src={previewAttachments}
                alt="Imagem da atividade"
                w="100%"
                h="100%"
                fit="contain"
              />
            ) : (
              <Center
                h="100%"
                maxW={200}
                textAlign="center"
                m="auto"
                fontWeight={500}
                color="#FFF"
              >
                Nenhum Arquivo Selecionado
              </Center>
            )}
          </Box>
          <Flex
            position={"relative"}
            border="1px dashed #7474FE"
            borderRadius={4}
          >
            <Center
              w="100%"
              position="absolute"
              h="100%"
              fontSize={20}
              color="#7474FE"
            >
              {previewAttachments ? "Trocar Anexo" : "Enviar Anexo"}
            </Center>
            <Input
              type="file"
              borderStyle="none"
              p={4}
              opacity={0}
              w="100%"
              h="100%"
              onChange={e => e.target.files && setAttachments(e.target.files[0])}
            />
          </Flex>
        </Stack>

        <Flex direction={"column"}>
          <Stack spacing={4}>
            {!activityIsShared ? (
              <Flex
                bg="transparent"
                border={"1px dashed #7474FE"}
                p={4}
                as="button"
                onClick={copyUrl}
                borderRadius={4}
                justify="center"
                cursor="pointer"
                align="center"
                borderColor="#7474FE"
              >
                <Text
                  color="#7474FE"
                  mr={2}
                >
                  Compartilhar
                </Text>
                <FiShare2 color="#7474FE" />
              </Flex>
            ) : (
              <Flex
                bg="transparent"
                border={"1px dashed #7474FE"}
                p={4}
                borderRadius={4}
                justify="center"
                align="center"
                borderColor="#7474FE"
              >
                <Text
                  color="#7474FE"
                  mr={2}
                >
                  Link Copiado
                </Text>
                <MdDone color="#7474FE" />
              </Flex>
            )}
            <Button
              bg="#7474FE"
              p={8}
              type="submit"
            >
              <Text color="#FFF">ENVIAR</Text>
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </FormControl >
  );
}