import { Box, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { MdArrowBackIos, MdDone, MdShare } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { List } from "../components/List";
import { app } from "../services/firebase";
import { SkeletonEffect } from "../utils/skeleton";

export type StudentActivity = {
  id: string;
  userName: string;
}

export function Deliveries() {
  const database = getFirestore(app);

  const { id } = useParams();
  const navigate = useNavigate();

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function copyUrl() {
    await navigator.clipboard.writeText(String(id));
  }

  async function removeTask(){
    await deleteDoc(doc(database, "cities", "DC"));
  }

  return (
    <>
      <Box
        bg="primary"
        as="header"
      >
        <Flex
          maxW={340}
          mx="auto"
          p={".5rem 0"}
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
            <Flex align="center" gap=".25rem">
              <Text
                fontSize="1rem"
                fontWeight={600}
                color="rgba(255, 255, 255, 85)"
              >
                {activitiesStudent.length}
              </Text>
              <FiUser color="rgba(255, 255, 255, .5)" size={18} />
            </Flex>

            <Menu>
              <MenuButton
                border={0}
                as={IconButton}
                icon={<GiHamburgerMenu color="#FFF" size={20} />}
                variant='no-style'
              />
              <MenuList>
                <MenuItem icon={<MdShare />} onClick={copyUrl}>
                  Compartilhar
                </MenuItem>
                <MenuItem icon={<MdDone />} onClick={() => navigate(`/deliver/${id}`)}>
                  Fazer Atividade
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>


      <Flex
        mx="auto"
        direction="column"
        maxW={340}
        my={8}
      >
        { !!activitiesStudent.length &&
        <Button
          alignSelf="flex-end"
          bg="primary"
          borderRadius={8}
          p={"5px 20px"}
        >
          <Text color="#FFF">Concluir Lista</Text>
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