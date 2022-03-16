import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { FiUser, FiUpload } from "react-icons/fi";
import { MdArrowBackIos, MdDone, MdSearch, MdShare } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";

import { List } from "../components/List";

export type StudentActivity = {
  id: string;
  userName: string;
}

export function Deliveries() {
  const database = getFirestore(app);

  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);
  const [ t, setId ] = useState([]);

  useEffect(() => {
    const queryActivitiesUser = query(
      collection(database, "tasksDelivered"),
      where("activityId", "==", id),
      orderBy("userName", "asc")
    );

    getDocs(queryActivitiesUser)
      .then(response => {
        const data = response.docs.map(doc => {
          const data = doc.data() as { userName: string };

          return {
            id: doc.id,
            userName: data.userName
          }
        }) as StudentActivity[];

        if (data.length > 0) {
          localStorage.setItem("@lastStudentsTasksStoraged", JSON.stringify(data.length));
        } else {
          localStorage.setItem("@lastStudentsTasksStoraged", JSON.stringify(0));
        }

        setActivitiesStudent(data);
      })
      .catch(error => console.log(error))
  }, []);

  async function shareTask() {
    const urlToDeliverTask = location.origin + "/deliver/" + id;
    const taskName = new URLSearchParams(search).get("taskName");

    const shareTask: ShareData = {
      title: String(taskName),
      text: "Acesse o link para entregar uma tarefa ou participar de uma votação.",
      url: urlToDeliverTask,
    }

    await navigator.share(shareTask);
  }

  async function removeTask() {
    const collectionTeste = doc(database, "tasks", String(id));

    await deleteDoc(collectionTeste);

    navigate(-1);
  }

  return (
    <>
      <Box
        bg="primary"
        h="14vh"
      >
        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          py={4}
          justify="space-between"
          align="center"
        >
          <Link to="/">
            <MdArrowBackIos
              size={20}
              color="white"
            />
          </Link>
          <Flex align="center" gap="1rem">
            <Flex align="center" mr={2}>
              <Text
                fontSize="1rem"
                fontWeight={600}
                color="rgba(255, 255, 255, 85)"
                mr={2}
              >
                {activitiesStudent.length}
              </Text>
              <FiUser color="rgba(255, 255, 255, .5)" size={18} />
            </Flex>
            <Flex
              as="button"
              justify="center"  
              onClick={shareTask}
              align="center"
            >
              <MdShare color="rgba(255, 255, 255, .85)" size={20} />
            </Flex>
            <Link to={`/deliver/${id}`}>
              <FiUpload color="rgba(255, 255, 255, .85)" size={20} />
            </Link>
          </Flex>
        </Flex>
      </Box>


      <Flex
        mx="auto"
        direction="column"
        maxW={720}
        position="relative"
        w="90%"
        h="calc(100vh - 14vh)"
      >
        <Box my={-5}>
          {activitiesStudent.length ?
            activitiesStudent.map(student => (
              <List
                key={student.id}
                title={student.userName}
                router={`/student/${student.id}`}
              />
            ))
            :
            SkeletonEffect({
              localStorageName: "lastStudentsTasksStoraged"
            })
          }
        </Box>

        <Button
          mt={8}
          position="absolute"
          bg="#7455FE"
          w={50}
          h={50}
          borderRadius={25}
          onClick={removeTask}
          bottom={10}
          right={0}
          transition=".5s"
          _hover={{
            width: "10rem",
          }}
        >
          <Text 
            color="#FFF" 
            overflowX="hidden"
          >
            Concluir Lista
          </Text>
          <MdDone 
            color="#FFF" 
            size={20} 
            style={{ 
              overflow: "visible", 
            }}
          />
        </Button>
      </Flex>
    </>
  )
}