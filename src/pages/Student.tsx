import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { app } from "../services/firebase";

type StudentActivity = {
  activityId: string;
  userName: string;
  attachments: string;
}

export function Student() {
  const database = getFirestore(app);
  const { id } = useParams();

  const [ student, setStudent ] = useState<StudentActivity>({} as StudentActivity);
  const [loadTaks, setLoadData] = useState(false);


  useEffect(() => {
    try {
      setLoadData(true);

      const activityCollection = collection(database, "users_activity");

      getDocs(activityCollection)
        .then(response => {
          const data = response.docs
              .find(doc => doc.id === id)?.data() as StudentActivity;

          setStudent(data);
        })
        .catch(error => console.log(error))
        .finally(() => setLoadData(false));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(student);

  return (
    <Box 
      w={340} 
      mx={"auto"} 
      my={"1rem"}
    >
      <Flex 
        as="header" 
        alignItems={"center"}
      >
        <Link to={"/"}>
          <MdArrowBackIos 
            size={20} 
            color="#7474FE"
          />
        </Link>
        <Text 
          flex={"1"} 
          textAlign="center" 
          fontWeight={500} 
          fontSize={24}
        >
          { student?.userName }
        </Text>
      </Flex>

      <Box>
        <Box>
          <Text>Data da Entrega</Text>
          <Text>10/10/2022</Text>
        </Box>

        <Box>
          <Text>Anexo</Text>
          <Stack spacing={4}>
            <Flex>
              <Image src={student?.attachments}/>
            </Flex>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function setActivitiesStudent(data: { id: string; userName: any; }[]) {
  throw new Error("Function not implemented.");
}
