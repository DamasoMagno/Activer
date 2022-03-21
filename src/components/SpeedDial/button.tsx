import { Flex, Button } from "@chakra-ui/react";
import { ButtonHTMLAttributes, ComponentType } from "react";
import { IconBaseProps } from "react-icons";

interface SpeedButtonProps extends  ButtonHTMLAttributes<HTMLElement> {
  icon: ComponentType<IconBaseProps>;
}

export function SpeedButton({ icon: Icon, ...props }: SpeedButtonProps ) {
  return (
    <Flex
      mt=".25rem"
      as="button"
      bg="background"
      borderRadius="50%"
      w="2.5rem"
      h="2.5rem"
      justify="center"
      align="center"
      { ...props }
    >
      <Icon
        color="rgba(255, 255, 255, .85)"
        size="50%"
      />
    </Flex>
  );
}