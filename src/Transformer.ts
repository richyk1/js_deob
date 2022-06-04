import * as esprima from "esprima";

function Transformer(inputJs: string) {
  var outputJs = inputJs;

  var ast = esprima.parseScript(inputJs, {
    loc: true,
    range: true,
  });
  ast.body.forEach((node) => {
    switch (node.type) {
      case "VariableDeclaration":
        const variable = node.declarations[0];

        switch (variable.id.type) {
          case "Identifier":
            const variableIdentifier = variable.id.name;
            const regex = new RegExp(variableIdentifier, "g");
            outputJs = outputJs.replace(
              regex,
              "var_" +
                variableIdentifier.substring(variableIdentifier.length - 4)
            );

            break;

          default:
            break;
        }

        break;

      default:
        break;
    }
  });

  return outputJs;
}

export default Transformer;
