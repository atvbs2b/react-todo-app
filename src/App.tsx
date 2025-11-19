import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";

// 型定義
type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  amount: string;
  unit: "reps" | "seconds";
  sets: string;
};

type Flower = {
  id: string;
  size: number;
  color: string;
  x: number;
  y: number;
};

// 初期データ
const initTodos: Todo[] = [
  {
    id: uuid(),
    name: "スクワット",
    isDone: false,
    amount: "20回",
    unit: "reps",
    sets: "3セット",
  },
  {
    id: uuid(),
    name: "腕立て",
    isDone: false,
    amount: "15回",
    unit: "reps",
    sets: "3セット",
  },
  {
    id: uuid(),
    name: "腹筋",
    isDone: false,
    amount: "20回",
    unit: "reps",
    sets: "3セット",
  },
  {
    id: uuid(),
    name: "プランク",
    isDone: false,
    amount: "30秒",
    unit: "seconds",
    sets: "2セット",
  },
];

// 挨拶
type WelcomeMessageProps = {
  uncompletedCount: number;
};
const WelcomeMessage = ({ uncompletedCount }: WelcomeMessageProps) => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  let greeting: string;

  if (hours < 5) {
    greeting = "こんばんは";
  } else if (hours < 12) {
    greeting = "おはようございます";
  } else if (hours < 18) {
    greeting = "こんにちは";
  } else {
    greeting = "こんばんは";
  }

  return (
    <div className="text-center mb-4">
      {greeting}！
      <br />
      現在の未完了メニューは
      <span className="font-bold mx-1">{uncompletedCount}</span>
      個です。
    </div>
  );
};

// お花畑エリア
const FLOWER_COLORS = [
  "#F87171", // red-400
  "#FBBF24", // amber-400
  "#34D399", // emerald-400
  "#60A5FA", // blue-400
  "#EC4899", // pink-500
  "#A78BFA", // violet-400
];

type FlowerVectorProps = {
  fill?: string;
  size: number;
};
const FlowerVector = ({ fill = "#888", size }: FlowerVectorProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644 C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644 C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985 c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646 c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897 C313.912,311.517,287.986,337.433,255.985,337.433z" />
    </svg>
  );
};

type FlowerItemProps = {
  flower: Flower;
};
const FlowerItem = React.memo(({ flower }: FlowerItemProps) => {
  const style: React.CSSProperties = {
    left: `${flower.x}%`,
    top: `${flower.y}%`,
    transform: `rotate(${Math.random() * 30 - 15}deg)`,
  };

  return (
    <div
      className="absolute opacity-90"
      style={style}
      title={`サイズ: ${flower.size.toFixed(0)}px`}
    >
      <FlowerVector fill={flower.color} size={flower.size} />
    </div>
  );
});

type FlowerGardenProps = {
  flowers: Flower[];
  onClearRequest: () => void;
};
const FlowerGarden = React.memo(
  ({ flowers, onClearRequest }: FlowerGardenProps) => {
    return (
      <div className="mt-5">
        <div className="flex items-center justify-center relative mb-1">
          <h2 className="text-lg font-semibold">トレーニング・ガーデン</h2>
          {flowers.length > 0 && (
            <button
              onClick={onClearRequest}
              className="absolute right-0 top-0 p-1 text-gray-500 hover:text-red-500"
              title="草刈り (お花畑をリセット)"
            >
              <ScissorsIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="relative h-64 w-full overflow-hidden border-2 border-dashed border-green-300 p-2 rounded-md">
          {flowers.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-500">
              メニューを完了させて花を咲かせよう！
            </div>
          )}
          {flowers.map((flower) => (
            <FlowerItem key={flower.id} flower={flower} />
          ))}
        </div>
      </div>
    );
  }
);

// アイコン
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M439.114,69.747c0,0,2.977,2.1-43.339-11.966c-41.52-12.604-80.795-15.309-80.795-15.309l-2.722-19.297 C310.387,9.857,299.484,0,286.642,0h-30.651h-30.651c-12.825,0-23.729,9.857-25.616,23.175l-2.722,19.297 c0,0-39.258,2.705-80.778,15.309C69.891,71.848,72.868,69.747,72.868,69.747c-10.324,2.849-17.536,12.655-17.536,23.864v16.695 h200.66h200.677V93.611C456.669,82.402,449.456,72.596,439.114,69.747z" />
    <path d="M88.593,464.731C90.957,491.486,113.367,512,140.234,512h231.524c26.857,0,49.276-20.514,51.64-47.269 l25.642-327.21H62.952L88.593,464.731z M342.016,209.904c0.51-8.402,7.731-14.807,16.134-14.296 c8.402,0.51,14.798,7.731,14.296,16.134l-14.492,239.493c-0.51,8.402-7.731,14.798-16.133,14.288 c-8.403-0.51-14.806-7.722-14.296-16.125L342.016,209.904z M240.751,210.823c0-8.42,6.821-15.241,15.24-15.241 c8.42,0,15.24,6.821,15.24,15.241v239.492c0,8.42-6.821-15.24-15.24,15.24c-8.42,0-15.24-6.821-15.24-15.24V210.823z M153.833,195.608c8.403-0.51,15.624,5.894,16.134,14.296l14.509,239.492c0.51,8.403-5.894,15.615-14.296,16.125 c-8.403,0.51-15.624-5.886-16.134-14.288l-14.509-239.493C139.026,203.339,145.43,196.118,153.833,195.608z" />
  </svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);
