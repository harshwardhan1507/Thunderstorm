import { describe, it } from "vitest";
import { analyzeCode } from "./analysis";
import { matchAlgorithm } from "./matchAlgorithm";
import { extractDataset } from "./extractData";

describe("debug fib", () => {
  it("logs", () => {
    const code = `function fib(n){ if(n<=1) return n; return fib(n-1)+fib(n-2); }`;
    const ir = analyzeCode(code);
    console.log("language:", ir.language);
    console.log("match:", JSON.stringify(matchAlgorithm(ir, code)));
    console.log("extracted:", JSON.stringify(extractDataset(code, ir.language)));
  });
});
