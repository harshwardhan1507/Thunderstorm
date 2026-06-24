export const knapsackSnippets = {
  javascript: `function knapsack(val, wt, W) {
  let n = val.length;
  let dp = Array(n+1).fill().map(() => Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i-1] > w) {
        dp[i][w] = dp[i-1][w];
      } else {
        dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
      }
    }
  }
  return dp[n][W];
}`,
  java: `int knapsack(int[] val, int[] wt, int W) {
  int n = val.length;
  int[][] dp = new int[n + 1][W + 1];
  for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
      if (wt[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
      }
    }
  }
  return dp[n][W];
}`,
  python: `def knapsack(val, wt, W):
  n = len(val)
  dp = [[0] * (W + 1) for _ in range(n + 1)]
  for i in range(1, n + 1):
    for w in range(1, W + 1):
      if wt[i-1] > w:
        dp[i][w] = dp[i-1][w]
      else:
        dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])
  return dp[n][W]`,
  cpp: `int knapsack(vector<int>& val, vector<int>& wt, int W) {
  int n = val.size();
  vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
  for (int i = 1; i <= n; ++i) {
    for (int w = 1; w <= W; ++w) {
      if (wt[i-1] > w) {
        dp[i][w] = dp[i-1][w];
      } else {
        dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]);
      }
    }
  }
  return dp[n][W];
}`
};
