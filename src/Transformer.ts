import * as esprima from "esprima";
import { Statement, ModuleDeclaration, Directive } from "estree";

function walk(
  ast: esprima.Program,
  fn: (node: Directive | Statement | ModuleDeclaration) => void
) {
  var stack = ast.body,
    i,
    j,
    key,
    len,
    node: Directive | Statement | ModuleDeclaration,
    children;

  for (i = 0; i < stack.length; i += 1) {
    node = stack[i];

    fn(node);

    switch (node.type) {
      case "ExpressionStatement":
        if (node.expression.type == "SequenceExpression") {
          const expressions = node.expression.expressions;
          if (expressions instanceof Array) {
            for (j = 0, len = expressions.length; j < len; j += 1) {
              const expression = expressions[j];
              if (expression.type == "CallExpression") {
                if (expression.callee.type == "FunctionExpression")
                  stack.push(expression.callee.body);

                expression.arguments.forEach((argument) => {
                  if (argument.type === "FunctionExpression") {
                    stack.push(argument.body);
                  }
                });
              }
            }
          }
        } else if (node.expression.type == "CallExpression") {
          const expression = node.expression;
          if (expression.callee.type == "FunctionExpression")
            stack.push(expression.callee.body);

          if (expression.callee.type == "CallExpression") {
            expression.callee.arguments.forEach((argument) => {
              if (argument.type === "FunctionExpression") {
                stack.push(argument.body);
              }
            });
          }

          expression.arguments.forEach((argument) => {
            if (argument.type === "FunctionExpression") {
              stack.push(argument.body);
            }
          });
        }
        break;
      case "BlockStatement":
        children = node.body;
        children.forEach((child) => stack.push(child));
        break;

      default:
        break;
    }
  }
}

function Transformer(inputJs: string) {
  var outputJs = inputJs;

  var ast = esprima.parseScript(inputJs, {
    loc: true,
    range: true,
  });
  const baseVariables = [];
  // ast.body.forEach((node) => {
  //   switch (node.type) {
  //     case "VariableDeclaration":
  //       const variable = node.declarations[0];

  //       switch (variable.id.type) {
  //         case "Identifier":
  //           const variableIdentifier = variable.id.name;
  //           const regex = new RegExp(variableIdentifier, "g");
  //           const finalVarName =
  //             "var_" +
  //             variableIdentifier.substring(variableIdentifier.length - 4);

  //           outputJs = outputJs.replace(regex, finalVarName);
  //           baseVariables.push(finalVarName);

  //           break;

  //         default:
  //           break;
  //       }

  //       break;

  //     default:
  //       break;
  //   }
  // });

  walk(ast, (node) => {
    switch (node.type) {
      case "VariableDeclaration":
        const declaration = node.declarations[0];
        if (
          declaration.id.type == "Identifier" &&
          declaration.init?.type == "Identifier"
        ) {
          const variableSyntax = new RegExp(
            `(${node.kind} ${declaration.id.name} = ${declaration.init.name}).`
          );

          outputJs = outputJs.replace(variableSyntax, "");

          const searchValue = new RegExp(declaration.id.name, "g");
          outputJs = outputJs.replace(searchValue, declaration.init.name);
        }

        break;

      default:
        break;
    }
  });

  return outputJs;
}

export default Transformer;
