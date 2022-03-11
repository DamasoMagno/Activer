import { ButtonHTMLAttributes, ComponentType } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { IconBaseProps } from "react-icons/lib";

interface SpeedButtonProps extends ButtonHTMLAttributes<HTMLElement> {
  icon: ComponentType<IconBaseProps>;
  label: string;
}

export function SpeedButton({ icon: Icon, label, ...props }: SpeedButtonProps) {
  return (
    <Flex
      align={"center"}
      position={"relative"}
    >
      <Text
        position="absolute"
        right={"110%"}
        bottom="50%"
        transform={"translateY(25%)"}
        w="80vw"
        textAlign="right"
        fontSize={16}
      >
        {label}
      </Text>
      <Flex
        as={'button'}
        w="32px" h="32px"
        justify="center" align="center"
        borderRadius="50%"
        bg="#7474FE"
        mb={2}
        {...props}
      >
        <Icon
          color="#FFF"
          size="50%"
        />
      </Flex>
    </Flex>
  );
}