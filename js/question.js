const getOptionPatterns = function (forms, options) {
  const { identical, permutation } = options;
  let left, right;
  if (identical) {
    left = getValue(forms[0]);
    right = copy(left);
  } else if (permutation) {
    left = getValue(randElem(forms));
    right = getValue(randElem(forms));
  }
  return [left, right];
};

const getExpression = function (operator, pattern, customForms = false, isRight = false) {
  let { forms, options } = pattern;
  let left, right;
  if (customForms) forms = [customForms];
  if (options) {
    [left, right] = getOptionPatterns(forms, options);
  } else {
    [left, right] = randElem(forms).map(getValue);
  }
  if (isRight) return `${operator} ${right}`;
  return `${left} ${operator} ${right}`;
};

const getFunction = function (expression, paramType, options) {
  switch (paramType) {
    case 'REDUCE': {
      const rand = randNum(0, 3);
      switch (rand) {
        case 0:
          return `function (acc, v) {\n  return acc + v;\n}`;
        case 1:
          return `function (acc, v, i) {\n  return acc + i;\n}`;
        case 2:
          return `(acc, v) => acc + v`;
        case 3:
          return `(acc, v, i) => acc + i`;
      }
    }
    case 'SORT': {
      const rand = randNum(0, 5);
      switch (rand) {
        case 0:
          return '';
        case 1:
          return 'function (a, b) {\n  return a - b;\n}';
        case 2:
          return 'function (a, b) {\n  return b - a;\n}';
        case 3:
          return '(a, b) => a - b';
        case 4:
          return '(a, b) => b - a';
        case 5:
          return '(a, b) => {\n  if (a > b) return 1;\n  else if (a < b) return -1;\n  else return 0;\n}';
      }
    }
  }

  if (!options) {
    const rand = randNum(0, 4);
    switch (rand) {
      case 0:
        return `function (v) {\n  return v ${expression};\n}`;
      case 1:
        return `function (v, i) {\n  return i ${expression};\n}`;
      case 2:
        return `(v) => v ${expression}`;
      case 3:
        return `v => v ${expression}`;
      case 4:
        return `(v, i) => i ${expression}`;
    }
  }

  const { type, name } = options;
  const indentedExp = expression
    .split('\n')
    .map((v) => '  ' + v)
    .join('\n');
  if (type) {
    return `const ${name} = () => {\n${indentedExp}\n}`;
  } else {
    return `function ${name}() {\n${indentedExp}\n}`;
  }
};

const getCallback = function (paramType, data) {
  switch (paramType) {
    case 'MAP': {
      const { patterns } = data.find((v) => v.category === '연산자1개');
      const operator = randElem(SIMPLE_OPERATOR);
      const pattern = patterns.find((v) => v.operators.includes(operator));
      const expression = getExpression(operator, pattern, null, true);
      return getFunction(expression);
    }
    case 'REDUCE':
    case 'SORT': {
      return getFunction(null, paramType);
    }
    case 'CONDITION': {
      const rand = randNum(0, 1);
      const operator = randElem(COMPARISON_OPERATOR);
      const expression = `${operator} ${getNumber({ 0: [0, 10] })}`;
      if (rand) return getFunction(expression);
      const operator2 = randElem(SIMPLE_OPERATOR);
      const expression2 = `${operator2} ${getNumber({ 0: [2, 3] })}`;
      return getFunction(`${expression2} ${expression}`);
    }
  }
};

