import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useParams, useNavigate } from "react-router-dom";
import { app } from "../services/firebase";

type StudentActivity = {
  activityId: string;
  userName: string;
  attachments: string;
  created_at: Date;
}

export function Student() {
  const navigate = useNavigate()

  const database = getFirestore(app);
  const { id } = useParams();

  const [student, setStudent] = useState<StudentActivity>({} as StudentActivity);

  useEffect(() => {
    try {
      const activityCollection = collection(database, "tasksDelivered");

      getDocs(activityCollection)
        .then(response => {
          const data = response.docs
            .find(doc => doc.id === id)?.data() as StudentActivity;

          setStudent(data);
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Box bg="primary" h="14vh">
        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          py={4}
        >
          <Button onClick={() => navigate(-1)} variant="none" p={0}>
            <MdArrowBackIos
              size={20}
              color="#FFF"
            />
          </Button>
        </Flex>
      </Box>

      <Stack
        spacing={4}
        mt={-8}
        w="90%"
        maxW={720}
        mx="auto"
      >
        <Box
          position="relative"
          background="#FAFAFA"
          p={4}
          borderRadius={5}
          _after={{
            position: "absolute",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            w: "5px",
            left: 0,
            top: 0,
            background: "primary",
            content: `""`,
            h: "100%"
          }}
        >
          <Text color="#333">Nome Aluno</Text>
          <Text mt={2} fontSize={20} fontWeight="600">
            {student.userName}
          </Text>
        </Box>

        <Box
          position="relative"
          background="#FAFAFA"
          p={4}
          borderRadius={5}
          _after={{
            position: "absolute",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            w: "5px",
            left: 0,
            top: 0,
            background: "primary",
            content: `""`,
            h: "100%"
          }}
        >
          <Text>Data da Entrega</Text>
          <Text mt={2} fontSize={20} fontWeight="600">
            {student.created_at}
          </Text>
        </Box>

        <Accordion allowToggle>
          <AccordionItem
            position="relative"
            background="#FAFAFA"
            p={4}
            border="none"
            borderRadius={5}
            _after={{
              position: "absolute",
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
              w: "5px",
              left: 0,
              top: 0,
              background: "primary",
              content: `""`,
              h: "100%"
            }}
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
              <Text flex={1} textAlign="left">Anexo</Text>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel>
              <Image
                src={String(student.attachments)}
                mt={5}
                fontSize={20}
                fontWeight="600"
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </>
  );
}