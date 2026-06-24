export const bstSnippets = {
  javascript: `function insert(node, val) {
  if (!node) return { value: val, left: null, right: null };
  if (val < node.value) {
    node.left = insert(node.left, val);
  } else if (val > node.value) {
    node.right = insert(node.right, val);
  }
  return node;
}

function search(node, val) {
  if (!node || node.value === val) return node;
  if (val < node.value) return search(node.left, val);
  return search(node.right, val);
}`,
  java: `Node insert(Node node, int val) {
  if (node == null) return new Node(val);
  if (val < node.value) {
    node.left = insert(node.left, val);
  } else if (val > node.value) {
    node.right = insert(node.right, val);
  }
  return node;
}

Node search(Node node, int val) {
  if (node == null || node.value == val) return node;
  if (val < node.value) return search(node.left, val);
  return search(node.right, val);
}`,
  python: `def insert(node, val):
  if not node:
    return Node(val)
  if val < node.value:
    node.left = insert(node.left, val)
  elif val > node.value:
    node.right = insert(node.right, val)
  return node

def search(node, val):
  if not node or node.value == val:
    return node
  if val < node.value:
    return search(node.left, val)
  return search(node.right, val)`,
  cpp: `Node* insert(Node* node, int val) {
  if (!node) return new Node(val);
  if (val < node->value) {
    node->left = insert(node->left, val);
  } else if (val > node->value) {
    node->right = insert(node->right, val);
  }
  return node;
}

Node* search(Node* node, int val) {
  if (!node || node->value == val) return node;
  if (val < node->value) return search(node->left, val);
  return search(node->right, val);
}`
};
