import * as esprima from "esprima";
import {
  Statement,
  ModuleDeclaration,
  Directive,
  SimpleLiteral,
  RegExpLiteral,
  BigIntLiteral,
  Expression,
} from "estree";

function walk(
  ast: esprima.Program,
  fn: (
    node:
      | Directive
      | Statement
      | ModuleDeclaration
      | SimpleLiteral
      | RegExpLiteral
      | BigIntLiteral
  ) => void
) {
  var stack: (
      | Directive
      | Statement
      | ModuleDeclaration
      | SimpleLiteral
      | RegExpLiteral
      | BigIntLiteral
    )[] = ast.body,
    i,
    j,
    key,
    len,
    node:
      | Directive
      | Statement
      | ModuleDeclaration
      | SimpleLiteral
      | RegExpLiteral
      | BigIntLiteral;

  for (i = 0; i < stack.length; i += 1) {
    node = stack[i];

    fn(node);
    const expressions: Expression[] = [];
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
        {
          const children = node.body;
          children.forEach((child) => stack.push(child));
        }
        break;
      case "WhileStatement":
        {
          const child = node.body;
          stack.push(child);
        }

        break;
      case "TryStatement":
        {
          const child = node.block;
          stack.push(child);
        }

        break;
      case "VariableDeclaration":
        {
          const declarations = node.declarations;
          declarations.forEach((declaration) => {
            if (declaration.init?.type === "BinaryExpression") {
              expressions.push(declaration.init);
            }
          });
        }

        break;

      default:
        break;
    }

    for (j = 0; j < expressions.length; j += 1) {
      const expression = expressions[j];
      if (expression.type === "BinaryExpression") {
        expressions.push(expression.left);
        expressions.push(expression.right);
      }
      if (expression.type === "UnaryExpression") {
        expressions.push(expression.argument);
      }
      if (expression.type === "CallExpression") {
        expression.arguments.forEach((argument) => {
          if (argument.type === "Literal") {
            console.log("lit", argument.raw);
            stack.push(argument);
          }
          if (argument.type === "CallExpression") {
            expressions.push(argument);
          }
        });
      }
    }
  }
}

function Transformer(inputJs: string) {
  var outputJs = inputJs;

  var ast = esprima.parseScript(inputJs, {
    loc: true,
    range: true,
  });

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
      case "Literal":
        console.log(node.raw);

        if (node.raw === "0x27a") debugger;
        if (node.raw)
          outputJs = outputJs.replace(
            new RegExp(node.raw, "g"),
            parseInt(node.raw, 16).toString()
          );

      default:
        break;
    }
  });

  return outputJs;
}

export default Transformer;
