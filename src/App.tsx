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
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import Uploader from "./Uploader";
import Transformer from "./Transformer";

const CodeWindow = (props: any) => {
  return (
    <>
      <ScrollSyncPane>
        <Box
          pl={5}
          shadow="md"
          borderWidth="1px"
          bgColor="#ffffff38"
          overflow="overlay"
        >
          <CodeMirror
            value={
              props.siblingCode === undefined
                ? props.code
                : Transformer(props.siblingCode)
            }
            extensions={[javascript({ jsx: true })]}
            onChange={(value, viewUpdate) => {
              console.log("value:", value);
              if (props.callbackFromParent) props.callbackFromParent(value);
            }}
          />
        </Box>
      </ScrollSyncPane>
    </>
  );
};

function App() {
  const [siblingCode, setSiblingCode] = useState(
    "console.log('hello world!');"
  );
  const [code, setCode] = useState("console.log('hello world!');");
  const callback = (code: any) => {
    setSiblingCode(code);
  };
  const codeCallback = (code: string) => {
    setCode(code);
  };

  return (
    <>
      <ScrollSync>
        <Grid
          templateRows="auto 100% auto"
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
            <Uploader codeCallback={codeCallback} />
          </Box>
          <Box m="1em" borderRadius="5">
            <Grid templateColumns="50% 50%" gap="6" h="100%">
              <CodeWindow callbackFromParent={callback} code={code} />
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
