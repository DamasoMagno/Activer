import { Box, Button, Flex, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../services/firebase";

export function CreateTask() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const toast = useToast();

  const [loadButton, setLoadButton] = useState(false);

  const [name, setName] = useState<string>("");
  const [finishedAt, setFinishedAt] = useState<string>("");
  const [category, setCategory] = useState<"" | "Activity" | "Event">("");

  const [sucessful, setSucessful] = useState(false);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    try {
      setLoadButton(true);

      const queryTaskByName = query(
        collection(database, "tasks"),
        where("name", "==", name),
      );

      const response = await getDocs(queryTaskByName);

      const taskAlreadyExists = response.docs
        .map(doc => doc.data())
        .some(data => data.name === name);

      if (taskAlreadyExists) {
        setLoadButton(false);

        return toast({
          title: "Tarefa já cadastrada",
          status: "info",
          duration: 2500,
          position: "top",
          variant: "subtle",
          isClosable: true
        })
      };

      await addDoc(
        collection(database, "tasks"),
        { userId: user.uid, name, finishedAt, category }
      );

      setName("");
      setFinishedAt("");
      setCategory("");

      navigate("/confirmation/register");
    } catch (error) {
      console.log(error);
    }

    setLoadButton(false);
  }

  return (
    <>
      <Box
        bg="background"
        py="1.25rem"
        as="header"
      >
        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          align="center"
        >
          <Flex as={Link} to="/">
            <MdArrowBackIos size="1.125rem" color="white" />
          </Flex>
          <Text
            as="h2"
            fontSize={20}
            color="primaryText"
            w="calc(100% - 2.7rem)"
            textAlign="center"
          >
            Nova Tarefa
          </Text>
        </Flex>
      </Box>

      <Flex
        onSubmit={handleAddTask}
        w="90%"
        h="calc(100vh - 20vh)"
        as="form"
        direction="column"
        mt="1rem"
        justify="space-between"
        maxW={720}
        mx="auto"
      >
        <Stack spacing={2}>
          <Input
            placeholder="Titulo"
            bg="#F5F5F5"
            color="#969CB2"
            border={0}
            borderRadius=".25rem"
            onChange={e => setName(e.target.value)}
            _focus={{
              border: "none"
            }}
          />
          <Flex
            align="center"
            borderRadius=".25rem"
            bg="#F5F5F5"
            p=".5rem"
          >
            <Input
              placeholder="Data Encerramento"
              bg="#F5F5F5"
              p=".25rem"
              color="#969CB2"
              type="date"
              css={{
                '&::-webkit-calendar-picker-indicator': {
                  display: 'none',
                  '-webkit-appearance': 'none',
                },
              }}
              mr=".25rem"
              onChange={e => setFinishedAt(e.target.value)}
              variant="unstyled"
            />
            <FiCalendar color="#A2A7BA" />
          </Flex>

          <Flex gap=".5rem">
            <Button
              flex={1}
              borderRadius=".25rem"
              type="button"
              transition=".25s"
              onClick={() => setCategory("Activity")}
              background={category === "Activity" ? "background" : "#F5F5F5"}
              color={category === "Activity" ? "#FFF" : "#969CB2"}
            >
              <Text>Tarefas</Text>
            </Button>
            <Button
              display="flex"
              alignItems="center"
              gap=".5rem"
              flex={1}
              type="button"
              transition=".25s"
              borderRadius=".25rem"
              justifyContent="center"
              background={category === "Event" ? "background" : "#F5F5F5"}
              color={category === "Event" ? "#FFF" : "#969CB2"}
              onClick={() => setCategory("Event")}
            >
              <Text>Eventos</Text>
            </Button>
          </Flex>

        </Stack>

        <Button
          bg="rgba(255, 135, 44, 1)"
          isLoading={loadButton}
          type="submit"
          py="1.5rem"
        >
          <Text color="#FFF">Enviar</Text>
        </Button>
      </Flex>
    </>
  )
}