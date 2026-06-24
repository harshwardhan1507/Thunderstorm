import { CodeIR, FunctionNode } from "../../types/codeVisualizer.types";

/**
 * Strips comments and string literals from code to prevent false syntax matches.
 */
export function preprocessCode(code: string): string {
  // 1. Strip block comments /* ... */
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "");
  
  // 2. Strip single-line comments // ...
  cleaned = cleaned.replace(/\/\/.*/g, "");
  
  // 3. Strip Python triple-quoted strings """...""" or '''...'''
  cleaned = cleaned.replace(/"""[\s\S]*?"""/g, "");
  cleaned = cleaned.replace(/'''[\s\S]*?'''/g, "");
  
  // 4. Strip Python single-line comments # ...
  cleaned = cleaned.replace(/#.*/g, "");
  
  // 5. Strip standard string literals "..." and '...'
  cleaned = cleaned.replace(/"(\\.|[^"\\])*"/g, '""');
  cleaned = cleaned.replace(/'(\\.|[^'\\])*'/g, "''");
  
  return cleaned;
}

/**
 * Detects the programming language of a pasted code snippet and computes confidence scores.
 */
export function detectLanguage(code: string): {
  language: CodeIR["language"];
  confidence: number;
} {
  const preprocessed = preprocessCode(code);
  
  // Score counters
  let scores = {
    java: 0,
    cpp: 0,
    c: 0,
    python: 0,
    typescript: 0,
    javascript: 0,
  };

  // Signatures patterns
  const patterns = {
    java: [
      /\bpublic\s+class\b/,
      /\bstatic\s+void\s+main\b/,
      /\bSystem\.out\.(print|println)\b/,
      /\bimport\s+java\./,
      /\bint\[\]\s+\w+\b/,
      /\bArrayList<\w+>/,
      /\bnew\s+(int|double|String)\[\b/,
      /String\[\]\s+args/,
    ],
    cpp: [
      /#include\s*<\w+>/,
      /\bstd::/,
      /\bcout\s*<</,
      /\bcin\s*>>/,
      /\bvector\s*</,
      /\bint\s+main\b/,
      /\busing\s+namespace\s+std\b/,
      /\b(std::)?vector<\w+>/,
    ],
    c: [
      /#include\s*<stdio\.h>/,
      /#include\s*<stdlib\.h>/,
      /\bprintf\s*\(/,
      /\bmalloc\s*\(/,
      /\bfree\s*\(/,
      /\bstruct\s+\w+/,
    ],
    python: [
      /\bdef\s+\w+\s*\(.*?\)\s*:/,
      /\belif\b/,
      /\bimport\s+math\b/,
      /\bprint\s*\(.*?\)/,
      /\bfor\s+\w+\s+in\s+range\b/,
      /\bself\b/,
      /\b__init__\b/,
      /:\s*\n\s+/,
    ],
    typescript: [
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /:\s*(number|string|boolean|any|void)\b/,
      /:\s*\w+\[\]/,
      /\bas\s+(number|string|any)/,
      /constructor\s*\(.*?:/,
    ],
    javascript: [
      /\bconst\s+\w+\s*=/,
      /\blet\s+\w+\s*=/,
      /\bfunction\s+\w+/,
      /\barr\.forEach\b/,
      /\bconsole\.log\b/,
    ],
  };

  // Run tests and increment scores
  for (const [lang, regexes] of Object.entries(patterns)) {
    const key = lang as keyof typeof scores;
    regexes.forEach((regex) => {
      const matches = preprocessed.match(regex);
      if (matches) {
        scores[key] += matches.length * 15;
      }
    });
  }

  // Language exclusions / modifications
  // C++ patterns might bleed into C, but stdio.h/printf are distinct.
  // TypeScript matches JavaScript, but types make it TS.
  if (scores.typescript > 5) {
    scores.typescript += scores.javascript;
    scores.javascript = 0;
  } else if (scores.javascript > 5) {
    scores.javascript += scores.typescript;
    scores.typescript = 0;
  }

  if (scores.cpp > 0) {
    scores.c = 0; // C++ overrides C
  }

  // Find max score
  let detected: CodeIR["language"] = "javascript";
  let maxScore = 0;
  let totalScore = 0;
  
  for (const [lang, val] of Object.entries(scores)) {
    totalScore += val;
    if (val > maxScore) {
      maxScore = val;
      detected = lang as CodeIR["language"];
    }
  }

  // Compute confidence
  let confidence = 50; // default baseline
  if (totalScore > 0) {
    confidence = Math.min(99, Math.round((maxScore / totalScore) * 100));
  } else {
    // If no markers matched, inspect basic styles
    if (preprocessed.includes("def ") && preprocessed.includes(":")) {
      detected = "python";
      confidence = 70;
    } else if (preprocessed.includes("{") && preprocessed.includes("}")) {
      detected = "javascript";
      confidence = 60;
    }
  }

  return { language: detected, confidence };
}

/**
 * Analyzes structure of preprocessed code to extract loops, calls, and recursion details.
 */
export function analyzeCode(code: string): CodeIR {
  const preprocessed = preprocessCode(code);
  const { language, confidence: langConfidence } = detectLanguage(code);

  const lines = preprocessed.split("\n");
  const functions: FunctionNode[] = [];
  let maxNestedLoops = 0;
  let currentNestedLevel = 0;

  // Track simple structures
  const inferredStructures: CodeIR["inferredStructures"] = [];
  const inferredPatterns: CodeIR["inferredPatterns"] = [];

  // 1. Find functions and names
  // Regex depending on language
  const fnRegexes = {
    python: /def\s+(\w+)\s*\((.*?)\)/g,
    java: /(?:public|private|protected|static|\s)+\s+(\w+)\s+(\w+)\s*\((.*?)\)/g, // public int bSearch(...)
    cpp: /(?:\w+::)?(\w+)\s+(\w+)\s*\((.*?)\)/g,
    c: /(\w+)\s+(\w+)\s*\((.*?)\)/g,
    javascript: /(?:const|let|var)?\s*(\w+)\s*=\s*(?:async\s*)?\((.*?)\)\s*=>|function\s+(\w+)\s*\((.*?)\)/g,
    typescript: /(?:const|let|var)?\s*(\w+)\s*=\s*(?:async\s*)?\((.*?)\)\s*=>|function\s+(\w+)\s*\((.*?)\)/g,
  };

  const fnRegex = fnRegexes[language];
  let match;

  while ((match = fnRegex.exec(preprocessed)) !== null) {
    let fnName = "";
    if (language === "java" || language === "cpp" || language === "c") {
      // Index 1 is return type, Index 2 is function name
      fnName = match[2];
    } else if (language === "javascript" || language === "typescript") {
      fnName = match[1] || match[3];
    } else if (language === "python") {
      fnName = match[1];
    }

    if (fnName && !["if", "for", "while", "switch", "catch", "return"].includes(fnName)) {
      functions.push({
        name: fnName,
        calls: [],
        recursive: false,
        recursionType: "none",
      });
    }
  }

  // 2. Loop Scope & nesting depth + Function Call relationships
  let braceDepth = 0;
  let indentLevels: number[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // A. Detect loops
    if (/\bfor\b|\bwhile\b/.test(trimmed)) {
      currentNestedLevel++;
      if (currentNestedLevel > maxNestedLoops) {
        maxNestedLoops = currentNestedLevel;
      }
    }

    // Trace braces
    if (language !== "python") {
      const openBraces = (trimmed.match(/{/g) || []).length;
      const closeBraces = (trimmed.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;
      if (closeBraces > 0 && currentNestedLevel > 0) {
        currentNestedLevel = Math.max(0, currentNestedLevel - closeBraces);
      }
    } else {
      // Python indentation tracking
      const spaces = line.match(/^(\s*)/)?.[1]?.length || 0;
      if (trimmed.endsWith(":")) {
        indentLevels.push(spaces);
      } else {
        // Exiting loops if indentation decreases
        while (indentLevels.length > 0 && spaces <= indentLevels[indentLevels.length - 1]) {
          indentLevels.pop();
          currentNestedLevel = Math.max(0, currentNestedLevel - 1);
        }
      }
    }

    // B. Detect function calls
    functions.forEach((fn) => {
      // Skip scanning self in its signature
      if (trimmed.startsWith("def " + fn.name) || trimmed.includes("function " + fn.name)) {
        return;
      }
      const callPattern = new RegExp(`\\b${fn.name}\\s*\\(`, "g");
      if (callPattern.test(trimmed)) {
        // We find which function contains this call (simplistic scope match)
        // For simplicity, map to the active function (last parsed)
        const currentActiveFn = functions[functions.length - 1];
        if (currentActiveFn && currentActiveFn.name !== fn.name) {
          if (!currentActiveFn.calls.includes(fn.name)) {
            currentActiveFn.calls.push(fn.name);
          }
        }
        
        // Is it recursive?
        if (currentActiveFn && currentActiveFn.name === fn.name) {
          currentActiveFn.recursive = true;
        }
      }
    });
  });

  // Recursion categorization
  functions.forEach((fn) => {
    if (fn.recursive) {
      const fnName = fn.name;
      // Search the function block body for recursion signatures
      const fnBodyMatches = new RegExp(`\\b${fnName}\\b`, "g");
      const recursionCount = (preprocessed.match(fnBodyMatches) || []).length - 1; // subtract 1 for definition

      if (preprocessed.includes("low") && preprocessed.includes("high") && preprocessed.includes("mid")) {
        fn.recursionType = "divide_and_conquer";
        inferredPatterns.push("divide_and_conquer");
      } else if (recursionCount >= 2) {
        if (preprocessed.includes(".left") || preprocessed.includes(".right")) {
          fn.recursionType = "tree";
        } else {
          fn.recursionType = "exponential";
        }
      } else {
        fn.recursionType = "direct";
      }
      inferredPatterns.push("recursion");
    }
  });

  // 3. Infer Structures
  const codeLower = preprocessed.toLowerCase();
  
  if (codeLower.includes("left") || codeLower.includes("right") || codeLower.includes("node.val") || codeLower.includes("node.value")) {
    inferredStructures.push("tree");
  }
  if (codeLower.includes("adj") || codeLower.includes("visited") || codeLower.includes("vertex") || codeLower.includes("edge")) {
    inferredStructures.push("graph");
  }
  if (codeLower.includes("stack") || codeLower.includes("push") && codeLower.includes("pop")) {
    inferredStructures.push("stack");
  }
  if (codeLower.includes("queue") || codeLower.includes("enqueue") || codeLower.includes("dequeue") || codeLower.includes("shift")) {
    inferredStructures.push("queue");
  }
  if (codeLower.includes("dp[") || codeLower.includes("memo[")) {
    inferredStructures.push("matrix");
    inferredPatterns.push("dp");
    inferredPatterns.push("memoization");
  }
  if (codeLower.includes("grid[") || codeLower.includes("matrix[")) {
    inferredStructures.push("matrix");
  }
  if (codeLower.includes("[") && codeLower.includes("]") && inferredStructures.length === 0) {
    inferredStructures.push("array");
  }
  if (codeLower.includes("map") || codeLower.includes("dict") || codeLower.includes("hash")) {
    inferredStructures.push("hashmap");
  }

  // Deduplicate
  const uniqueStructures = Array.from(new Set(inferredStructures));
  const uniquePatterns = Array.from(new Set(inferredPatterns));

  // 4. Complexity & Confidence estimation
  let timeComplexity: CodeIR["complexityEstimate"]["time"] = "O(n)";
  let spaceComplexity: CodeIR["complexityEstimate"]["space"] = "O(1)";
  let complexityConfidence = 70;

  if (maxNestedLoops === 2) {
    timeComplexity = "O(n²)";
  } else if (maxNestedLoops === 1) {
    if (codeLower.includes("binarysearch") || codeLower.includes("mid =") || codeLower.includes("/ 2")) {
      timeComplexity = "O(log n)";
      spaceComplexity = "O(1)";
    } else {
      timeComplexity = "O(n)";
    }
  }

  if (uniquePatterns.includes("divide_and_conquer")) {
    timeComplexity = "O(n log n)";
    spaceComplexity = "O(n)";
    complexityConfidence = 80;
  } else if (uniquePatterns.includes("recursion")) {
    if (functions.some(f => f.recursionType === "exponential")) {
      timeComplexity = "O(2ⁿ)";
      spaceComplexity = "O(n)"; // stack depth
      complexityConfidence = 75;
    } else {
      timeComplexity = "O(n)";
      spaceComplexity = "O(n)";
    }
  }

  if (uniquePatterns.includes("dp")) {
    timeComplexity = "O(n²)"; // default DP knapsack etc.
    spaceComplexity = "O(n²)";
    if (codeLower.includes("dp[i]") && !codeLower.includes("dp[i][j]")) {
      timeComplexity = "O(n)";
      spaceComplexity = "O(n)";
    }
    complexityConfidence = 75;
  }

  return {
    language,
    confidence: {
      language: langConfidence,
      structures: uniqueStructures.length > 0 ? 90 : 50,
      patterns: uniquePatterns.length > 0 ? 85 : 50,
      complexity: complexityConfidence,
    },
    inferredStructures: uniqueStructures,
    inferredPatterns: uniquePatterns,
    functions,
    nestedLoops: maxNestedLoops,
    complexityEstimate: {
      time: timeComplexity,
      space: spaceComplexity,
      confidence: complexityConfidence,
    },
  };
}
