import { Box, Flex, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { app } from "../services/firebase";

type StudentActivity = {
  activityId: string;
  userName: string;
  attachments: string;
  created_at: Date;
}

export function Student() {
  const database = getFirestore(app);
  const { id } = useParams();

  const [student, setStudent] = useState<StudentActivity>({} as StudentActivity);

  useEffect(() => {
    try {
      const activityCollection = collection(database, "tasksDelivered");

      getDocs(activityCollection)
        .then(response => {
          const data = response.docs
            .find(doc => doc.id === id)?.data() as StudentActivity;

          setStudent(data);
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box
      w={340}
      mx={"auto"}
      my={"1rem"}
    >
      <Flex
        w="10%"
        padding={4}
        as="header"
        justify="center"
        align="center"
      >
        <Link to={"/"}>
          <MdArrowBackIos
            size={20}
            color="#7474FE"
          />
        </Link>
      </Flex>

      <Stack spacing={4} mt={8}>
        <>
          <Box>
            <Text>Nome Aluno</Text>
            <Text>
              {
                student?.userName ??
                <Skeleton
                  h="40px"
                  startColor="rgba(116, 116, 254, .5)"
                  endColor="rgba(116, 116, 254, 1)"
                />
              }
            </Text>
          </Box>

          <Box>
            <Text>Data da Entrega</Text>
            <Text>
              {
                student?.created_at ??
                <Skeleton
                  h="40px"
                  startColor="rgba(116, 116, 254, .5)"
                  endColor="rgba(116, 116, 254, 1)"
                />
              }
            </Text>
          </Box>

          <Box>
            <Text>Anexo</Text>
            <Stack spacing={4}>
              <Flex>
                {
                  student.attachments ?
                    <Image src={String(student.attachments)} /> :
                    <Skeleton
                      h="40px"
                      startColor="rgba(116, 116, 254, .5)"
                      endColor="rgba(116, 116, 254, 1)"
                    />
                }
              </Flex>
            </Stack>
          </Box>
        </>
      </Stack>
    </Box>
  );
}