const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
const ScissorsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M211.875,291.59l-8.506-13.629c-0.014,0.024-0.025,0.043-0.041,0.063l-0.094-0.149 c-9.273,14.539-15.207,23.981-15.207,23.981c-44.285,70.437-97.008,194.101-74.949,207.886l1.504,1.004 c3.342,2.09,7.353,1.504,9.107-1.336l112.549-179.144l-4.26-6.77L211.875,291.59z" />
    <path d="M437.191,10.833c-37.35-23.48-89.822-7.52-116.978,35.594c-10.443,16.711-15.625,35.008-15.791,52.641 c-0.168,12.367-3.928,24.312-10.445,34.676c-4.93,7.856-11.281,17.797-18.215,28.91c0.668,1.086,1.42,2.172,2.088,3.258 l16.963,26.988c4.93,7.856,9.942,15.711,14.705,23.398c18.299-21.808,44.451-36.348,73.279-38.437 c27.572-2.004,55.562-18.465,72.943-46.203C482.812,88.54,474.457,34.313,437.191,10.833z M423.07,111.102 c-14.623,23.308-42.279,32.332-61.664,20.218c-19.301-12.199-23.144-41.027-8.523-64.34c14.623-23.308,42.363-32.336,61.664-20.219 c4.832,3.039,8.696,7.117,11.549,11.883c0.025,0.039,0.047,0.086,0.072,0.129c1.381,2.324,2.516,4.813,3.412,7.426 c0.037,0.106,0.068,0.219,0.106,0.324C434.171,79.966,432.218,96.598,423.07,111.102z" />
    <path d="M213.094,262.082l0.668,1.004l-0.5-1.172C213.261,262,213.177,262,213.094,262.082z" />
    <path d="M286.205,241.946c-11.698-18.547-24.565-39.101-36.596-58.234c-12.285-19.469-23.564-37.434-31.586-49.969 c-6.6-10.363-10.194-22.308-10.36-34.676c-0.252-17.633-5.348-35.93-15.875-52.641c-18.635-29.578-49.215-46.371-78.627-46.371 c-2.256,0-4.428,0.082-6.686,0.25c-11.029,1-21.807,4.426-31.584,10.527C37.461,34.313,29.188,88.54,56.344,131.657 c17.379,27.738,45.287,44.199,72.945,46.203c34.174,2.508,64.754,22.562,83.053,51.554l11.281,17.965l36.596,58.32l128.176,203.71 c1.002,1.668,2.924,2.59,4.93,2.59c0.168,0,0.418,0,0.584-0.086c1.254-0.082,2.424-0.5,3.51-1.168l1.588-1.004 c22.058-13.785-30.748-137.449-75.033-207.886C323.972,301.856,307.177,275.118,286.205,241.946z M150.594,131.321 c-4.846,3.008-10.278,4.762-15.791,5.262c-1.086,0.086-2.256,0.168-3.342,0.168c-15.709,0-32.254-9.36-42.531-25.648 c-14.621-23.313-10.777-52.141,8.523-64.34c4.846-3.008,10.278-4.68,15.875-5.18c1.086-0.086,2.174-0.168,3.344-0.168 c15.625,0,32.168,9.274,42.445,25.566C173.74,90.294,169.98,119.122,150.594,131.321z M256.711,265.594 c-0.586,0.086-1.17,0.086-1.754,0.086c-10.112,0-18.801-7.773-19.721-18.133c-0.92-10.863,7.104-20.472,18.049-21.476 c0.584,0,1.17-0.082,1.754-0.082c10.195,0,18.8,7.77,19.718,18.133C275.761,254.981,267.656,264.676,256.711,265.594z" />
  </svg>
);

