import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { SpeedButton } from "./buttons";


export function SpeedDial() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [speedDialActive, setSpeedDialActive] = useState(false);

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      position="fixed"
      bottom={5}
      right={5}
    >
      {speedDialActive && (
        <>
          <SpeedButton
            onClick={() => navigate(`/deliver/${id}`)}
            icon={MdAdd}
            label="Realizar atividade"
          />
          <SpeedButton
            onClick={() => navigate(`/deliver/1`)}
            icon={MdDelete}
            label="Concluir"
          />
        </>
      )}
      <Flex
        className="teste"
        as="button"
        onClick={() => setSpeedDialActive(!speedDialActive)}
        w="50px" h="50px"
        justify="center"
        align="center"
        borderRadius="50%"
        bg="#7474FE"
      >
        {speedDialActive ?
          <MdClose color="#FFF" size={"50%"} /> :
          <MdAdd color="#FFF" size={32} />
        }
      </Flex>
    </Flex>
  );
}