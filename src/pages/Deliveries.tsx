import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { List } from "../components/List";
import { app } from "../services/firebase";


export type StudentActivity = {
  id: string;
  userName: string;
}

export function Deliveries() {
  const database = getFirestore(app);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadTaks, setLoadData] = useState(false);

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);

  useEffect(() => {
    try {
      setLoadData(true);

      const queryActivitiesUser = query(
        collection(database, "tasksDelivered"), 
        where("activityId", "==", id)
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
            localStorage.setItem("@lastQuantityActivities", JSON.stringify(data.length));
          }

          setActivitiesStudent(data);
        })
        .catch(error => console.log(error))
        .finally(() => setLoadData(false));
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function finishCollection(){
    await deleteDoc(doc(database, "activities", `${id}`))
  }

  return (
    <Box
      maxW={340}
      mx="auto"
      my={4}
      h={"90vh"}
      position="relative"
    >
      <Flex
        as="header"
        justify="space-between"
        align="center"
      >
        <Flex align="center">
          <Link to="/">
            <MdArrowBackIos
              size={20}
              color="#7474FE"
            />
          </Link>
          <Text
            fontSize={24}
            ml={"4px"}
            fontWeight={500}
            lineHeight={"25px"}
          >
            Entregues
          </Text>
        </Flex>
        <Text
          color="#7474FE"
          fontSize={"22px"}
          fontWeight={600}
        >
          {activitiesStudent.length }
        </Text>
      </Flex>

      <Flex gap=".25rem" my={4}>
        <Button 
          w="100%" 
          bg="transparent" 
          border="1px solid #7474FE"
          onClick={() => navigate(`/deliver/${id}`)}
        >
          <Text color="#7474FE">Enviar Atividade</Text>
        </Button>
        <Button 
          w="100%" 
          bg="transparent" 
          border="1px solid #7474FE"
          onClick={finishCollection}
        >
          <Text color="#7474FE">Concluir Lista</Text>
        </Button>
      </Flex>

      <Box as="main">
       { activitiesStudent.map( student => (
          <List
          key={student.id}
          title={student.userName}
          router={`/student/${student.id}`}
        />
       ) ) }
      </Box>
    </Box>
  );
}