const getParameters = function (iters, iter, data) {
  const { forms } = randElem(iters);
  const { count, params } = randElem(forms);
  const { length } = iter;
  if (!count) return [];

  const paramType = randElem(params);
  let lastParam;
  return [...Array(count)].map((_, i) => {
    switch (paramType) {
      case 'INT_INDEX':
        if (count > 1 && i > 0) return randNum(lastParam, length - 1);
        lastParam = randNum(0, length - 1);
        return lastParam;
      case 'M_INT_INDEX':
        if (count > 1 && i > 0) return randNum(lastParam, -1);
        lastParam = randNum(-length, -1);
        return lastParam;
      case 'NUMBER':
        return randNum(0, 5);
      case 'ARRAY':
        return getArray({ 0: [1, 2], 1: [1, 2] });
      case 'SEPARATOR':
        return getString({ 4: true });
      case 'REDUCE':
        if (i === 0) return getCallback(paramType, data);
        return convertToString(randElem(INITIAL_ACC));
      case 'INDEXOF':
        if (i === 1) return randNum(1, length - 1);
        return str(iter[randNum(0, length - 1)]);
      case 'SPLIT':
        if (i === 1) return randNum(1, length - 1);
        return str(iter[randNum(0, length - 1)]);
      case 'REPLACE': {
        if (i === 1) return getString({ 0: [0, 9], 1: true });
        const rand = randNum(0, length - 2);
        return str(iter.slice(rand, rand + randNum(1, 2)));
      }
      case 'REGEX': {
        if (i === 1) return getString({ 0: [0, 9], 1: true });
        const rand = randNum(0, 3);
        switch (rand) {
          case 0:
            return `/${iter.slice(rand, rand + randNum(1, 2))}/`;
          case 1:
            return `/${iter.slice(rand, rand + randNum(1, 2))}/g`;
          case 2:
            return `/${iter.slice(rand, rand + randNum(1, 2)).toLowerCase()}/i`;
          case 3:
            return `/${iter.slice(rand, rand + randNum(1, 2)).toLowerCase()}/gi`;
        }
      }
      case 'MATCH': {
        const numbers = iter.match(/[0-9]/g) ?? [];
        const strings = iter.match(/[a-z]/g) ?? [];
        const all = [...new Set([...numbers, ...strings])];
        let regex;

        if (all.length <= 2) {
          const rand = randNum(0, 4);
          switch (rand) {
            case 0:
              return `/${'.'.repeat(randNum(1, 3))}/g`;
            case 1:
              return `/${randElem(all)}{1,2}/g`;
            case 2:
              return `/${randElem(all)}{2}/g`;
            case 3:
              return `/${randElem(all)}{2,}/g`;
            case 4:
              return `/${randElem(all)}+/g`;
          }
        }

        const rand = randNum(0, 14);
        const [r1, r2] = randArray(all, 2);
        switch (rand) {
          case 0:
            return `/${'.'.repeat(randNum(1, 3))}/g`;
          case 1:
            return `/${randElem(all)}+/g`;
          case 2:
            return `/${r1}|${r2}/g`;
          case 3:
            return `/${randArray(all, randNum(1, 3)).sort().join('')}/g`;
          case 4:
            return getRegex('a-z');
          case 5:
            return getRegex('0-9');
          case 6:
            return getRegex('\\d');
          case 7:
            return getRegex('\\D');
          case 8:
            return `/[a-z][0-9]/g`;
          case 9:
            return `/[0-9][a-z]/g`;
          case 10:
            return `/[0-9]?[a-z]/g`;
          case 11:
            return `/[0-9][a-z]?/g`;
          case 12:
            return `/[a-z]?[0-9]/g`;
          case 13:
            return `/[a-z][0-9]?/g`;
          case 14:
            return getRegex('a-z0-9');
        }
      }
      default:
        return getCallback(paramType, data);
    }
  });
};

const getRegex = function (regex) {
  const rand = randNum(0, 5);
  switch (rand) {
    case 0:
      return `/[${regex}]/g`;
    case 1:
      return `/[${regex}]+/g`;
    case 2:
      return `/[^${regex}]/g`;
    case 3:
      return `/^[${regex}]/g`;
    case 4:
      return `/[${regex}]$/g`;
    case 5:
      return `/[^${regex}]+/g`;
  }
};

const getUnaryOperatorQuestion = function ({ patterns }) {
  const { operators, forms } = randElem(patterns);
  const term = getValue(randElem(forms));
  return `${randElem(operators)}${term}`;
};

const getOperatorQuestion = function ({ patterns }) {
  const pattern = randElem(patterns);
  const operator = randElem(pattern.operators);
  return getExpression(operator, pattern);
};

const getTwoOperatorsQuestion = function ({ patterns }, data) {
  let { operators, forms } = randElem(patterns);
  const [leftOp, rightOp] = operators.map((op) => randElem(op));
  if (forms) {
    forms = [...Array(2)].map((_, i) => [randElem(forms[i]), randElem(forms[i])]);
  }
  const [leftPattern, rightPattern] = [leftOp, rightOp].map((op) => {
    return data.find((v) => v.category === '연산자1개').patterns.find((v) => v.operators.includes(op));
  });
  const leftExp = getExpression(leftOp, leftPattern, forms?.[0]);
  const rightExp = getExpression(rightOp, rightPattern, forms?.[1], true);
  return `${leftExp} ${rightExp}`;
};

