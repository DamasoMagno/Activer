import { useEffect, useState } from "react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../services/firebase";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { Splash } from "./Splash";

type StudentActivity = {
  userName: string;
  attachments: string;
  created_at: string;
}

export function Student() {
  const navigate = useNavigate()
  const { id } = useParams();
  const { user } = useAuth();

  const [student, setStudent] = useState<StudentActivity>({} as StudentActivity);

  useEffect(() => {
    try {
      const activityCollection = collection(database, "tasksDelivered");

      getDocs(activityCollection)
        .then(response => {
          const data = response.docs.map(doc => {
            const { userName, attachments, created_at } = doc.data();
            const date = new Date(created_at);

            return {
              id: doc.id,
              userName: userName,
              attachments: attachments,
              created_at: `
                  ${date.getDate().toString().padStart(2, "0")}/
                  ${date.getMonth().toString().padStart(2, "0")}/
                  ${date.getFullYear()}
                `,
            };
          }).find(doc => doc.id === id) as StudentActivity;

          setStudent(data);
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }, []);

  return user.displayName ? (
    <>
      <Box
        bg="background"
        p="1.15rem 0 3rem"
        as="header"
      >
        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          align="center"
        >
          <Flex as="button" onClick={() => navigate(-1)}>
            <MdArrowBackIos
              size={20}
              color="white"
            />
          </Flex>
          <Text
            as="h2"
            fontSize={20}
            color="primaryText"
            w="calc(100% - 2.7rem)"
            textAlign="center"
          >
            Aluno
          </Text>
        </Flex>
      </Box>

      <Stack
        spacing={4}
        mt={-5}
        w="90%"
        as="main"
        maxW={720}
        mx="auto"
      >
        <Box
          background="#FAFAFA"
          p="1.125rem"
          borderRadius={5}
          boxShadow="0px 0px 10px 1px rgba(0, 0, 0, .25)"
        >
          <Stack spacing="1rem">
            <Box>
              <Text
                color="rgba(0, 0, 0, .5)"
                fontSize=".85rem"
                textTransform="uppercase"
              >
                Nome Aluno
              </Text>
              <Text
                mt=".25rem"
                display="block"
                as="strong"
                fontSize="1.25rem"
              >
                {student.userName}
              </Text>
            </Box>

            <Box>
              <Text
                color="rgba(0, 0, 0, .5)"
                fontSize=".85rem"
                textTransform="uppercase"
              >
                Data da Entrega
              </Text>
              <Text
                mt=".25rem"
                display="block"
                fontSize="1.25rem"
                as="strong"
              >
                {student.created_at}
              </Text>
            </Box>
          </Stack>
        </Box>

        <Accordion
          allowToggle
          background="#FAFAFA"
          p="1.125rem"
          borderRadius={5}
          boxShadow="0px 0px 10px 1px rgba(0, 0, 0, .25)"
        >
          <AccordionItem
            position="relative"
            background="#FAFAFA"
            border="none"
            borderRadius={5}
          >
            <AccordionButton
              p={0}
              background="transparent"
              _hover={{
                background: "transparent"
              }}
              _focus={{
                border: "none",
                outline: 0,
                background: "transparent"
              }}
            >
              <Text
                color="rgba(0, 0, 0, .5)"
                fontSize=".85rem"
                textTransform="uppercase"
                flex={1}
                textAlign="left"
              >
                Anexo
              </Text>
              <AccordionIcon color="rgba(0, 0, 0, .5)" />
            </AccordionButton>

            <AccordionPanel mt=".5rem">
              <Image src={String(student.attachments)} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </>
  ) : (
    <Splash />
  )
}