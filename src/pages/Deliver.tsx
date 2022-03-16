import { FormEvent, useEffect, useState } from "react";
import { AlertDialog, AlertDialogOverlay, Box, Button, Center, Flex, Image, Input, Stack, Text, toast, useDisclosure } from "@chakra-ui/react";
import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Link, useParams } from "react-router-dom";
import { MdArrowBackIos, MdClose, MdDone, MdSend } from "react-icons/md";

import { useAuth } from "../contexts/AuthContext";
import { app } from "../services/firebase";


export function Deliver() {
  const params = useParams<string>();
  const id = params.id as string;

  const database = getFirestore(app);
  const storage = getStorage(app);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { user } = useAuth();

  const [attachments, setAttachments] = useState<File>({} as File);
  const [previewAttachments, setPreviewAttachments] = useState<string>("");
  const [activitySendLoading, setActivityLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const queryActivitiesUser = query(
      collection(database, "tasksDelivered"),
      where("activityId", "==", id)
    );

    getDocs(queryActivitiesUser)
      .then(response => {

        const userTask = response.docs
          .map(doc => doc.data())
          .find(data => data.userName === user.displayName);

        if (userTask) {
          setPreviewAttachments(userTask.attachments);
        };
      })
  }, []);


  useEffect(() => {
    try {
      if (!attachments.name) return;

      const binaryData = [];
      binaryData.push(attachments as BlobPart);

      const imageUrl = URL.createObjectURL(new Blob(binaryData));

      setPreviewAttachments(imageUrl);
    } catch (error) {
      console.log(error);
    }
  }, [attachments]);


  async function handleSubmitStudentTask(event: FormEvent) {
    event.preventDefault();

    try {
      setActivityLoading(true);

      const storageRef = ref(storage, `attachments/${attachments.name}`);

      await uploadBytes(storageRef, attachments);

      const queryActivitiesUser = query(
        collection(database, "tasksDelivered"),
        where("activityId", "==", id)
      );
  
      const response = await getDocs(queryActivitiesUser);

      const userTask =  response.docs
          .map(doc => doc.data())
          .find(data => data.userName === user.displayName);  
          
      if(userTask) {
        console.log(userTask);

        setActivityLoading(false);

        return 
      }
      

      const imageURL = await getDownloadURL(storageRef);

      await addDoc(collection(database, "tasksDelivered"), {
        userName: user.displayName,
        attachments: imageURL,
        activityId: id,
        created_at: Date.now()
      });

      onOpen();

      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setTimeout(() => onClose(), 2000);
      
      setError("Erro ao enviar a tarefa");
    }

    setActivityLoading(false);
  }

  return (
    <>
      <Box
        h="14vh"
        bg="primary"
      >
        <Flex
          w="90%"
          maxW={720}
          py={4}
          mx="auto"
        >
          <Link to={"/"}>
            <MdArrowBackIos color="white" />
          </Link>
        </Flex>
      </Box>

      <Flex
        maxW={720}
        w="90%"
        mx="auto"
        as="form"
        mt={8}
        onSubmit={handleSubmitStudentTask}
        direction="column"
        justify="space-between"
        h="75vh"
      >
        <Stack spacing={4}>
          <Box
            border="3px dashed #7474FE"
            borderRadius={8}
            h="250px"
            background="rgba(116, 116, 253, .5)"
          >
            {previewAttachments ? (
              <Image
                src={previewAttachments}
                alt="Imagem da atividade"
                w="100%"
                h="100%"
                fit="contain"
              />
            ) : (
              <Center
                h="100%"
                maxW={200}
                textAlign="center"
                m="auto"
                fontWeight={500}
                color="#FFF"
              >
                Nenhum Arquivo Selecionado
              </Center>
            )}
          </Box>
          <Flex
            position="relative"
            border="1px dashed #7474FE"
            borderRadius={4}
          >
            <Center
              w="100%"
              position="absolute"
              h="100%"
              fontSize={20}
              color="#7474FE"
            >
              {previewAttachments ? "Trocar Anexo" : "Enviar Anexo"}
            </Center>
            <Input
              type="file"
              borderStyle="none"
              p={3}
              opacity={0}
              w="100%"
              h="100%"
              onChange={e => e.target.files && setAttachments(e.target.files[0])}
            />
          </Flex>
        </Stack>

        <Button
          bg="#7474FE"
          p={6}
          type="submit"
          isLoading={activitySendLoading}
          alignItems="center"
        >
          <Text color="#FFF" flex={1}>ENVIAR</Text>
          <MdSend color="#FFF" />
        </Button>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay 
          bg="rgba(0, 0, 0, .7)" 
        >
          <Flex
            h="100vh"
            direction="column"
            justify="center"
            align="center"
          >
            {error ?
              <MdClose color="red" size={100} /> :
              <MdDone color="green" size={100} />
            }
            <Text
              color="#FFF"
              w={200}
              mt={5}
              textAlign="center"
              fontWeight="700"
              fontSize="1.5rem"
            >
              {error ? error : "Tarefa enviada com sucesso"}
            </Text>
          </Flex>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}