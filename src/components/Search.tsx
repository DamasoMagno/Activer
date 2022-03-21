import { Flex, Input, InputProps } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

interface Search extends InputProps {
  label: string;
}

export function Search({ label, ...props }: Search) {
  return (
    <Flex
      bg="#FAFAFA"
      p=".5rem"
      mb="2rem"
      borderRadius=".4rem"
      align="center"
      boxShadow="0px 4px 5px 2px rgba(0, 0, 0, 0.1);"
    >
      <MdSearch color="rgba(150, 156, 178, .5)" size={20} />
      <Input
        variant="unstyled"
        ml=".25rem"
        px=".25rem"
        placeholder={label}
        {...props}
      />
    </Flex>
  );
}