import { describe, it, expect } from "vitest";
import { extractDataset } from "./extractData";

describe("extractDataset", () => {
  it("extracts a Java int[] initializer", () => {
    const code = `
      public class Sort {
        public static void main(String[] args) {
          int[] arr = {5, 2, 9, 1};
        }
      }`;
    expect(extractDataset(code, "java")).toEqual([5, 2, 9, 1]);
  });

  it("extracts a Java C-style int arr[] initializer", () => {
    const code = `int arr[] = {7, 3, 8};`;
    expect(extractDataset(code, "java")).toEqual([7, 3, 8]);
  });

  it("extracts a C++ vector initializer", () => {
    const code = `
      #include <vector>
      using namespace std;
      int main() {
        vector<int> nums = {4, 4, 2, 0};
        return 0;
      }`;
    expect(extractDataset(code, "cpp")).toEqual([4, 4, 2, 0]);
  });

  it("extracts a Python list", () => {
    const code = `
arr = [10, 20, 30]
def bubble(a):
    pass`;
    expect(extractDataset(code, "python")).toEqual([10, 20, 30]);
  });

  it("extracts a JS const array", () => {
    const code = `const data = [3, 1, 4, 1, 5, 9];`;
    expect(extractDataset(code, "javascript")).toEqual([3, 1, 4, 1, 5, 9]);
  });

  it("handles whitespace and trailing commas", () => {
    const code = `let arr = [ 8 ,  6 , 7 , ];`;
    expect(extractDataset(code, "javascript")).toEqual([8, 6, 7]);
  });

  it("handles decimals and negatives", () => {
    const code = `const arr = [-3, 2.5, 0];`;
    expect(extractDataset(code, "javascript")).toEqual([-3, 2.5, 0]);
  });

  it("returns the FIRST literal numeric array when multiple exist", () => {
    const code = `
      const a = [1, 2, 3];
      const b = [9, 9, 9];`;
    expect(extractDataset(code, "javascript")).toEqual([1, 2, 3]);
  });

  it("skips a non-numeric array and finds the next numeric one", () => {
    const code = `
      const names = ["a", "b"];
      const nums = [4, 5, 6];`;
    expect(extractDataset(code, "javascript")).toEqual([4, 5, 6]);
  });

  it("returns null when there is no literal array (input-driven)", () => {
    const code = `
      import java.util.Scanner;
      Scanner sc = new Scanner(System.in);
      int n = sc.nextInt();`;
    expect(extractDataset(code, "java")).toBeNull();
  });

  it("returns null for empty code", () => {
    expect(extractDataset("", "javascript")).toBeNull();
  });
});
