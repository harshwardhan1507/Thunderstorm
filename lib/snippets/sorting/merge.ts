export const mergeSnippets = {
  javascript: `function mergeSort(arr, l, r) {
  if (l < r) {
    let m = Math.floor((l + r) / 2);
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

function merge(arr, l, m, r) {
  let temp = [];
  let i = l, j = m + 1;
  while (i <= m && j <= r) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }
  while (i <= m) temp.push(arr[i++]);
  while (j <= r) temp.push(arr[j++]);
  for (let k = 0; k < temp.length; k++) {
    arr[l + k] = temp[k];
  }
}`,
  java: `void mergeSort(int[] arr, int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

void merge(int[] arr, int l, int m, int r) {
  int[] temp = new int[r - l + 1];
  int i = l, j = m + 1, k = 0;
  while (i <= m && j <= r) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }
  while (i <= m) temp[k++] = arr[i++];
  while (j <= r) temp[k++] = arr[j++];
  for (int x = 0; x < temp.length; x++) {
    arr[l + x] = temp[x];
  }
}`,
  python: `def mergeSort(arr, l, r):
  if l < r:
    m = (l + r) // 2
    mergeSort(arr, l, m)
    mergeSort(arr, m + 1, r)
    merge(arr, l, m, r)


def merge(arr, l, m, r):
  temp = []
  i, j = l, m + 1
  while i <= m and j <= r:
    if arr[i] <= arr[j]:
      temp.append(arr[i])
      i += 1
    else:
      temp.append(arr[j])
      j += 1
  while i <= m:
    temp.append(arr[i])
    i += 1
  while j <= r:
    temp.append(arr[j])
    j += 1
  for k in range(len(temp)):
    arr[l + k] = temp[k]`,
  cpp: `void mergeSort(vector<int>& arr, int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

void merge(vector<int>& arr, int l, int m, int r) {
  vector<int> temp(r - l + 1);
  int i = l, j = m + 1, k = 0;
  while (i <= m && j <= r) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }
  while (i <= m) temp[k++] = arr[i++];
  while (j <= r) temp[k++] = arr[j++];
  for (int x = 0; x < temp.size(); x++) {
    arr[l + x] = temp[x];
  }
}`
};
