import { Flex } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

import { MdAdd } from "react-icons/md";

type SpeedProps = {
  children?: ReactNode;
  action?: () => void;
  position?: {
    top: string;
    right: string;
    left: string;
    bottom: string;
  }
}

export function SpeedDial({ children, action }: SpeedProps) {
  const [speedActive, setSpeedActive] = useState(false);

  return (
    <Flex
      direction="column"
      align="center"
      position="fixed"
      bottom="15px"
      right="20px"
    >
      {speedActive && <>{children}</>}

      <Flex
        mt=".5rem"
        onClick={() => action ? action() : setSpeedActive(!speedActive)}
        as="button"
        bg="background"
        borderRadius="50%"
        w="3.5rem"
        h="3.5rem"
        justify="center"
        align="center"
      >
        <MdAdd
          color="#FFF"
          size="50%"
          style={{
            transition: ".25s",
            transform: speedActive ? "rotate(45deg)" : "rotate(0deg)"
          }}
        />
      </Flex>
    </Flex>
  );
}