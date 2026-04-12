import React, { useMemo, useState } from 'react';

type Operator = '+' | '-' | '×' | '÷';

type ButtonType = 'digit' | 'operator' | 'action' | 'equals' | 'decimal';

interface CalcButton {
  label: string;
  type: ButtonType;
  gridClass?: string;
}

const BUTTONS: CalcButton[] = [
  { label: 'AC', type: 'action' },
  { label: '+/-', type: 'action' },
  { label: '%', type: 'action' },
  { label: '÷', type: 'operator' },

  { label: '7', type: 'digit' },
  { label: '8', type: 'digit' },
  { label: '9', type: 'digit' },
  { label: '×', type: 'operator' },

  { label: '4', type: 'digit' },
  { label: '5', type: 'digit' },
  { label: '6', type: 'digit' },
  { label: '-', type: 'operator' },

  { label: '1', type: 'digit' },
  { label: '2', type: 'digit' },
  { label: '3', type: 'digit' },
  { label: '+', type: 'operator' },

  { label: '0', type: 'digit', gridClass: 'col-span-2' },
  { label: '.', type: 'decimal' },
  { label: '=', type: 'equals' },
];

const OPERATOR_TO_SYMBOL: Record<Operator, string> = {
  '+': '+',
  '-': '−',
  '×': '×',
  '÷': '÷',
};

const formatDisplay = (value: string): string => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 'Error';
  }

  const [integerPart, decimalPart] = value.split('.');
  const formattedInteger = Number(integerPart).toLocaleString('en-US');

  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const calculate = (leftValue: number, rightValue: number, operator: Operator): number => {
  switch (operator) {
    case '+':
      return leftValue + rightValue;
    case '-':
      return leftValue - rightValue;
    case '×':
      return leftValue * rightValue;
    case '÷':
      if (rightValue === 0) {
        return NaN;
      }
      return leftValue / rightValue;
    default:
      return rightValue;
  }
};

const App: React.FC = () => {
  // currentValue: the active number the user is typing.
  const [currentValue, setCurrentValue] = useState('0');
  // previousValue: stores the left side of a pending operation.
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  // operator: stores the chosen arithmetic operator.
  const [operator, setOperator] = useState<Operator | null>(null);
  // isFreshInput: true right after selecting an operator or evaluating.
  const [isFreshInput, setIsFreshInput] = useState(false);

  const expression = useMemo(() => {
    if (!operator || previousValue === null) {
      return '';
    }

    return `${formatDisplay(previousValue)} ${OPERATOR_TO_SYMBOL[operator]}`;
  }, [operator, previousValue]);

  const reset = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setIsFreshInput(false);
  };

  const applyDigit = (digit: string) => {
    if (isFreshInput) {
      setCurrentValue(digit);
      setIsFreshInput(false);
      return;
    }

    setCurrentValue((prev) => (prev === '0' ? digit : `${prev}${digit}`));
  };

  const applyDecimal = () => {
    if (isFreshInput) {
      setCurrentValue('0.');
      setIsFreshInput(false);
      return;
    }

    if (!currentValue.includes('.')) {
      setCurrentValue((prev) => `${prev}.`);
    }
  };

  const applyOperator = (nextOperator: Operator) => {
    if (operator && previousValue !== null && !isFreshInput) {
      const result = calculate(Number(previousValue), Number(currentValue), operator);
      setPreviousValue(String(result));
      setCurrentValue(String(result));
    } else {
      setPreviousValue(currentValue);
    }

    setOperator(nextOperator);
    setIsFreshInput(true);
  };

  const evaluate = () => {
    if (!operator || previousValue === null) {
      return;
    }

    const result = calculate(Number(previousValue), Number(currentValue), operator);

    setCurrentValue(String(result));
    setPreviousValue(null);
    setOperator(null);
    setIsFreshInput(true);
  };

  const toggleSign = () => {
    setCurrentValue((prev) => {
      if (prev === '0') {
        return prev;
      }
      return prev.startsWith('-') ? prev.slice(1) : `-${prev}`;
    });
  };

  const applyPercent = () => {
    setCurrentValue((prev) => String(Number(prev) / 100));
  };

  const handleButtonClick = (button: CalcButton) => {
    switch (button.type) {
      case 'digit':
        applyDigit(button.label);
        break;
      case 'decimal':
        applyDecimal();
        break;
      case 'operator':
        applyOperator(button.label as Operator);
        break;
      case 'equals':
        evaluate();
        break;
      case 'action':
        if (button.label === 'AC') reset();
        if (button.label === '+/-') toggleSign();
        if (button.label === '%') applyPercent();
        break;
      default:
        break;
    }
  };

  const isError = currentValue === 'NaN' || currentValue === 'Infinity' || currentValue === '-Infinity';

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <section className="w-full max-w-sm bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
        <header className="px-6 pt-8 pb-4 bg-gradient-to-b from-slate-700 to-slate-800">
          <p className="text-right h-6 text-sm text-slate-300 tracking-wide">{expression || 'Calculator'}</p>
          <p className="text-right text-5xl md:text-6xl font-semibold truncate" aria-live="polite">
            {isError ? 'Error' : formatDisplay(currentValue)}
          </p>
        </header>

        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-800">
          {BUTTONS.map((button) => {
            const isOperator = button.type === 'operator';
            const isEquals = button.type === 'equals';
            const isAction = button.type === 'action';

            return (
              <button
                key={button.label}
                onClick={() => handleButtonClick(button)}
                className={[
                  'h-16 rounded-2xl text-xl font-semibold transition active:scale-95',
                  button.gridClass ?? '',
                  isEquals
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                    : isOperator
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                    : isAction
                    ? 'bg-slate-500 hover:bg-slate-400 text-white'
                    : 'bg-slate-600 hover:bg-slate-500 text-white',
                ].join(' ')}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default App;
