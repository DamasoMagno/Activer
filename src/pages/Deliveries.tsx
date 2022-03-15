import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { FiUser, FiUpload } from "react-icons/fi";
import { MdArrowBackIos, MdDone, MdSearch, MdShare } from "react-icons/md";
import { Link, useLocation, useParams } from "react-router-dom";
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

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);

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

  async function findStudent(e: ChangeEvent<HTMLInputElement>) {
    if(!e.target.value) return;

    try {
      const queryActivitiesUser = query(
        collection(database, "tasksDelivered"),
        where("userName", "==", e.target.value),
        where("activityId", "==", id)
      );

      const response = await getDocs(queryActivitiesUser);

      const data = response.docs.map(doc => {
        const data = doc.data() as { userName: string };

        return {
          id: doc.id,
          userName: data.userName
        }
      }) as StudentActivity[];
        
      setActivitiesStudent(data);
    } catch (error) {
      console.log(error);
    }
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
        w="90%"
      >
        <FormControl
          as={Flex}
          mt={-5}
          align="center"
          borderRadius="8px"
          p=".5rem .5rem"
          background="#FAFAFA"
          border="1px solid #FAFAFA"
          transition=".25s"
          _focusWithin={{
            border: "1px solid blue"
          }}
        >
          <MdSearch
            color="#3333"
            size={24}
          />
          <Input
            placeholder="Buscar Estudante"
            onChange={findStudent}
            variant="unstyled"
            ml={2}
          />
        </FormControl>
        {!!activitiesStudent.length &&
          <Button
            mt={8}
            alignSelf="flex-end"
            bg="primary"
            borderRadius={8}
            p={"5px 20px"}
          >
            <Text color="#FFF" mr={2}>Concluir Lista</Text>
            <MdDone color="#FFF"/>
          </Button>}

        <Box my={2}>
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
      </Flex>
    </>
  )
}