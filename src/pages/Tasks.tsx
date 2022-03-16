import { ChangeEvent, useEffect, useState, useRef } from "react";
import { Box, Button, Flex, Input, Text, useToast, Select, Image } from "@chakra-ui/react";
import { addDoc, collection, getDocs, getFirestore, orderBy, OrderByDirection, query, where } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdLogout } from "react-icons/md";
import { BiMenuAltLeft } from "react-icons/bi";

import { useAuth } from "../contexts/AuthContext";
import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";

import { List } from "../components/List";
import { Loader } from "../components/Loader";

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

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadButton, setLoadButton] = useState(false);
  const [loadTaks, setLoadTaks] = useState(false);
  const [order, setOrder] = useState<Order>({ field: "name", order: "asc" });

  const inputTask = useRef<HTMLInputElement>({} as HTMLInputElement);

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
    if (!inputTask.current.value) return;

    try {
      setLoadButton(true);

      const queryTaskByName = query(
        collection(database, "tasks"),
        where("name", "==", inputTask.current.value),
      );

      const response = await getDocs(queryTaskByName);

      const taskAlreadyExists = response.docs
        .map(doc => doc.data())
        .some(data => data.name === inputTask.current.value);

      if (taskAlreadyExists) {
        setLoadButton(false);

        inputTask.current.value = "";

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
        { userId: user.uid, name: inputTask.current.value, created_at: Date.now() }
      );

      setTasks(taks => [...taks, {
        id: newTask.id,
        name: inputTask.current.value
      }]);

      inputTask.current.value = "";
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
          <Flex align="center" gap=".25rem">
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
          ref={inputTask}
          fontSize={18}
          variant="outline"
          bg="#FFF"
        />
        <Button
          bg="#7455FE"
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

      <Flex
        mt={5}
        direction="column"
        maxW={720}
        w="90%"
        mx="auto"
      >
        <Select
          onChange={setOrderData}
          variant="unstyled"
          alignSelf="end"
          mt={8}
          icon={<BiMenuAltLeft/>}
          mb={4}
          maxW={180}
          textAlign="right"
          color="rgba(0, 0, 0, .5)"
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
      </Flex>
    </>
  ) : (
    <Loader />
  );
}
