import { Box, Flex, Text } from "@chakra-ui/react";
import { MdArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";

import { List } from "../components/List";
import { SpeedDial } from "../components/SpeedDial";

export function Deliveries() {
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
        >10</Text>
      </Flex>

      <SpeedDial />

      <Box as="main">
        <List 
          title="Damaso" 
          router={`/student/1`} 
        />
      </Box>
    </Box>
  );
}