const getThreeOperatorsQuestion = function ({ patterns }, data) {
  let { operators } = randElem(patterns);
  const [leftOp, centerOp, rightOp] = operators.map((op) => randElem(op));
  const [leftPattern, rightPattern] = [leftOp, rightOp].map((op) => {
    return data.find((v) => v.category === '연산자1개').patterns.find((v) => v.operators.includes(op));
  });
  const leftExp = getExpression(leftOp, leftPattern);
  const rightExp = getExpression(rightOp, rightPattern);
  return `${leftExp} ${centerOp} ${rightExp}`;
};

const getArrayQuestion = function ({ patterns }, data) {
  const { methods, arrays } = randElem(patterns);
  const method = randElem(methods);
  const { array, lengthRange } = randElem(arrays);
  const length = randNum(...lengthRange);
  const qArray = [...Array(length)].map(() => getValue(randElem(array)));
  const qParams = getParameters(arrays, qArray, data);
  return `${arr(qArray)}.${method}(${qParams.join(', ')})`;
};

const getStringQuestion = function ({ patterns }, data) {
  const { methods, strings } = randElem(patterns);
  const method = randElem(methods);
  const { string = [], lengthRange } = randElem(strings);
  const length = randNum(...lengthRange);
  const qString = [...Array(length)].map(() => randElem([randNum(0, 9), randElem(ALPHABET)].concat(randArray(string, 1)))).join('');
  const qParams = getParameters(strings, qString, data);
  return `${str(qString)}.${method}(${qParams.join(', ')})`;
};

const getIndexQuestion = function ({ patterns }) {
  const rand = randNum(0, patterns.length - 1);
  const iter = patterns[rand];
  const length = randNum(...iter.lengthRange);
  let qIter;
  if (iter.array) {
    qIter = arr([...Array(length)].map(() => getValue(randElem(iter.array))));
  } else {
    qIter = str([...Array(length)].map(() => randElem([randNum(0, 9), randElem(ALPHABET)])).join(''));
  }
  return `${qIter}[${randNum(-1, length)}]`;
};

const getDeclaration = function (name, value) {
  const rand = randNum(0, 4);
  switch (rand) {
    case 0:
      return `var ${name};`;
    case 1:
      return `var ${name} = ${value};`;
    case 2:
      return `let ${name};`;
    case 3:
      return `let ${name} = ${value};`;
    case 4:
      return `const ${name} = ${value};`;
  }
};

const getReturnValue = function (varArr, func) {
  if (func) {
    if (varArr.length < 2) {
      const rand = randNum(0, 4);
      const var1 = randElem(varArr);
      if (rand === 0) return `return ${var1} + ${func}();`;
      if (rand === 1) return `return ${func}() + ${var1};`;
      if (rand === 2) return `return ${func}() && ${var1};`;
      if (rand === 3) return `return ${var1} && ${func}();`;
      return `return ${func}() || ${var1};`;
    }

    const rand = randNum(0, 4);
    const [var1, var2] = randArray(varArr, 2).sort();
    if (rand === 0) return `return ${var1} + ${func}() + ${var2};`;
    if (rand === 1) return `return ${func}() && ${var1} && ${var2};`;
    if (rand === 2) return `return ${func}() || ${var1} && ${var2};`;
    if (rand === 3) return `return ${func}() && ${var1} || ${var2};`;
    return `return ${func}() || ${var1} || ${var2};`;
  }

  const rand = randNum(0, 3);
  if (rand || varArr.length < 2) return `return ${randElem(varArr)};`;
  else {
    const [var1, var2] = randArray(varArr, 2).sort();
    if (rand === 1) return `return ${var1} + ${var2};`;
    if (rand === 2) return `return ${var1} && ${var2};`;
    return `return ${var1} || ${var2};`;
  }
};

