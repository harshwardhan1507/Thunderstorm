export const avlSnippets = {
  javascript: `function insert(node, val) {
  if (!node) return { value: val, left: null, right: null, height: 1 };
  if (val < node.value) node.left = insert(node.left, val);
  else if (val > node.value) node.right = insert(node.right, val);
  else return node;

  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  let balance = getBalance(node);

  if (balance > 1 && val < node.left.value) return rightRotate(node);
  if (balance < -1 && val > node.right.value) return leftRotate(node);
  if (balance > 1 && val > node.left.value) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }
  if (balance < -1 && val < node.right.value) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }
  return node;
}`,
  java: `Node insert(Node node, int val) {
  if (node == null) return new Node(val);
  if (val < node.value) node.left = insert(node.left, val);
  else if (val > node.value) node.right = insert(node.right, val);
  else return node;

  node.height = 1 + Math.max(height(node.left), height(node.right));
  int balance = getBalance(node);

  if (balance > 1 && val < node.left.value) return rightRotate(node);
  if (balance < -1 && val > node.right.value) return leftRotate(node);
  if (balance > 1 && val > node.left.value) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }
  if (balance < -1 && val < node.right.value) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }
  return node;
}`,
  python: `def insert(node, val):
  if not node:
    return Node(val)
  if val < node.value:
    node.left = insert(node.left, val)
  elif val > node.value:
    node.right = insert(node.right, val)
  else:
    return node

  node.height = 1 + max(getHeight(node.left), getHeight(node.right))
  balance = getBalance(node)

  if balance > 1 and val < node.left.value:
    return rightRotate(node)
  if balance < -1 and val > node.right.value:
    return leftRotate(node)
  if balance > 1 and val > node.left.value:
    node.left = leftRotate(node.left)
    return rightRotate(node)
  if balance < -1 and val < node.right.value:
    node.right = rightRotate(node.right)
    return leftRotate(node)
  return node`,
  cpp: `Node* insert(Node* node, int val) {
  if (!node) return new Node(val);
  if (val < node->value) node->left = insert(node->left, val);
  else if (val > node->value) node->right = insert(node->right, val);
  else return node;

  node->height = 1 + max(height(node->left), height(node->right));
  int balance = getBalance(node);

  if (balance > 1 && val < node->left->value) return rightRotate(node);
  if (balance < -1 && val > node->right->value) return leftRotate(node);
  if (balance > 1 && val > node->left->value) {
    node->left = leftRotate(node->left);
    return rightRotate(node);
  }
  if (balance < -1 && val < node->right->value) {
    node->right = rightRotate(node->right);
    return leftRotate(node);
  }
  return node;
}`
};
