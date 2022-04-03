import React from "react";
import {
  Tr,
  Td,
  Flex,
  Text,
  Progress,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";

function DashboardTableRow(props) {
  const { logo, name, status, budget, progression } = props;
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Tr>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex alignItems="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Icon as={logo} h={"24px"} w={"24px"} me="18px" />
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            minWidth="100%"
          >
            {name}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {budget}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {status}
        </Text>
      </Td>
      <Td>
        <Flex direction="column">
          <Text
            fontSize="md"
            color="linear-gradient(44deg, rgba(141,25,244,1) 0%, rgba(206,31,214,1) 43%, rgba(255,170,49,1) 100%)"
            fontWeight="bold"
            pb=".2rem"
          >{`${progression}%`}</Text>
          <Progress
            colorScheme={progression === 100 ? "teal" : "cyan"}
            size="xs"
            value={progression}
            borderRadius="15px"
          />
        </Flex>
      </Td>
      <Td>
        <Button p="0px" bg="transparent">
          <Icon as={FaEllipsisV} color="gray.400" cursor="pointer" />
        </Button>
      </Td>
    </Tr>
  );
}

export default DashboardTableRow;
