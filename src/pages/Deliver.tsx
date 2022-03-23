import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Box, Button, Center, Flex, Image, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos, MdCloudUpload, MdSend } from "react-icons/md";

import { useAuth } from "../contexts/AuthContext";
import { database, storage } from "../services/firebase";
import { Splash } from "./Splash";
import { useModal } from "../contexts/ModalContext";

type Task = {
  userId: string;
  finished_at: number;
  name: string
}

type UserTask = {
  activityId: string;
  attachments: string;
  created_at: number;
  id: string;
  userName: string;
}

export function Deliver() {
  const navigate = useNavigate();
  const params = useParams<string>();
  const id = params.id as string;
  const toast = useToast();

  const { user } = useAuth();
  const { openModal } = useModal();

  const [attachments, setAttachments] = useState({} as File);
  const [previewAttachments, setPreviewAttachments] = useState<string>("");

  const [activitySendLoading, setActivityLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imageAlreadyStoraged, setImageAlreadyStoraged] = useState<boolean>(false);

  useEffect(() => {
    const task = doc(database, "tasks", String(id));

    getDoc(task)
      .then(response => {
        const data = response.data() as Task;

        if (!data) {
          openModal({
            title: "Tarefa concluída!",
            description: "Esta tarefa já foi concluida",
            pageDestination: "/"
          });

          return;
        }
      });
  }, []);

  useEffect(() => {
    const queryTaskUser = query(
      collection(database, "tasksDelivered"),
      where("activityId", "==", id)
    );

    getDocs(queryTaskUser)
      .then(response => {

        const userTask = response.docs
          .map(doc => doc.data())
          .find(data => data.userName === user.displayName);

        if (userTask) {
          setImageAlreadyStoraged(true);

          setPreviewAttachments(userTask.attachments);
        };
      })
      .finally(() => setPageLoading(false));
  }, [user]);

  async function updateAttachmentTask(userTaskId: string, storageRef: StorageReference) {
    await uploadBytes(storageRef, attachments);

    const imageURL = await getDownloadURL(storageRef);

    await updateDoc(
      doc(database, "tasksDelivered", String(userTaskId)),
      {
        attachments: imageURL,
        created_at: Date.now()
      }
    );
  }

  async function handleSubmitTask(event: FormEvent) {
    event.preventDefault();

    try {
      setActivityLoading(true);

      const taskDoc = doc(database, "tasks", String(id));

      const { name: taskName } = await getDoc(taskDoc).then(doc => doc.data()) as Task;

      const storageRef = ref(
        storage,
        `attachments/student=${user.displayName}&task=${taskName}`
      );

      const queryTaskUser = query(
        collection(database, "tasksDelivered"),
        where("activityId", "==", id)
      );

      const response = await getDocs(queryTaskUser)
        .then(data => data.docs);

      const userTask = response.map(doc => {
        return {
          id: doc.id,
          userName: doc.data().userName
        }
      }).find(data => data.userName === user.displayName) as UserTask;

      if (userTask) {
        updateAttachmentTask(userTask.id, storageRef);

        setActivityLoading(false);

        openModal({
          title: "Tarefa enviada!",
          description: "Tarefa enviada com sucesso.",
          pageDestination: "/"
        });

        return;
      }

      await uploadBytes(storageRef, attachments);

      const imageURL = await getDownloadURL(storageRef);

      await addDoc(
        collection(database, "tasksDelivered"),
        {
          userName: user.displayName,
          attachments: imageURL,
          activityId: id,
          created_at: Date.now()
        }
      );

      setActivityLoading(false);

      openModal({
        title: "Tarefa enviada!",
        description: "Tarefa enviada com sucesso.",
        pageDestination: "/"
      });
    } catch (error) {
      console.log(error);
    }

    setActivityLoading(false);
  }

  function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    try {
      if (!e.target.files) return

      const filesType = ["jpeg", "png", "jpg", "webp", "svg"];
      const file: File = e.target.files[0];

      const fileInImage = filesType.some(type => file.type.includes(type));

      if (!fileInImage) {
        return toast({
          title: "Apenas imagens são aceitas",
          status: "info",
          position: "top"
        });
      }

      setAttachments(file);

      const imageUrl = URL.createObjectURL(file);

      setPreviewAttachments(imageUrl);

      setImageAlreadyStoraged(false);
    } catch (error) {
      console.log(error);
    }
  }

  return !user.displayName || pageLoading ?
    (
      <Splash />
    ) : (
      <>
        <Box
          bg="background"
          position="relative"
          py=".25rem"
          as="header"
        >
          <Flex
            w="90%"
            maxW={720}
            py={4}
            mx="auto"
            align="center"
          >
            <Link to={"/"}>
              <MdArrowBackIos color="white" />
            </Link>
            <Text
              as="h2"
              fontSize={20}
              color="#FFF"
              w="100%"
              textAlign="center"
            >
              Tarefa
            </Text>
          </Flex>
        </Box>

        <Flex
          maxW={720}
          w="90%"
          mx="auto"
          as="form"
          mt={8}
          onSubmit={handleSubmitTask}
          direction="column"
          justify="space-between"
          py="1rem"
          h="80vh"
        >
          <Stack spacing={3}>
            <Box
              border="3px dashed #7474FE"
              borderRadius={8}
              h="200px"
              background={`rgba(116, 116, 253, .5)`}
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
                <Center h="100%">
                  <MdCloudUpload color="rgba(255, 255, 255, .5)" size="2.5rem" />
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
                {previewAttachments ? "Trocar Anexo" : "Selecionar Anexo"}
              </Center>
              <Input
                type="file"
                borderStyle="none"
                p={3}
                opacity={0}
                w="100%"
                h="100%"
                onChange={uploadImage}
              />
            </Flex>
          </Stack>

          <Button
            bg="#7474FE"
            p={6}
            type="submit"
            isLoading={activitySendLoading}
            disabled={imageAlreadyStoraged}
            alignItems="center"
          >
            <Text color="#FFF" flex={1}>ENVIAR</Text>
            <MdSend color="#FFF" />
          </Button>
        </Flex>
      </>
    )
}
