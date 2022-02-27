import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { SpeedButton } from "./button";

export function SpeedDial() {
  const navigate = useNavigate();

  const [speedActive, setSpeedActive] = useState(false);

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      position="absolute"
      bottom={0}
      right={0}
    >
      {speedActive && (
        <>
          <SpeedButton
            onClick={() => navigate(`/deliver/1`)}
            icon={MdAdd}
            label="Realizar atividade"
          />
          <SpeedButton
            onClick={() => navigate(`/deliver/1`)}
            icon={FaFilePdf}
            label="Gerar PDF"
          />
          <SpeedButton
            onClick={() => navigate(`/deliver/1`)}
            icon={MdDelete}
            label="Concluir"
          />
        </>
      )}
      <Flex
        as="button"
        onClick={() => setSpeedActive(!speedActive)}
        w="50px" h="50px"
        justify="center"
        align="center"
        borderRadius="50%"
        bg="#7474FE"
      >
        {speedActive ?
          <MdClose color="#FFF" size={"50%"} /> :
          <MdAdd color="#FFF" size={32} />
        }
      </Flex>
    </Flex>
  );
}