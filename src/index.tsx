import React from 'react';
import ReactDOM from 'react-dom';
import { useCallback } from 'react';

const memoizedState: any[] = [];
let cursor = 0;

function useState(initalState: any): [any, ((state: any) => void)] {
  memoizedState[cursor] = memoizedState[cursor] || initalState;
  const currentCursor = cursor;
  function disptach(newState: any) {
    memoizedState[currentCursor] = newState;
    cursor = 0;
    render();
  }
  return [memoizedState[cursor++], disptach];
}

function useEffect(callback: () => void, deps: any[]) {
  if (!Array.isArray(memoizedState[cursor])) {
    // first
    memoizedState[cursor++] = deps;
    callback();
    return;
  }
  for (let i = 0; i < memoizedState[cursor].length; i++) {
    const dep = memoizedState[cursor][i];
    if (deps[i] !== dep) {
      memoizedState[cursor++] = deps;
      callback();
      break;
    }
  }
}

function useRef<T>(initalVal: T | null = null) {
  return {
    current: initalVal,
  }
}


const Counter = () => {
  const ref = useRef('ref');

  const domRef = React.useRef<HTMLParagraphElement>(null);

  const [firstName, setFirstName] = useState('wang');
  const [lastName, setLastName] = useState('shell');
  const [count, setCount] = useState(0);
  useEffect(() => {
    ref.current = count;
    console.log('useEffect', count, memoizedState, ref.current, domRef.current);
  }, [count]);

  function handleChangeFirstName() {
    setFirstName('hello');
  }
  function handleChangeLastName() {
    setLastName('world');
  }

  const handleChangeCount = useCallback(() => {
    setCount(count + 1)
  }, [count]);
  return (
    <div>
      <p ref={domRef}>firstName is: {firstName}, lastName is: {lastName}, count is: {count}</p>
      <button onClick={handleChangeFirstName}>click me change firstName</button>
      <button onClick={handleChangeLastName}>click me change lastName</button>
      <button onClick={handleChangeCount}>click me change count</button>
    </div>
  );
}


function render() {
  ReactDOM.render(<Counter />, document.getElementById('root'));
}

render();
