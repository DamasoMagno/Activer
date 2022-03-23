import { Alert, AlertIcon, Box, Button, Flex, Input, Select, Stack, Text, useToast } from "@chakra-ui/react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import { database } from "../services/firebase";
import { FieldError, useForm } from "react-hook-form";

type Task = {
  name: string;
  finishedAt: Date;
  category: "Activity" | "Event";
}

export function CreateTask() {
  const { user } = useAuth();
  const { openModal } = useModal();
  const toast = useToast();

  const [loadButton, setLoadButton] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Task>();

  async function handleAddTask(data: Task) {
    try {
      setLoadButton(true);

      const queryTaskByName = query(
        collection(database, "tasks"),
        where("name", "==", data.name),
        where("userId", "==", user.uid)
      );

      const response = await getDocs(queryTaskByName);

      const taskAlreadyExists = response.docs
        .map(doc => doc.data())
        .some(task => task.name === data.name);

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
        { userId: user.uid, ...data }
      );

      setLoadButton(false);

      openModal({
        title: "Tarefa criada!",
        description: "Tarefa criada com sucesso",
        pageDestination: "/"
      });
    } catch (error) {
      console.log(error);
    }
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
        onSubmit={handleSubmit(handleAddTask)}
        w="90%"
        h="calc(100vh - 20vh)"
        as="form"
        direction="column"
        mt="1rem"
        justify="space-between"
        maxW={720}
        mx="auto"
      >
        <Box>
          <Stack spacing={2}>
            <Input
              placeholder="Titulo"
              bg="#F5F5F5"
              color="#969CB2"
              border={0}
              borderRadius=".25rem"
              {...register("name", { required: "Nome obrigatório" })}
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
                {...register("finishedAt", { required: "Data de conclusão obrigatório" })}
                type="date"
                css={{
                  '&::-webkit-calendar-picker-indicator': {
                    display: 'none',
                    '-webkit-appearance': 'none',
                  },
                }}
                mr=".25rem"
                variant="unstyled"
              />
              <FiCalendar color="#A2A7BA" />
            </Flex>

            <Select
              bg="#F5F5F5"
              color="#969CB2"
              placeholder='Categoria'
              border={0}
              borderRadius=".25rem"
              {...register("category", { required: "Categoria obrigatório" })}
            >
              <option value="Activity">Atividade</option>
              <option value="Evento">Evento</option>
            </Select>
          </Stack>

          <Stack spacing=".25rem" mt="2rem">
            {errors &&
              Object.keys(errors)
                .map((errorName) => {
                  const randomId = Math.random();

                  const field = errorName as "name" | "category" | "finishedAt";
                  const { message } = errors[field] as FieldError;

                  return (
                    <Alert
                      key={randomId}
                      status='error'
                      variant='left-accent'
                      bg="rgba(255, 135, 44, .25)"
                    >
                      <AlertIcon />
                      {message}
                    </Alert>
                  )
                })
            }
          </Stack>
        </Box>

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

