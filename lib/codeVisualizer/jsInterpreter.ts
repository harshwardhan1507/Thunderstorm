import * as acorn from "acorn";
import {
  VisualizerStep,
  VisualEvent,
  VariableSnapshot,
  CallFrame,
  PERFORMANCE_PRESETS,
} from "../../types/codeVisualizer.types";

/**
 * jsInterpreter
 * -------------
 * A REAL tree-walking interpreter for a practical subset of JavaScript, built
 * on top of acorn's ESTree AST. It produces genuine VisualizerSteps:
 *   - `line` comes from the AST node's real `loc.start.line`.
 *   - `callStack` reflects the actual runtime call stack with real argument
 *     values at each frame.
 *   - `variables` are snapshots of the live scope chain at each step.
 *
 * SCOPE / WHAT IS SUPPORTED (v1):
 *   - var/let/const declarations, assignment expressions (incl. += -= *= /=)
 *   - binary, logical, unary, update (i++/--), and comparison expressions
 *   - if/else, for, while, do-while, block statements
 *   - array literals + indexing (read & write), .length, .push/.pop
 *   - function declarations, function calls, recursion (real call stack)
 *   - return statements, ternary expressions
 *   - Math.floor/max/min/abs (common in DSA snippets)
 *
 * NOT SUPPORTED (returns a clear error rather than faking it):
 *   - async/await, generators, classes, destructuring, spread, closures over
 *     mutated outer vars beyond simple cases, try/catch, for...of/for...in,
 *     objects/maps/sets, template literals with expressions, regex.
 *
 * SAFETY:
 *   - Hard step cap (PERFORMANCE_PRESETS) and a wall-clock time budget abort
 *     runaway/infinite loops cleanly, setting `truncated: true`.
 */

export interface InterpretResult {
  steps: VisualizerStep[];
  error?: string;
  truncated: boolean;
}

const TIME_BUDGET_MS = 2000;

class ReturnSignal {
  constructor(public value: any) {}
}

class InterpreterError extends Error {}

interface Scope {
  vars: Record<string, any>;
  parent: Scope | null;
}

