import { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { FiUser, FiUpload, FiAlertCircle } from "react-icons/fi";
import { MdArrowBackIos, MdDone, MdSearch, MdShare, MdUpload } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";

import { List } from "../components/List";
import { useAuth } from "../contexts/AuthContext";
import { Splash } from "./Splash";
import { SpeedDial } from "../components/SpeedDial";
import { SpeedButton } from "../components/SpeedDial/button";
import { Search } from "../components/Search";

export type StudentActivity = {
  id: string;
  userName: string;
}

export function Deliveries() {
  const database = getFirestore(app);

  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);

  const [loadTaks, setLoadTaks] = useState(true);

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
      .finally(() => setLoadTaks(false))
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

  return user.displayName ? (
    <>
      <Box
        bg="background"
        p="1.15rem 0 3rem"
        as="header"
      >
        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          justify="space-between"
          align="center"
        >
          <Link to="/">
            <MdArrowBackIos size="1.25rem" color="white" />
          </Link>

          <Text
            fontSize="1.25rem"
            color="primaryText"
            as="h2"
          >
            Participantes
          </Text>

          <Flex align="flex-end" mr={2}>
            <Text
              fontSize="1.125rem"
              fontWeight="medium"
              color="rgba(255, 255, 255, .85)"
              mr=".25rem"
              lineHeight="none"
            >
              {activitiesStudent.length}
            </Text>
            <FiUser color="rgba(255, 255, 255, .5)" size={14} />
          </Flex>
        </Flex>
      </Box>


      <Flex
        direction="column"
        maxW={720}
        mt={-5}
        as="main"
        w="90%"
        mx="auto"
      >
        <Box>
          {activitiesStudent.length ? (
            activitiesStudent.map(student => {
              return (
                <List
                  key={student.id}
                  title={student.userName}
                  router={`/student/${student.id}`}
                />
              )
            })
          ) : (activitiesStudent.length === 0 && loadTaks === false) && (
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
                  maxW={150}
                  textAlign="center"
                  fontSize="1.25rem"
                >
                  Nenhum Participante
                </Text>
              </Flex>
            </>
          )}
        </Box>

        <SpeedDial>
          <SpeedButton
            icon={MdShare}
            onClick={shareTask}
          />
          <SpeedButton
            icon={MdDone}
            onClick={removeTask}
          />
          <SpeedButton
            icon={MdUpload}
            onClick={() => navigate(`/deliver/${id}`)}
          />
        </SpeedDial>
      </Flex>
    </>
  ) : (
    <Splash />
  )
} 