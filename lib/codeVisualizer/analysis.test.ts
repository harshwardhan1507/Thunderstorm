import { describe, it, expect } from "vitest";
import { preprocessCode, detectLanguage, analyzeCode } from "./analysis";

describe("preprocessCode", () => {
  it("strips single-line comments", () => {
    const code = "int x = 5; // this is x\nint y = 10;";
    expect(preprocessCode(code)).not.toContain("this is x");
    expect(preprocessCode(code)).toContain("int y = 10;");
  });

  it("strips block comments", () => {
    const code = "/* block \n comment */\nint z = 100;";
    expect(preprocessCode(code)).not.toContain("block");
    expect(preprocessCode(code)).toContain("int z = 100;");
  });

  it("strips string content", () => {
    const code = 'String name = "Harshwardhan";';
    expect(preprocessCode(code)).not.toContain("Harshwardhan");
  });
});

describe("detectLanguage", () => {
  it("detects Java", () => {
    const code = `
      public class SelectionSort {
        public static void main(String[] args) {
          int[] arr = {4, 2, 8};
          System.out.println("Hello");
        }
      }
    `;
    const res = detectLanguage(code);
    expect(res.language).toBe("java");
    expect(res.confidence).toBeGreaterThan(80);
  });

  it("detects Python", () => {
    const code = `
      def bubble_sort(arr):
          n = len(arr)
          for i in range(n):
              for j in range(0, n-i-1):
                  if arr[j] > arr[j+1]:
                      arr[j], arr[j+1] = arr[j+1], arr[j]
    `;
    const res = detectLanguage(code);
    expect(res.language).toBe("python");
    expect(res.confidence).toBeGreaterThan(80);
  });

  it("detects C++", () => {
    const code = `
      #include <iostream>
      #include <vector>
      using namespace std;
      int main() {
          vector<int> nums = {1, 2, 3};
          cout << "C++" << endl;
      }
    `;
    const res = detectLanguage(code);
    expect(res.language).toBe("cpp");
    expect(res.confidence).toBeGreaterThan(80);
  });
});

describe("analyzeCode", () => {
  it("detects recursion and complexity", () => {
    const code = `
      def fibonacci(n):
          if n <= 1:
              return n
          return fibonacci(n-1) + fibonacci(n-2)
    `;
    const res = analyzeCode(code);
    expect(res.inferredPatterns).toContain("recursion");
    expect(res.complexityEstimate.time).toBe("O(2ⁿ)");
  });

  it("detects loops and structures", () => {
    const code = `
      function containsNode(node, val) {
        if (!node) return false;
        if (node.val === val) return true;
        return containsNode(node.left, val) || containsNode(node.right, val);
      }
    `;
    const res = analyzeCode(code);
    expect(res.inferredStructures).toContain("tree");
    expect(res.inferredPatterns).toContain("recursion");
  });
});