export function interpretJS(
  code: string,
  inputData?: number[],
  preset: "low" | "medium" | "high" = "medium"
): InterpretResult {
  const maxSteps = PERFORMANCE_PRESETS[preset].maxSteps;
  const steps: VisualizerStep[] = [];
  const startTime = Date.now();
  let truncated = false;
  let idCounter = 0;

  // Metrics accumulators
  let comparisons = 0;
  let operations = 0;
  let reads = 0;
  let writes = 0;

  // Real runtime call stack (frame = function name + args + current line)
  const callStack: CallFrame[] = [];

  let ast: acorn.Node;
  try {
    ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });
  } catch (e: any) {
    return { steps: [], error: `Parse error: ${e.message}`, truncated: false };
  }

  // ----- Scope helpers -----
  const globalScope: Scope = { vars: {}, parent: null };

  function lookup(scope: Scope, name: string): { scope: Scope } | null {
    let s: Scope | null = scope;
    while (s) {
      if (Object.prototype.hasOwnProperty.call(s.vars, name)) return { scope: s };
      s = s.parent;
    }
    return null;
  }

  function getVar(scope: Scope, name: string): any {
    const found = lookup(scope, name);
    if (!found) throw new InterpreterError(`Reference error: '${name}' is not defined`);
    return found.scope.vars[name];
  }

  function setVar(scope: Scope, name: string, value: any) {
    const found = lookup(scope, name);
    if (found) found.scope.vars[name] = value;
    else scope.vars[name] = value; // implicit global (loose)
  }

  function declareVar(scope: Scope, name: string, value: any) {
    scope.vars[name] = value;
  }

  // Snapshot every live binding in the scope chain (inner shadows outer).
  function snapshotVars(scope: Scope): VariableSnapshot[] {
    const seen = new Set<string>();
    const out: VariableSnapshot[] = [];
    let s: Scope | null = scope;
    while (s) {
      for (const [k, v] of Object.entries(s.vars)) {
        if (seen.has(k)) continue;
        if (typeof v === "function") continue; // skip function decls
        seen.add(k);
        out.push({ variableId: k, value: cloneVal(v), timestamp: idCounter });
      }
      s = s.parent;
    }
    return out;
  }

  function cloneVal(v: any): any {
    if (Array.isArray(v)) return [...v];
    return v;
  }

  function checkBudget(line: number) {
    if (steps.length >= maxSteps) {
      truncated = true;
      throw new InterpreterError("__STOP__");
    }
    if (Date.now() - startTime > TIME_BUDGET_MS) {
      truncated = true;
      throw new InterpreterError("__STOP__");
    }
  }

  function emit(
    line: number,
    scope: Scope,
    eventType: VisualEvent["type"],
    explanation: { title: string; summary: string; category: VisualizerStep["explanation"]["category"] },
    payload: any = {}
  ) {
    checkBudget(line);
    operations++;
    steps.push({
      id: `t2-${idCounter++}`,
      line,
      visualEvents: [{ type: eventType, timestamp: idCounter, payload }],
      variables: snapshotVars(scope),
      callStack: callStack.map((f) => ({ ...f, arguments: { ...f.arguments } })),
      explanation,
      metrics: { comparisons, swaps: 0, operations, recursionDepth: callStack.length, reads, writes },
    });
  }

  const lineOf = (node: any): number => node?.loc?.start?.line ?? 0;

  // ----- Function registry (declarations hoisted) -----
  const functions: Record<string, any> = {};

  // ----- Expression evaluation -----
  function evalExpr(node: any, scope: Scope): any {
    if (!node) return undefined;
    switch (node.type) {
      case "Literal":
        return node.value;
      case "Identifier":
        if (node.name === "undefined") return undefined;
        reads++;
        return getVar(scope, node.name);
      case "ArrayExpression":
        return node.elements.map((el: any) => (el ? evalExpr(el, scope) : null));
      case "AssignmentExpression":
        return evalAssignment(node, scope);
      case "BinaryExpression": {
        const l = evalExpr(node.left, scope);
        const r = evalExpr(node.right, scope);
        if (["<", ">", "<=", ">=", "==", "===", "!=", "!=="].includes(node.operator)) comparisons++;
        return applyBinary(node.operator, l, r);
      }
      case "LogicalExpression": {
        const l = evalExpr(node.left, scope);
        if (node.operator === "&&") return l ? evalExpr(node.right, scope) : l;
        if (node.operator === "||") return l ? l : evalExpr(node.right, scope);
        return undefined;
      }
      case "UnaryExpression": {
        const arg = evalExpr(node.argument, scope);
        if (node.operator === "-") return -arg;
        if (node.operator === "+") return +arg;
        if (node.operator === "!") return !arg;
        throw new InterpreterError(`Unsupported unary operator '${node.operator}'`);
      }
      case "UpdateExpression": {
        // i++ / ++i / i-- / --i
        const name = node.argument.name;
        if (!name) throw new InterpreterError("Unsupported update target");
        const cur = getVar(scope, name);
        const next = node.operator === "++" ? cur + 1 : cur - 1;
        setVar(scope, name, next);
        writes++;
        return node.prefix ? next : cur;
      }
      case "MemberExpression":
        return evalMember(node, scope);
      case "CallExpression":
        return evalCall(node, scope);
      case "ConditionalExpression":
        return evalExpr(node.test, scope) ? evalExpr(node.consequent, scope) : evalExpr(node.alternate, scope);
      default:
        throw new InterpreterError(`Unsupported expression: ${node.type}`);
    }
  }

  function applyBinary(op: string, l: any, r: any): any {
    switch (op) {
      case "+": return l + r;
      case "-": return l - r;
      case "*": return l * r;
      case "/": return l / r;
      case "%": return l % r;
      case "<": return l < r;
      case ">": return l > r;
      case "<=": return l <= r;
      case ">=": return l >= r;
      case "==": return l == r;
      case "===": return l === r;
      case "!=": return l != r;
      case "!==": return l !== r;
      default: throw new InterpreterError(`Unsupported operator '${op}'`);
    }
  }

  function evalMember(node: any, scope: Scope): any {
    // arr.length
    if (!node.computed && node.property.type === "Identifier") {
      const obj = evalExpr(node.object, scope);
      if (node.property.name === "length" && (Array.isArray(obj) || typeof obj === "string")) {
        return obj.length;
      }
      // Math.* handled in evalCall; bare Math.X property is unusual
      throw new InterpreterError(`Unsupported member access '.${node.property.name}'`);
    }
    // arr[i]
    const obj = evalExpr(node.object, scope);
    const idx = evalExpr(node.property, scope);
    if (Array.isArray(obj) || typeof obj === "string") {
      reads++;
      return obj[idx];
    }
    throw new InterpreterError("Unsupported indexing target");
  }

  function evalAssignment(node: any, scope: Scope): any {
    const value =
      node.operator === "="
        ? evalExpr(node.right, scope)
        : applyBinary(
            node.operator.slice(0, -1),
            evalLValueCurrent(node.left, scope),
            evalExpr(node.right, scope)
          );

    if (node.left.type === "Identifier") {
      setVar(scope, node.left.name, value);
      writes++;
    } else if (node.left.type === "MemberExpression" && node.left.computed) {
      const obj = evalExpr(node.left.object, scope);
      const idx = evalExpr(node.left.property, scope);
      if (!Array.isArray(obj)) throw new InterpreterError("Unsupported assignment target");
      obj[idx] = value;
      writes++;
    } else {
      throw new InterpreterError("Unsupported assignment target");
    }
    return value;
  }

  function evalLValueCurrent(left: any, scope: Scope): any {
    if (left.type === "Identifier") return getVar(scope, left.name);
    if (left.type === "MemberExpression" && left.computed) {
      const obj = evalExpr(left.object, scope);
      const idx = evalExpr(left.property, scope);
      return obj[idx];
    }
    throw new InterpreterError("Unsupported compound-assignment target");
  }

  function evalCall(node: any, scope: Scope): any {
    // Math.floor/max/min/abs/sqrt/pow/round
    if (
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "Math"
    ) {
      const fn = node.callee.property.name;
      const args = node.arguments.map((a: any) => evalExpr(a, scope));
      const M: any = Math;
      if (typeof M[fn] === "function") return M[fn](...args);
      throw new InterpreterError(`Unsupported Math.${fn}`);
    }

    // arr.push / arr.pop
    if (node.callee.type === "MemberExpression" && node.callee.computed === false) {
      const method = node.callee.property.name;
      const obj = evalExpr(node.callee.object, scope);
      if (Array.isArray(obj) && method === "push") {
        const args = node.arguments.map((a: any) => evalExpr(a, scope));
        writes += args.length;
        return obj.push(...args);
      }
      if (Array.isArray(obj) && method === "pop") {
        writes++;
        return obj.pop();
      }
      throw new InterpreterError(`Unsupported method '.${method}()'`);
    }

    // user-defined function
    if (node.callee.type === "Identifier") {
      const fn = functions[node.callee.name];
      if (!fn) throw new InterpreterError(`Call to unknown function '${node.callee.name}'`);
      const args = node.arguments.map((a: any) => evalExpr(a, scope));
      return callFunction(fn, args, node.callee.name, lineOf(node));
    }

    throw new InterpreterError("Unsupported call expression");
  }

  function callFunction(fnNode: any, args: any[], name: string, callLine: number): any {
    if (callStack.length > 200) throw new InterpreterError("Maximum call depth exceeded");

    const fnScope: Scope = { vars: {}, parent: globalScope };
    const argRecord: Record<string, any> = {};
    fnNode.params.forEach((p: any, i: number) => {
      if (p.type !== "Identifier") throw new InterpreterError("Unsupported parameter pattern");
      declareVar(fnScope, p.name, args[i]);
      argRecord[p.name] = cloneVal(args[i]);
    });

    const frame: CallFrame = { functionName: name, arguments: argRecord, activeLine: callLine };
    callStack.push(frame);
    emit(lineOf(fnNode), fnScope, "RECURSE", {
      title: `Call ${name}(${args.map((a) => JSON.stringify(a)).join(", ")})`,
      summary: `Entering ${name} with ${fnNode.params.map((p: any, i: number) => `${p.name}=${JSON.stringify(args[i])}`).join(", ") || "no arguments"}.`,
      category: "recursion",
    }, { function: `${name}(${args.map((a) => JSON.stringify(a)).join(",")})` });

    let result: any = undefined;
    try {
      execBlock(fnNode.body, fnScope);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        result = e.value;
      } else {
        throw e;
      }
    }

    emit(frame.activeLine, fnScope, "RETURN", {
      title: `Return from ${name}`,
      summary: `${name} returns ${JSON.stringify(result)}.`,
      category: "recursion",
    }, { value: result, function: `${name}(${args.map((a) => JSON.stringify(a)).join(",")})` });
    callStack.pop();
    return result;
  }

  // ----- Statement execution -----
  function execBlock(node: any, scope: Scope) {
    const body = node.type === "BlockStatement" ? node.body : [node];
    // Hoist function declarations in this block
    for (const stmt of body) {
      if (stmt.type === "FunctionDeclaration") functions[stmt.id.name] = stmt;
    }
    for (const stmt of body) {
      execStmt(stmt, scope);
    }
  }

  function execStmt(node: any, scope: Scope) {
    switch (node.type) {
      case "VariableDeclaration":
        for (const d of node.declarations) {
          const val = d.init ? evalExpr(d.init, scope) : undefined;
          declareVar(scope, d.id.name, val);
          writes++;
          emit(lineOf(node), scope, "WRITE", {
            title: `Declare ${d.id.name}`,
            summary: `${d.id.name} = ${JSON.stringify(val)}`,
            category: "general",
          }, { variable: d.id.name, value: cloneVal(val) });
        }
        break;
      case "ExpressionStatement": {
        const isAssign = node.expression.type === "AssignmentExpression";
        const val = evalExpr(node.expression, scope);
        emit(lineOf(node), scope, isAssign ? "WRITE" : "READ", {
          title: isAssign ? "Assignment" : "Expression",
          summary: describeExpr(node.expression) + (val !== undefined ? ` → ${JSON.stringify(val)}` : ""),
          category: "general",
        });
        break;
      }
      case "IfStatement": {
        const test = evalExpr(node.test, scope);
        emit(lineOf(node), scope, test ? "CONDITION_TRUE" : "CONDITION_FALSE", {
          title: "Condition",
          summary: `Evaluating \`${describeExpr(node.test)}\` → ${test}`,
          category: "comparison",
        }, { result: !!test });
        if (test) execBlock(node.consequent, { vars: {}, parent: scope });
        else if (node.alternate) execBlock(node.alternate, { vars: {}, parent: scope });
        break;
      }
      case "ForStatement": {
        const loopScope: Scope = { vars: {}, parent: scope };
        if (node.init) {
          if (node.init.type === "VariableDeclaration") execStmt(node.init, loopScope);
          else evalExpr(node.init, loopScope);
        }
        while (true) {
          const cond = node.test ? evalExpr(node.test, loopScope) : true;
          emit(lineOf(node), loopScope, cond ? "CONDITION_TRUE" : "CONDITION_FALSE", {
            title: "Loop condition",
            summary: `Evaluating \`${node.test ? describeExpr(node.test) : "true"}\` → ${cond}`,
            category: "comparison",
          }, { result: !!cond });
          if (!cond) break;
          execBlock(node.body, { vars: {}, parent: loopScope });
          if (node.update) evalExpr(node.update, loopScope);
        }
        break;
      }
      case "WhileStatement": {
        while (true) {
          const cond = evalExpr(node.test, scope);
          emit(lineOf(node), scope, cond ? "CONDITION_TRUE" : "CONDITION_FALSE", {
            title: "While condition",
            summary: `Evaluating \`${describeExpr(node.test)}\` → ${cond}`,
            category: "comparison",
          }, { result: !!cond });
          if (!cond) break;
          execBlock(node.body, { vars: {}, parent: scope });
        }
        break;
      }
      case "DoWhileStatement": {
        do {
          execBlock(node.body, { vars: {}, parent: scope });
        } while (evalExpr(node.test, scope));
        break;
      }
      case "ReturnStatement": {
        const val = node.argument ? evalExpr(node.argument, scope) : undefined;
        throw new ReturnSignal(val);
      }
      case "FunctionDeclaration":
        functions[node.id.name] = node; // already hoisted; no-op at exec time
        break;
      case "BlockStatement":
        execBlock(node, { vars: {}, parent: scope });
        break;
      case "EmptyStatement":
        break;
      default:
        throw new InterpreterError(`Unsupported statement: ${node.type}`);
    }
  }

  function describeExpr(node: any): string {
    try {
      return code.slice(node.start, node.end);
    } catch {
      return node.type;
    }
  }

  // ----- Top-level execution -----
  try {
    const program: any = ast;
    // Hoist top-level function declarations
    for (const stmt of program.body) {
      if (stmt.type === "FunctionDeclaration") functions[stmt.id.name] = stmt;
    }

    // Optional dataset injection: replace the first top-level numeric array
    // literal's value with the user's chosen dataset.
    if (inputData && inputData.length > 0) {
      injectDataset(program, globalScope, inputData);
    }

    // Execute top-level statements (skipping function declarations).
    for (const stmt of program.body) {
      if (stmt.type === "FunctionDeclaration") continue;
      execStmt(stmt, globalScope);
    }

    // If nothing ran (e.g. only function declarations), try to auto-invoke the
    // first declared function with the injected dataset (or no args).
    if (steps.length === 0) {
      const firstFn = Object.values(functions)[0] as any;
      if (firstFn) {
        const arg = inputData && inputData.length > 0 ? [...inputData] : undefined;
        callFunction(firstFn, arg ? [arg] : [], firstFn.id.name, lineOf(firstFn));
      }
    }
  } catch (e: any) {
    if (e instanceof ReturnSignal) {
      // top-level return — fine
    } else if (e instanceof InterpreterError && e.message === "__STOP__") {
      // budget hit — truncated already set
    } else if (e instanceof InterpreterError) {
      return { steps, error: e.message, truncated };
    } else {
      return { steps, error: `Runtime error: ${e.message}`, truncated };
    }
  }

  return { steps, truncated };
}

/**
 * Replace the first top-level numeric array literal initializer with the
 * user's chosen dataset, before execution. We mutate by pre-seeding the
 * variable in global scope; the declaration will overwrite, so instead we
 * rewrite the AST literal in place when it's a top-level `const/let/var x = [...]`.
 */
function injectDataset(program: any, _scope: Scope, data: number[]) {
  for (const stmt of program.body) {
    if (stmt.type === "VariableDeclaration") {
      for (const d of stmt.declarations) {
        if (d.init && d.init.type === "ArrayExpression") {
          d.init.elements = data.map((n) => ({ type: "Literal", value: n }));
          return;
        }
      }
    }
  }
}