const getExpressions = function (global, local, options, blockExp) {
  const [globalCount, localCount] = [randNum(...global), randNum(...local)];
  const varValue = randRange(0, 9, globalCount + localCount);
  if (varValue.length === 1) varValue = [varValue];
  let valueIndex = 0;
  const globalVar = ALPHABET.slice(0, globalCount);
  const localVar = ALPHABET.slice(0, localCount);
  const globalTop = randArray(globalVar, randNum(0, globalVar.length));
  globalTop.forEach((top) =>
    globalVar.splice(
      globalVar.findIndex((v) => v === top),
      1
    )
  );
  const globalBottom = globalVar;
  const returnValue = getReturnValue([...new Set([...globalTop, ...globalBottom])], options.func);
  const globalTopExp = globalTop.map((name) => getDeclaration(name, varValue[valueIndex++])).join('\n');
  const globalBottomExp = globalBottom.map((name) => getDeclaration(name, varValue[valueIndex++])).join('\n');
  let funcExp;
  if (blockExp) {
    funcExp = getFunction([blockExp, returnValue].join('\n'), null, options);
    return { globalTopExp, funcExp, globalBottomExp };
  } else {
    funcExp = getFunction(
      localVar
        .map((name) => getDeclaration(name, varValue[valueIndex++]))
        .insert(returnValue, randNum(0, localVar.length - 1))
        .join('\n'),
      null,
      options
    );
    return { globalTopExp, funcExp, globalBottomExp };
  }
};

const getCodeBlock = function () {
  const count = 2;
  const rand = randNum(0, 1);
  const varName = ALPHABET.slice(0, count);
  const expression = varName.map((name) => getDeclaration(name, randNum(0, 9))).join('\n');
  const secondExp = expression.split('\n')[1];
  switch (rand) {
    case 0:
      if (count > 1) {
        if (expression[0] === 'c') {
          const [keyword, name] = ['const', expression[6]];
          return `for (${keyword} ${name} = 0; ${name} < ${randNum(2, 5)}; ${name}++) {\n  ${secondExp}\n}`;
        } else {
          const [keyword, name] = [expression.slice(0, 3), expression[4]];
          return `for (${keyword} ${name} = 0; ${name} < ${randNum(2, 5)}; ${name}++) {\n  ${secondExp}\n}`;
        }
      }
    case 1:
      return `if (true) {\n  ${secondExp}\n}`;
    // case 2: return `{\n  ${secondExp}\n}`;
  }
};

const getScopeQuestion = function ({ patterns }) {
  const { global, local, local2, block, order } = randElem(patterns);

  if (local2) {
    const [name1, name2] = randArray(FUNCTION_NAME, 2).map((v) => v.toLowerCase());
    const options = {
      type: randNum(0, 1),
      name: name1,
      func: name2,
    };
    const options2 = {
      type: randNum(0, 1),
      name: name2,
    };
    const func2Exp = getExpressions(global, local2, options2).funcExp;
    const tryCatchExp = `try {\n  ${options.name}();\n} catch {\n  'error'\n}`;
    const expressions = { tryCatchExp, func2Exp, ...getExpressions(global, local, options) };
    return order
      .map((v) => expressions[`${v}Exp`])
      .filter((v) => v)
      .join('\n\n');
  }

  const options = {
    type: randNum(0, 1),
    name: randElem(FUNCTION_NAME).toLowerCase(),
  };
  const tryCatchExp = `try {\n  ${options.name}();\n} catch {\n  'error'\n}`;
  if (block) {
    const blockExp = getCodeBlock();
    const expressions = { tryCatchExp, ...getExpressions(global, local, options, blockExp) };
    return order
      .map((v) => expressions[`${v}Exp`])
      .filter((v) => v)
      .join('\n\n');
  } else {
    const expressions = { tryCatchExp, ...getExpressions(global, local, options) };
    return order
      .map((v) => expressions[`${v}Exp`])
      .filter((v) => v)
      .join('\n\n');
  }
};

