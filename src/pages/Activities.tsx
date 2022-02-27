import { useEffect, useState } from "react";
import { Box, Flex, Input, Button, Text, Image } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { getDocs, getFirestore, collection, addDoc, query, where } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from "../services/firebase";

import { List } from "../components/List";
import { useAuth } from "../hooks/useAuth";

type Activity = {
  id: number;
  name:string;
}

export function Activities() {
  const database = getFirestore(app);

  const { user, signIn } = useAuth();

  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Activity[]>([]);

  async function loadData() {
    try {
      const activityCollection = collection(database, "activities");

      const queryActivitiesUser = query(
        activityCollection,
        where("userId", "==", user?.uid)
      );

      const response = await getDocs(queryActivitiesUser);
      const data = response.docs
          .map(doc => doc.data())
          .map(doc => {
            return {
              id: Math.random(),
              name: doc.name
            }
          });

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleAddTask() {
    if (!task) return;

    try {
      await addDoc(collection(database, "activities"), {
        name: task,
        userId: String(user?.uid)
      });

      setTasks(taks => [
        ...taks,
        { id: Math.random(), name: task }
      ]);

    } catch (error) {
      console.log(error);
    }

    setTask("");
  }

  return (
    <Box maxW={340} my={4} mx="auto">
      <Flex justify="space-between" align="center">
        <Text>
          <Text fontSize={20} fontWeight={500} as="span">{!user?.displayName ? "por favor" : "Suas listas"}</Text>
          <Text fontSize={24} color="#7474FE" fontWeight="bold" as="span" display={"block"}>{user?.displayName ?? "Faça Login"}</Text>
        </Text>
        <Box bg="#7474FE" w="3.75rem" p={.5} borderRadius="50%">
          <Image
            _hover={{ filter: "brightness(0.8)" }}
            w="100%"
            onClick={signIn}
            borderRadius="50%"
            border="2px solid #FFF"
            src={String(user?.photoURL)}
            alt="Foto Perfil"
          />
        </Box>
      </Flex>
      <Flex justify="space-between" mt={8}>
        <Input
          placeholder="Nova Tarefa"
          onChange={e => setTask(e.target.value)}
          value={task}
          fontSize={18}
          variant="outline"
        />
        <Button bg="#7474FE" onClick={handleAddTask} ml={2}>
          <MdAdd size={32} color="#FFF" />
        </Button>
      </Flex>

      <Box mt={12}>
        {tasks.map(task => (
          <List
            key={task.id}
            router={`/deliveries/${task.name}`}
            title={task.name}
          />
        ))}
      </Box>
    </Box>
  )
}
