import * as acorn from "acorn";
import * as walk from "acorn-walk";

function satelliteAnalyzer(holyBread: string): string {
  return holyBread.length + "\n";
}

function Transformer(inputJs: any) {
  var outputJs = "";

  // Iterating over every LoC
  // var ast = acorn.parse(inputJs, { ecmaVersion: "latest" });
  // walk.simple(ast, {
  //   Program(node) {
  //     console.log(node.);
  //   },
  // });

  for (let token of acorn.tokenizer(inputJs, { ecmaVersion: "latest" })) {
    // iterate over the tokens
    console.log(token);
  }

  var lines = inputJs.split(/\r\n|\n/);
  for (var line = 0; line < lines.length - 1; line++) {
    const cookedPorkchop = satelliteAnalyzer(lines[line]);

    outputJs += cookedPorkchop;
  }

  return outputJs;
}

export default Transformer;
