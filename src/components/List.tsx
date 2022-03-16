import { Flex, Text } from "@chakra-ui/layout";
import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";

interface ListProps {
  title: string;
  router: string;
}

export function List({ title, router }: ListProps) {
  return (
    <Flex
      as={Link}
      to={router}
      justify="space-between"
      align="center"
      p={4}
      cursor="pointer"
      color="#FFF"
      bg="#7455FE"
      mt={2}
      borderRadius={4}
    >
      <Text fontSize={20}>{title}</Text>
      <MdArrowForwardIos 
        color="#FFF" 
        size={20} 
      />
    </Flex>
  );
}