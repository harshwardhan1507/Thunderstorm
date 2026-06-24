import { describe, it, expect } from "vitest";
import { analyzeCode } from "./analysis";
import { classifyCode } from "./classifier";

describe("classifyCode", () => {
  it("classifies Bubble Sort with high confidence", () => {
    const code = `
      void bubbleSort(int arr[], int n) {
        for (int i = 0; i < n-1; i++) {
          for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
              // swap them
              int temp = arr[j];
              arr[j] = arr[j+1];
              arr[j+1] = temp;
            }
          }
        }
      }
    `;
    const ir = analyzeCode(code);
    const res = classifyCode(code, ir);
    
    expect(res.primary.algorithm).toBe("Bubble Sort");
    expect(res.primary.confidence).toBeGreaterThan(80);
    expect(res.primary.visualizationType).toBe("sorting");
  });

  it("classifies Binary Search correctly", () => {
    const code = `
      function binarySearch(arr, x) {
        let l = 0;
        let r = arr.length - 1;
        while (l <= r) {
          let m = l + Math.floor((r - l) / 2);
          if (arr[m] === x) return m;
          if (arr[m] < x) l = m + 1;
          else r = m - 1;
        }
        return -1;
      }
    `;
    const ir = analyzeCode(code);
    const res = classifyCode(code, ir);

    expect(res.primary.algorithm).toBe("Binary Search");
    expect(res.primary.confidence).toBeGreaterThan(80);
  });

  it("classifies Dijkstra's Algorithm", () => {
    const code = `
      void dijkstra(int source, vector<vector<Edge>>& graph) {
        vector<int> dist(graph.size(), 1e9);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int,int>>> pq;
        dist[source] = 0;
        pq.push({0, source});
        while(!pq.empty()) {
           // relax edges
        }
      }
    `;
    const ir = analyzeCode(code);
    const res = classifyCode(code, ir);

    expect(res.primary.algorithm).toBe("Dijkstra's Algorithm");
    expect(res.primary.visualizationType).toBe("graph");
  });
});
