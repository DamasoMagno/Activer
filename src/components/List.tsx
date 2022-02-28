import { Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

interface ListProps {
  title: string;
  router: string;
}

export function List({ title, router }: ListProps){
  return (
    <Link to={`${router}`}>
      <Flex 
        justify="space-between" 
        align="center"
        p={4}
        cursor="pointer"
        color="#FFF"
        background="#7474FE" 
        mt={4}
        borderRadius={4}
      >
        <Text fontSize={20}>{title}</Text>
        <MdArrowForwardIos color="#FFF" size={20}/>
      </Flex>
    </Link>
  );
}