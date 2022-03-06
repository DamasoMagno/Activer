import { useEffect, useState } from "react";
import { Box, Flex, Input, Button, Text, Image, Skeleton, Stack } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { getDocs, getFirestore, collection, addDoc, query, where } from "firebase/firestore";
import { app } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

import { List } from "../components/List";

type Activity = {
  id: number;
  name: string;
  userId: string | null;
}

export function Activities() {
  const database = getFirestore(app);

  const { user, signIn } = useAuth();

  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Activity[]>([]);

  const [loadButton, setLoadButton] = useState(false);
  const [loadTaks, setLoadData] = useState(false);


  function showLoaderWhileDataNotLoaded() {
    const lastQuantityOfData = [];
    const quantityData = localStorage.getItem("@lastQuantityActivities");

    for (let i = 0; i < Number(quantityData); i++) {
      lastQuantityOfData.push(i);
    }

    return lastQuantityOfData.map(size =>
    (
      <Skeleton
        h="40px"
        key={size}
        startColor="rgba(116, 116, 254, .5)"
        endColor="rgba(116, 116, 254, 1)"
      />
    )
    );
  }


  useEffect(() => {
   try {
    setLoadData(true);

    const activityCollection = collection(database, "activities");

    const queryActivitiesUser = query(activityCollection, where("userId", "==", user.uid));

    getDocs(queryActivitiesUser)
      .then(response => {
        const data = response.docs.map(doc => doc.data()) as Activity[];

        if (data.length > 0) {
          localStorage.setItem("@lastQuantityActivities", JSON.stringify(data.length));
        }

        setTasks(data);
      })
      .catch(error => console.log(error))
      .finally(() => setLoadData(false));
   } catch (error) {
     console.log(error);
   }
  }, [user]);


  async function handleAddTask() {
    if (!task) return;

    try {
      setLoadButton(true);

      const newTask: Activity = {
        id: Math.random(),
        name: task,
        userId: user.uid
      }

      await addDoc(collection(database, "activities"), newTask);

      setTasks(taks => [...taks, newTask]);

      setTask("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoadButton(false);
    }
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
            {user.displayName ? "Suas listas" : "Por favor"}
          </Text>
          <Text
            fontSize={24}
            color="#7474FE"
            fontWeight="bold"
            as="span"
            display={"block"}
          >
            {user.displayName ?? "Faça Login"}
          </Text>
        </Text>
        <Box
          bg="#7474FE"
          w="3.75rem"
          p={.5}
          borderRadius="50%"
        >
          <Image
            _hover={{ filter: "brightness(0.8)" }}
            w="100%"
            onClick={signIn}
            borderRadius="50%"
            border="2px solid #FFF"
            src={String(user.photoURL)}
            alt="Foto Perfil"
          />
        </Box>
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
          <Stack spacing={4}>
            {showLoaderWhileDataNotLoaded()}
          </Stack>
        ) :
          tasks.map(task => (
            <List
              key={task.id}
              router={`/deliveries/${task.name}`}
              title={task.name}
            />
          ))
        }
      </Box>
    </Box>
  );
}
