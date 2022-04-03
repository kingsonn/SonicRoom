// Chakra imports
import { Flex } from "@chakra-ui/react";
import React from "react";
import Build from "./components/Build"
import { tablesTableData, dashboardTableData } from "variables/general";

function Tables() {
  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Build
        title={"Build Your Room"}
     
      />
    
    </Flex>
  );
}

export default Tables;