// 新しいアイコンを追加
const UndoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

// Todoリストエリア
const parseNumber = (text: string): number => {
  if (!text) return 1;
  const match = text.match(/(\d+)/);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
};

type TodoItemProps = {
  todo: Todo;
  updateIsDone: (
    id: string,
    value: boolean,
    amountStr: string,
    setsStr: string,
    unit: "reps" | "seconds"
  ) => void;
  remove: (id: string) => void;
};
const TodoItem = ({ todo, updateIsDone, remove }: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) =>
            updateIsDone(
              todo.id,
              e.target.checked,
              todo.amount,
              todo.sets,
              todo.unit
            )
          }
          className="mr-3 h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <span
            className={twMerge(
              "text-lg", // 基本のスタイル
              todo.isDone
                ? "line-through text-gray-400" // 完了時のスタイル
                : "text-gray-900" // 未完了時のスタイル
            )}
          >
            {todo.name}
          </span>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{todo.amount}</span>
            <span>{todo.sets}</span>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => remove(todo.id)}
          aria-label="削除"
          className="p-1 text-gray-500 hover:text-red-600"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

type TodoListProps = {
  todos: Todo[];
  updateIsDone: (
    id: string,
    value: boolean,
    amountStr: string,
    setsStr: string,
    unit: "reps" | "seconds"
  ) => void;
  remove: (id: string) => void;
};
const TodoList = ({ todos, updateIsDone, remove }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        現在、登録されているメニューはありません。
      </div>
    );
  }
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isDone === b.isDone) return 0;
    return a.isDone ? 1 : -1;
  });
  return (
    <div className="flex flex-col gap-3">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          remove={remove}
          updateIsDone={updateIsDone}
        />
      ))}
    </div>
  );
};

