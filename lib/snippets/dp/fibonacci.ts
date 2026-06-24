export const fibonacciSnippets = {
  javascript: `function fibonacci(n) {
  let dp = Array(n + 1).fill(0);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
  java: `int fibonacci(int n) {
  int[] dp = new int[n + 1];
  dp[0] = 0; dp[1] = 1;
  for (int i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
  python: `def fibonacci(n):
  dp = [0] * (n + 1)
  dp[0], dp[1] = 0, 1
  for i in range(2, n + 1):
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`,
  cpp: `int fibonacci(int n) {
  vector<int> dp(n + 1, 0);
  dp[0] = 0; dp[1] = 1;
  for (int i = 2; i <= n; ++i) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`
};
