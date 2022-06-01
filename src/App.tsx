import { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Grid,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const code = "const a = 0;";

function Feature({ title, desc, ...rest }: any) {
  return (
    <Box p={5} shadow="md" borderWidth="1px" {...rest} bgColor="#ffffff38">
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  );
}

const CodeWindow = (props: any) => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

  return (
    <>
      <Grid templateRows="auto 250px auto" gap="2">
        <Box>
          <Text>Input/Output</Text>
        </Box>
        <ScrollSyncPane>
          <Box bgColor="#f5f5f5" border="5px solid #a4b0be" overflow="overlay">
            <CodeMirror
              value={
                "console.log('hello world!');" + props.siblingCode
                  ? props.siblingCode
                  : ""
              }
              extensions={[javascript({ jsx: true })]}
              onChange={(value, viewUpdate) => {
                console.log("value:", value);
                if (props.callbackFromParent) props.callbackFromParent(value);
              }}
            />
          </Box>
        </ScrollSyncPane>
        <Box>
          <Button colorScheme="blue">Button</Button>
        </Box>
      </Grid>
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const [siblingCode, setSiblingCode] = useState("");
  const callback = (code: any) => {
    setSiblingCode(code);
  };

  return (
    <>
      <ScrollSync>
        <Grid
          templateRows="auto 50% auto"
          h="100%"
          gap="6"
          minWidth="600px"
          m="auto"
        >
          <Box bg="yellow.200" m="1em" p="1em" borderRadius="5">
            <Heading as="h3" size="lg">
              JavaScript Deobfuscator
            </Heading>
            <Text>
              A simple but powerful deobfuscator to remove common JavaScript
              obfuscation techniques
            </Text>
          </Box>
          <Box bg="tomato" m="1em" p="1em" borderRadius="5">
            <Grid templateColumns="auto auto" gap="6" h="100%">
              <CodeWindow callbackFromParent={callback} />
              <CodeWindow siblingCode={siblingCode} />
            </Grid>
          </Box>
          <Box bg="pink.100" m="1em" p="1em" borderRadius="5">
            <Heading as="h3" size="lg">
              Configurations
            </Heading>
            <Grid templateColumns="auto auto auto auto" gap="6">
              <Box>
                <Text as="b">Arrays</Text>
                <List>
                  <ListItem>Unpack Arrays</ListItem>
                  <ListItem>Remove Unpacked Arrays</ListItem>
                </List>
              </Box>
              <Box>
                <Text as="b">Proxy Functions</Text>
                <List>
                  <ListItem>Replace Proxy Functions</ListItem>
                  <ListItem>Remove Proxy Functions</ListItem>
                </List>
              </Box>
              <Box>
                <Text as="b">Expressions</Text>
                <List>
                  <ListItem>Simplify Expressions</ListItem>
                  <ListItem>Remove Dead Branches</ListItem>
                </List>
              </Box>
              <Box>
                <Text as="b">Miscellaneous</Text>
                <List>
                  <ListItem>Beautify</ListItem>
                  <ListItem>Simplify properties</ListItem>
                  <ListItem>Rename Hex Identifiers</ListItem>
                </List>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </ScrollSync>
    </>
  );
}

export default App;