// メインのAppコンポーネント
export default function App() {
  // useStateの型定義
  const [todos, setTodos] = useState<Todo[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoUnit, setNewTodoUnit] = useState<"reps" | "seconds">("reps");
  const [newTodoAmount, setNewTodoAmount] = useState("10");
  const [newTodoSets, setNewTodoSets] = useState("3");
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todaysWeight, setTodaysWeight] = useState("");

  const todoLocalStorageKey = "KintoreTodoV3";
  const flowerLocalStorageKey = "KintoreFlowerV3";
  const weightLocalStorageKey = "KintoreWeightV3";

  // LocalStorage(初回)
  useEffect(() => {
    // Todoの復元
    try {
      const todoJsonStr = localStorage.getItem(todoLocalStorageKey);
      if (todoJsonStr && todoJsonStr !== "[]") {
        setTodos(JSON.parse(todoJsonStr));
      } else {
        setTodos(initTodos);
      }
    } catch (e) {
      console.error("Todoの復元に失敗:", e);
      setTodos(initTodos);
    }
    // 花の復元
    try {
      const flowerJsonStr = localStorage.getItem(flowerLocalStorageKey);
      if (flowerJsonStr && flowerJsonStr !== "[]") {
        setFlowers(JSON.parse(flowerJsonStr));
      }
    } catch (e) {
      console.error("花の復元に失敗:", e);
      setFlowers([]);
    }
    // 体重の読み込み
    try {
      const weightJsonStr = localStorage.getItem(weightLocalStorageKey);
      if (weightJsonStr) {
        const savedWeightData = JSON.parse(weightJsonStr);
        const todayString = new Date().toISOString().split("T")[0];
        if (savedWeightData.date === todayString) {
          setTodaysWeight(savedWeightData.weight);
        } else {
          setTodaysWeight("");
        }
      }
    } catch (e) {
      console.error("体重の復元に失敗:", e);
      setTodaysWeight("");
    }

    setInitialized(true);
  }, []);

  // LocalStorage(保存)
  // todosが変更されるたびに実行
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(todoLocalStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  // flowersが変更されるたびに実行
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(flowerLocalStorageKey, JSON.stringify(flowers));
    }
  }, [flowers, initialized]);

  // todaysWeightが変更されるたびに実行
  useEffect(() => {
    if (initialized) {
      const todayString = new Date().toISOString().split("T")[0];
      const weightData = { weight: todaysWeight, date: todayString };
      localStorage.setItem(weightLocalStorageKey, JSON.stringify(weightData));
    }
  }, [todaysWeight, initialized]);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  // 花を追加
  const addNewFlower = (
    amountStr: string,
    setsStr: string,
    unit: "reps" | "seconds"
  ) => {
    const setsCount = parseNumber(setsStr);
    const amountCount = parseNumber(amountStr);

    const MIN_SIZE = 20;
    const MAX_SIZE = 50;
    let calculatedSize: number;

    if (unit === "reps") {
      const MAX_REPS_FOR_MAX_SIZE = 30;
      const ratio = Math.min(amountCount / MAX_REPS_FOR_MAX_SIZE, 1.0);
      calculatedSize = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * ratio;
    } else {
      const MAX_SECONDS_FOR_MAX_SIZE = 60;
      const ratio = Math.min(amountCount / MAX_SECONDS_FOR_MAX_SIZE, 1.0);
      calculatedSize = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * ratio;
    }

    const newFlowers: Flower[] = [];
    for (let i = 0; i < setsCount; i++) {
      newFlowers.push({
        id: uuid(),
        size: calculatedSize,
        color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)],
        x: Math.random() * 95,
        y: Math.random() * 95,
      });
    }

    if (newFlowers.length > 0) {
      setFlowers((prevFlowers) => [...prevFlowers, ...newFlowers]);
    }
  };

  // Todo操作
  const updateIsDone = (
    id: string,
    value: boolean,
    amountStr: string,
    setsStr: string,
    unit: "reps" | "seconds"
  ) => {
    let flowerTodo: Todo | null = null;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        if (!todo.isDone && value === true) {
          flowerTodo = todo;
        }
        return { ...todo, isDone: value };
      }
      return todo;
    });
    setTodos(updatedTodos);
    if (flowerTodo) {
      addNewFlower(amountStr, setsStr, unit);
    }
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const removeCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.isDone));
  };

  // 全てのチェックを外す
  const uncheckAllTodos = () => {
    const updatedTodos = todos.map((todo) => ({ ...todo, isDone: false }));
    setTodos(updatedTodos);
  };

  // 花をすべて削除する
  const clearAllFlowers = () => {
    setFlowers([]);
  };

  // モーダル関連の関数
  const handleClearRequest = () => {
    setIsModalOpen(true);
  };
  const handleConfirmClear = () => {
    clearAllFlowers();
    setIsModalOpen(false);
  };
  const handleCancelClear = () => {
    setIsModalOpen(false);
  };

  // フォーム操作
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2〜32文字で入力してください";
    }
    return "";
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoAmount(e.target.value);
  };

  const updateNewTodoSets = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTodoSets(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodaysWeight(e.target.value);
  };

  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      amount: `${newTodoAmount || "10"}${newTodoUnit === "reps" ? "回" : "秒"}`,
      sets: `${newTodoSets || "3"}セット`,
      unit: newTodoUnit,
    };
    setTodos([...todos, newTodo]);
    setNewTodoName("");
    setNewTodoAmount("10");
    setNewTodoSets("3");
    setNewTodoUnit("reps");
    setNewTodoNameError("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 my-10">
      <h1 className="text-center text-3xl font-bold mb-4">筋トレお花畑</h1>

      <WelcomeMessage uncompletedCount={uncompletedCount} />

      <FlowerGarden flowers={flowers} onClearRequest={handleClearRequest} />

      {/* 今日の体重 */}
      <div className="mt-6 border border-gray-300 rounded-lg p-5">
        <label htmlFor="todaysWeight" className="block font-bold text-gray-700">
          今日の体重
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            id="todaysWeight"
            type="number"
            value={todaysWeight}
            onChange={handleWeightChange}
            className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: 65.5"
            min="0"
            step="0.1"
          />
          <span className="text-gray-700">kg</span>
        </div>
      </div>
      {/* 体重ここまで */}

      <div className="mt-6 border border-gray-300 rounded-lg p-5 flex flex-col gap-4">
        <h2 className="text-xl font-semibold">新しいメニューの追加</h2>

        <div>
          <label htmlFor="newTodoName" className="block mb-1 text-gray-700">
            メニュー名
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={updateNewTodoName}
            className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: 腕立て (2〜32文字)"
          />
          {newTodoNameError && (
            <div className="mt-1 text-red-600 flex items-center gap-1 text-sm">
              <AlertIcon className="w-4 h-4" />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1.5 text-gray-700">単位</label>
          <div className="flex w-full bg-gray-200 p-1 rounded-md">
            <button
              type="button"
              onClick={() => setNewTodoUnit("reps")}
              className={twMerge(
                "w-1/2 py-1.5 text-center rounded-md transition-all",
                newTodoUnit === "reps"
                  ? "bg-white border border-gray-300 shadow-sm" // 選択時
                  : "bg-transparent border-none text-gray-600 hover:bg-gray-300" // 非選択時
              )}
            >
              回数 (回)
            </button>
            <button
              type="button"
              onClick={() => setNewTodoUnit("seconds")}
              className={twMerge(
                "w-1/2 py-1.5 text-center rounded-md transition-all",
                newTodoUnit === "seconds"
                  ? "bg-white border border-gray-300 shadow-sm" // 選択時
                  : "bg-transparent border-none text-gray-600 hover:bg-gray-300" // 非選択時
              )}
            >
              耐久 (秒)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="newTodoAmount"
              className="block mb-1 text-gray-700"
            >
              {newTodoUnit === "reps" ? "回数" : "秒数"}
            </label>
            <input
              id="newTodoAmount"
              type="number"
              value={newTodoAmount}
              onChange={updateNewTodoAmount}
              className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={newTodoUnit === "reps" ? "例: 10" : "例: 30"}
              min="0"
              step="10"
            />
          </div>

          <div>
            <label htmlFor="newTodoSets" className="block mb-1 text-gray-700">
              セット数
            </label>
            <select
              id="newTodoSets"
              value={newTodoSets}
              onChange={updateNewTodoSets}
              className="w-full border border-gray-300 p-2.5 rounded-md bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num.toString()}>
                  {num}セット
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          disabled={!!newTodoNameError || newTodoName.length === 0}
          className="flex w-full items-center justify-center gap-2 p-3 text-white bg-green-600 rounded-md font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5" />
          メニューを追加
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">
          メニューリスト ({todos.length}件)
        </h2>
        <TodoList
          todos={todos}
          updateIsDone={updateIsDone}
          remove={remove}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* 新しいボタンを追加 */}
        {todos.some((todo) => todo.isDone) && (
          <>
            <button
              type="button"
              onClick={uncheckAllTodos}
              className="flex w-full items-center justify-center gap-2 p-2.5 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              <UndoIcon className="w-5 h-5" />
              チェックを全て外す (翌日用)
            </button>
            <button
              type="button"
              onClick={removeCompletedTodos}
              className="flex w-full items-center justify-center gap-2 p-2.5 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <TrashIcon className="w-5 h-5" />
              完了済みのメニューをすべて削除
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 m-4 max-w-sm w-full rounded-lg shadow-xl">
            <h3 id="modal-title" className="font-bold text-lg">
              ちょっと待って！
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                本当にお花畑をリセットする？
                <br />
                咲かせたマッチョ・フラワーが全部消えちゃうよ！
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelClear}
                className="py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                草刈りする!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}