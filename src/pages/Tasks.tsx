import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text, useToast, Spinner, Center, Stack, Select, Image, Wrap } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore, orderBy, OrderByDirection, query, where } from "firebase/firestore";
import { MdAdd, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";

import { List } from "../components/List";

type Task = {
  id: string;
  name: string;
}

type Order = {
  field: string;
  order: OrderByDirection;
}

export function Tasks() {
  const database = getFirestore(app);
  const auth = getAuth(app);

  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadButton, setLoadButton] = useState(false);
  const [loadTaks, setLoadTaks] = useState(false);
  const [order, setOrder] = useState<Order>({ field: "name", order: "asc" });
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    setLoadTaks(true);

    if (!user.uid) return;

    const queryTasksByUserLogged = query(
      collection(database, "tasks"),
      where("userId", "==", user.uid),
      orderBy(order.field, order.order)
    );

    getDocs(queryTasksByUserLogged)
      .then(response => {
        const tasks = response.docs.map(doc => {
          return {
            id: doc.id,
            name: doc.data().name,
          }
        }) as Task[];

        if (tasks.length > 0) {
          localStorage.setItem("@lastTasksStoraged", JSON.stringify(tasks.length));
        } else {
          localStorage.setItem("@lastTasksStoraged", JSON.stringify(0));
        }

        setTasks(tasks);
      })
      .catch(error => console.log(error))
      .finally(() => setLoadTaks(false));
  }, [user, order]);


  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/signIn");
    } catch (error) {
      console.log(error)
    }
  }

  function setOrderData(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "Ordem Alfabetica") {
      setOrder({ field: "name", order: "asc" });
    } else {
      setOrder({ field: "created_at", order: "desc" });
    }
  }

  async function handleAddTask() {
    if (!task) return;

    try {
      setLoadButton(true);

      const queryTaskByName = query(
        collection(database, "tasks"),
        where("name", "==", task),
      );

      const response = await getDocs(queryTaskByName);

      const taskAlreadyExists = response.docs
        .map(doc => doc.data())
        .some(data => data.name === task);

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

      const newTask = await addDoc(
        collection(database, "tasks"),
        { userId: user.uid, name: task, created_at: Date.now() }
      );

      setTasks(taks => [...taks, {
        id: newTask.id,
        name: task
      }]);

      setTask("");
    } catch (error) {
      console.log(error);
    }

    setLoadButton(false);
  }

  return user.displayName ? (
    <>
      <Box
        bg="primary"
        h="14vh"
      >
        <Flex
          justify="space-between"
          align="center"
          maxW={720}
          py={4}
          w="90%"
          mx="auto"
        >
          <Flex 
            align="center" 
            gap=".25rem"
          >
            <Image
              src={String(user.photoURL)}
              w="40px"
              h="40px"
              borderRadius="50%"
              p={.4}
              border="1px solid white"
            />
            <Text fontSize="xl" color="#FFF">
              {user.displayName}
            </Text>
          </Flex>
          <MdLogout color="#FFF" size={24} onClick={handleSignOut} />
        </Flex>
      </Box>

      <Flex
        justify="space-between"
        mt={-5}
        maxW={720}
        w="90%"
        mx="auto"
      >
        <Input
          placeholder="Nova Tarefa"
          onChange={e => setTask(e.target.value)}
          value={task}
          fontSize={18}
          variant="outline"
          bg="#FFF"
        />
        <Button
          bg="primary"
          onClick={handleAddTask}
          ml={2}
          isLoading={loadButton}
        >
          <MdAdd
            size={32}
            color="white"
          />
        </Button>
      </Flex>

      <Box
        mt={8}
        maxW={720}
        w="90%"
        mx="auto"
      >
        <Select
          onChange={setOrderData}
          mt={8}
          mb={4}
          maxW={185}
        >
          <option value="Ordem Alfabética" defaultChecked>Ordem Alfabética</option>
          <option value="Data Criação">Data Criação</option>
        </Select>

        {loadTaks ? (
          SkeletonEffect({
            localStorageName: "lastTasksStoraged"
          })
        ) :
          tasks.map(task => (
            <List
              key={task.id}
              router={`/deliveries/${task.id}?taskName=${task.name}`}
              title={task.name}
            />
          ))
        }
      </Box>
    </>
  ) : (
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
        <Spinner
          thickness='5px'
          speed='1s'
          emptyColor='gray.600'
          color='white'
          size='xl'
        />
        <Text
          color="#FFF"
          fontSize="1.5rem"
        >
          Carregando
        </Text>
      </Flex>
    </Center>
  );
}
