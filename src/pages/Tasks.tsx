import { useEffect, useState } from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

import { useAuth } from "../contexts/AuthContext";
import { auth, database } from "../services/firebase";

import { List } from "../components/List";
import { Splash } from "./Splash";
import { SpeedDial } from "../components/SpeedDial";

type Task = {
  id: string;
  name: string;
  category: string;
  finishedAt: string;
}

export function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [loadTaks, setLoadTaks] = useState(true);

  useEffect(() => {
    if (!user.uid) return

    const queryTasksByUserLogged = query(
      collection(database, "tasks"),
      where("userId", "==", user.uid),
      orderBy("name", "asc")
    );

    getDocs(queryTasksByUserLogged)
      .then(response => {
        const tasks = response.docs.map(doc => {
          const data = doc.data() as Omit<Task, "id">;

          return {
            id: doc.id,
            ...data
          }
        }) as Task[];

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

  return user.displayName ? (
    <>
      <Box bg="background" p="1.15rem 0 3rem">
        <Flex
          justify="space-between"
          align="center"
          maxW={720}
          as="header"
          w="90%"
          mx="auto"
        >
          <Flex align="center">
            <Image
              src={String(user.photoURL)}
              w="30px"
              h="30px"
              borderRadius="50%"
              p=".1rem"
              border="1px solid rgba(255, 255, 255, .5)"
            />
            <Text
              fontSize="1.25rem"
              color="#FFF"
              ml=".125rem"
              as="h2"
            >
              {user.displayName}
            </Text>
          </Flex>
          <MdLogout
            color="#FFF"
            size={24}
            onClick={handleSignOut}
          />
        </Flex>
      </Box>

      <Flex
        direction="column"
        maxW={720}
        mt={-5}
        w="90%"
        mx="auto"
        as="main"
      >
        {tasks.length ? (
          tasks.map(task => {
            return (
              <List
                key={task.id}
                router={`/deliveries/${task.id}?taskName=${task.name}`}
                title={task.name}
              />
            )
          })
        ) : (tasks.length === 0 && loadTaks === false) && (
          <>
            <Flex
              direction="column"
              align="center"
              h="60vh"
              justify="center"
            >
              <FiAlertCircle color="#FF872C" size="2.5rem" />
              <Text
                color="#FF872C"
                mt=".85rem"
                fontSize="1.25rem"
                maxW={150}
                textAlign="center"
              >
                Nenhuma Task
              </Text>
            </Flex>
          </>
        )}

        <SpeedDial action={() => navigate("/register")} />
      </Flex>
    </>
  ) : (
    <Splash />
  );
}