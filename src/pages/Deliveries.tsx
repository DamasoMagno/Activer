import { Box, Button, Flex, Skeleton, Text } from "@chakra-ui/react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

import { List } from "../components/List";
import { SpeedDial } from "../components/SpeedDial";
import { app } from "../services/firebase";

export type StudentActivity = {
  id: string;
  userName: string;
}

export function Deliveries() {
  const database = getFirestore(app);
  const { id } = useParams();

  const [loadTaks, setLoadData] = useState(false);

  const [activitiesStudent, setActivitiesStudent] = useState<StudentActivity[]>([]);

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

      const activityCollection = collection(database, "users_activity");

      const queryActivitiesUser = query(activityCollection, where("activityId", "==", id));

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

      <Flex>
        <Button>
          Teste
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