const getConstructorQuestion = ({ patterns }) => {
  const pattern = randElem(patterns);
  const funcName = randElem(FUNCTION_NAME);
  const funcExp = [];
  const expression = [];

  pattern.forEach((v) => {
    switch (v) {
      case 'normal':
        funcExp.push(`this.prop = prop;`);
        break;
      case 'method':
        funcExp.push(`this.prop = prop;`);
        funcExp.push(`this.method = ${randElem(FUNC_TYPE).replace(/\n/g, '\n  ')};`);
        break;
      case 'prototype':
        expression.push(`${funcName}.prototype.prop = ${randNum(0, 9)};`);
        expression.push(`${funcName}.prototype.method = ${randElem(FUNC_TYPE)};`);
        break;
      case 'static':
        expression.push(`${funcName}.prop = ${randNum(0, 9)};`);
        expression.push(`${funcName}.method = ${randElem(FUNC_TYPE)};`);
    }
  });

  const func = `function ${funcName}(prop) {\n${funcExp.map((v) => '  ' + v).join('\n')}\n}`;
  const exp = expression.join('\n');
  const [aName, bName] = randArray(FUNCTION_NAME, 2).map((v) => v.toLowerCase());
  const aExp = `const ${aName} = new ${funcName}(${randNum(0, 9)});`;
  const bExp = `const ${bName} = new ${funcName}(${randNum(0, 9)});`;
  const constructor = ['Object', 'Function', funcName];
  const rand = randNum(0, 7);
  const enter = pattern.length === 1 ? '' : '\n\n';

  switch (rand) {
    case 0: {
      const question = `${aName}.method === ${bName}.method`;
      return `${func}\n\n${exp + enter}${aExp}\n${bExp}\n\n${getTryCatch(question)}`;
    }
    case 1: {
      const question = `new ${funcName}(${randNum(0, 9)}).prototype === ${funcName}.prototype`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 2: {
      const question = `new ${funcName}(${randNum(0, 9)}).method === ${funcName}.method`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 3: {
      const question = `new ${funcName}(${randNum(0, 9)}).method === ${funcName}.prototype.method`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 4: {
      const question = `new ${funcName}(${randNum(0, 9)}).method()`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 5: {
      const question = `${funcName}.method()`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 6: {
      const question = `new ${funcName}(${randNum(0, 9)}) instanceof ${randElem(constructor)}`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
    case 7: {
      const question = `new ${funcName}(${randNum(0, 9)}).method instanceof ${randElem(constructor)}`;
      return `${func}\n\n${exp + enter}${getTryCatch(question)}`;
    }
  }
};

const getSpreadQuestion = ({ patterns }) => {
  const { varType, answerType, form } = randElem(patterns);
  const varName = randElem(FUNCTION_NAME).toLowerCase();
  let varValue;
  if (varType === 'string') varValue = str([...Array(randNum(3, 5))].map(() => randNum(0, 9)).join(''));
  else varValue = getValue(form);

  if (answerType === 'object') {
    const declaration = `const ${varName} = ${varValue};`;
    const props = randArray(ALPHABET, randNum(0, 3))
      .map((v) => `${v}: ${randNum(0, 9)}`)
      .concat(`...${varName}`);
    return `${declaration}\n\n({${props.shuffle().join(', ')}})`;
  }

  let declaration;
  const rand = randNum(0, 2);
  if (rand) declaration = `const ${varName} = ${varValue};`;
  else declaration = `const ${varName} = new Set(${varValue});`;
  const props = randRange(0, 9, randNum(2, 3)).concat(`...${varName}`);

  if (answerType === 'array') return `${declaration}\n\n[${props.shuffle().join(', ')}]`;
  return `${declaration}\n\n[...new Set([${props.shuffle().join(', ')}])]`;
};

const getQuestion = function (data) {
  const randQuestion = randElem(data);
  const { category } = randQuestion;
  switch (category) {
    case '단항연산자':
      return [getUnaryOperatorQuestion(randQuestion), '단항연산자'];
    case '연산자1개':
      return [getOperatorQuestion(randQuestion), '이항연산자'];
    case '연산자2개':
      return [getTwoOperatorsQuestion(randQuestion, data), '연산자 우선순위'];
    case '연산자3개':
      return [getThreeOperatorsQuestion(randQuestion, data), '단축 평가, 연산자 우선순위'];
    case '배열메서드':
      return [getArrayQuestion(randQuestion, data), 'Array 메서드'];
    case '문자열메서드':
      return [getStringQuestion(randQuestion, data), 'String 메서드'];
    case '인덱스':
      return [getIndexQuestion(randQuestion), '인덱스'];
    case '스코프':
      return [getScopeQuestion(randQuestion), '스코프, 호이스팅'];
    case '생성자함수':
      return [getConstructorQuestion(randQuestion), '생성자 함수, 프로토타입'];
    case '스프레드':
      return [getSpreadQuestion(randQuestion), '스프레드 문법'];
  }
};
