import { Box, Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdAdd, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { List } from "../components/List";
import { useAuth } from "../contexts/AuthContext";
import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";


type Task = {
  id: string;
  name: string;
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

  useEffect(() => {
    setLoadTaks(true);

    if (!user.uid) return;

    const queryTasksUserLogged = query(
      collection(database, "tasks"),
      where("userId", "==", user.uid)
    );

    getDocs(queryTasksUserLogged)
      .then(response => {
        const tasks = response.docs.map(doc => {
          return {
            id: doc.id,
            name: doc.data().name,
          }
        }) as Task[];

        if (tasks.length > 0) {
          localStorage.setItem("@lastQuantityActivities", JSON.stringify(tasks.length));
        }

        setTasks(tasks);
      })
      .catch(error => console.log(error))
      .finally(() => setLoadTaks(false));
  }, [user]);


  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/signIn");
    } catch (error) {
      console.log(error)
    }
  }

  async function handleAddTask() {
    if (!task) return;

    try {
      setLoadButton(true);

      const queryTaskByName = query(
        collection(database, "tasks"),
        where("name", "==", task)
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
        { userId: user.uid, name: task }
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


  return (
    <Box
      maxW={340}
      my={4}
      mx="auto"
    >
      <Flex
        justify="space-between"
        align="center"
      >
        <Text>
          <Text
            fontSize={20}
            fontWeight={500}
            as="span"
          >
            Suas Tarefas
          </Text>
          <Text
            fontSize={24}
            color="#7474FE"
            fontWeight="bold"
            as="span"
            display={"block"}
          >
            {user.displayName}
          </Text>
        </Text>
        <Flex
          as={Button}
          bg="#F9F9F9"
          p={2}
          onClick={handleSignOut}
          borderRadius="50%"
          justify="center"
          align="center"
        >
          <MdLogout color="#B4B4B4" size={32} />
        </Flex>
      </Flex>
      <Flex
        justify="space-between"
        mt={8}
      >
        <Input
          placeholder="Nova Tarefa"
          onChange={e => setTask(e.target.value)}
          value={task}
          fontSize={18}
          variant="outline"
        />
        <Button
          bg="#7474FE"
          onClick={handleAddTask}
          ml={2}
          isLoading={loadButton}
        >
          <MdAdd
            size={32}
            color="#FFF"
          />
        </Button>
      </Flex>

      <Box mt={12}>
        {loadTaks ? (
          SkeletonEffect()
        ) :
          tasks.map(task => (
            <List
              key={task.id}
              router={`/deliveries/${task.id}`}
              title={task.name}
            />
          )).reverse()
        }
      </Box>
    </Box>
  );
}
