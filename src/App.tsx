import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

// --- SVG Icons ---
// ◀◀ 修正: ゴミ箱アイコン
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512" // ◀◀ viewBoxを修正
    fill="currentColor" // ◀◀ fillに変更
    {...props}
  >
    {/* ◀◀ ご提供いただいたパスデータに差し替え */}
    <path d="M439.114,69.747c0,0,2.977,2.1-43.339-11.966c-41.52-12.604-80.795-15.309-80.795-15.309l-2.722-19.297   C310.387,9.857,299.484,0,286.642,0h-30.651h-30.651c-12.825,0-23.729,9.857-25.616,23.175l-2.722,19.297   c0,0-39.258,2.705-80.778,15.309C69.891,71.848,72.868,69.747,72.868,69.747c-10.324,2.849-17.536,12.655-17.536,23.864v16.695   h200.66h200.677V93.611C456.669,82.402,449.456,72.596,439.114,69.747z" />
    <path d="M88.593,464.731C90.957,491.486,113.367,512,140.234,512h231.524c26.857,0,49.276-20.514,51.64-47.269   l25.642-327.21H62.952L88.593,464.731z M342.016,209.904c0.51-8.402,7.731-14.807,16.134-14.296   c8.402,0.51,14.798,7.731,14.296,16.134l-14.492,239.493c-0.51,8.402-7.731,14.798-16.133,14.288   c-8.403-0.51-14.806-7.722-14.296-16.125L342.016,209.904z M240.751,210.823c0-8.42,6.821-15.241,15.24-15.241   c8.42,0,15.24,6.821,15.24,15.241v239.492c0,8.42-6.821,15.24-15.24,15.24c-8.42,0-15.24-6.821-15.24-15.24V210.823z    M153.833,195.608c8.403-0.51,15.624,5.894,16.134,14.296l14.509,239.492c0.51,8.403-5.894,15.615-14.296,16.125   c-8.403,0.51-15.624-5.886-16.134-14.288l-14.509-239.493C139.026,203.339,145.43,196.118,153.833,195.608z" />
  </svg>
);

// 警告アイコン
const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

// プラスアイコン
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

// お花アイコン（プレースホルダー用）
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 13.5z"
    />
  </svg>
);

// --- 花のSVGコンポーネント ---
type FlowerVectorProps = {
  type: Flower["type"];
  color: string; // 色プロパティ
};

// 優先度に応じてサイズを変更し、指定されたSVGパスデータを返します
const FlowerVector = ({ type, color }: FlowerVectorProps) => {
  const styles: Record<Flower["type"], React.CSSProperties> = {
    gorgeous: { width: "3rem", height: "3rem" }, // 優先度1: 48px
    nice: { width: "2.5rem", height: "2.5rem" }, // 優先度2: 40px
    normal: { width: "2rem", height: "2rem" }, // 優先度3: 32px
  };

  const style = styles[type];

  // ご提供いただいたSVGパスデータを使用
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512" // viewBoxを512に変更
      fill={color} // ランダムな色を適用
      style={style} // 優先度に応じたサイズを適用
    >
      <path d="M512,223.537c0-61.46-49.773-111.264-111.264-111.264c-11.768,0-22.922,2.31-33.496,5.644   C366.948,56.657,317.346,7.084,255.985,7.084c-61.32,0-110.993,49.573-111.224,110.833c-10.573-3.334-21.728-5.644-33.496-5.644   C49.774,112.273,0,162.077,0,223.537c0,49.241,32.171,90.479,76.533,105.12c-13.294,18.354-21.276,40.656-21.276,64.985   c0,61.46,49.773,111.274,111.254,111.274c36.86,0,69.222-18.043,89.475-45.646c20.283,27.603,52.645,45.646,89.465,45.646   c61.521,0,111.264-49.813,111.264-111.274c0-24.329-7.993-46.631-21.246-64.985C479.829,314.017,512,272.779,512,223.537z    M255.985,337.433c-31.971,0-57.927-25.916-57.927-57.887c0-31.981,25.956-57.897,57.927-57.897c32,0,57.926,25.916,57.926,57.897   C313.912,311.517,287.986,337.433,255.985,337.433z" />
    </svg>
  );
};

// --- 型定義 ---
type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
};

// Flower型 (colorプロパティを持つ)
type Flower = {
  id: string;
  type: "normal" | "nice" | "gorgeous";
  x: number;
  y: number;
  color: string;
};

// --- 初期データ ---
const initTodos: Todo[] = [
  {
    id: uuid(),
    name: "解析2の宿題",
    isDone: false,
    priority: 2,
    deadline: new Date(2025, 10, 2, 17, 30),
  },
  {
    id: uuid(),
    name: "TypeScriptの勉強 (復習)",
    isDone: true,
    priority: 3,
    deadline: null,
  },
  {
    id: uuid(),
    name: "基礎物理学3の宿題",
    isDone: false,
    priority: 1,
    deadline: new Date(2025, 10, 11),
  },
];

// --- WelcomeMessage コンポーネント ---
type WelcomeMessageProps = {
  name: string;
  uncompletedCount: number;
};
const WelcomeMessage = ({ name, uncompletedCount }: WelcomeMessageProps) => {
  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12 ? "おはようございます" : "こんにちは";

  return (
    <div className="text-center text-xl text-gray-600">
      {greeting}、<span className="font-semibold text-gray-800">{name}</span>
      さん。
      <br />
      未完了のタスクは
      <span className="font-bold text-3xl mx-1.5 text-green-600">
        {uncompletedCount}
      </span>
      個です。
    </div>
  );
};

// --- FlowerItem コンポーネント ---
type FlowerItemProps = {
  flower: Flower;
};
const FlowerItem = ({ flower }: FlowerItemProps) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${flower.x}%`,
    top: `${flower.y}%`,
    opacity: 0.9,
    transition: "all 0.5s ease-out",
    transform: `rotate(${Math.random() * 30 - 15}deg)`,
  };

  return (
    <div style={style} title={`タイプ: ${flower.type}`}>
      {/* colorプロパティを渡す */}
      <FlowerVector type={flower.type} color={flower.color} />
    </div>
  );
};

// --- FlowerGarden コンポーネント ---
type FlowerGardenProps = {
  flowers: Flower[];
};
const FlowerGarden = ({ flowers }: FlowerGardenProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
        お花畑
      </h2>
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-green-200 bg-green-50 p-2 shadow-inner">
        {flowers.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-green-700 opacity-60">
            <SparklesIcon className="w-16 h-16" />
            <span className="mt-2 text-sm font-medium">
              タスクを完了させて花を咲かせよう！
            </span>
          </div>
        )}
        {flowers.map((flower) => (
          <FlowerItem key={flower.id} flower={flower} />
        ))}
      </div>
    </div>
  );
};

// --- TodoItem コンポーネント ---
type TodoItemProps = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};
const TodoItem = ({ todo, updateIsDone, remove }: TodoItemProps) => {
  const deadlineString = todo.deadline
    ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")
    : "期限なし";

  const isOverdue =
    todo.deadline && !todo.isDone && dayjs().isAfter(dayjs(todo.deadline));

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => updateIsDone(todo.id, e.target.checked)}
          className="mr-3 h-5 w-5 cursor-pointer accent-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <span
          className={twMerge(
            "mr-3 text-lg font-medium text-gray-800",
            todo.isDone && "line-through text-gray-500"
          )}
        >
          {todo.name}
        </span>
        <span
          className={twMerge(
            "mr-3 rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
            !todo.isDone &&
              todo.priority === 1 &&
              "bg-red-100 text-red-700 ring-red-200",
            !todo.isDone &&
              todo.priority === 2 &&
              "bg-amber-100 text-amber-700 ring-amber-200",
            !todo.isDone &&
              todo.priority === 3 &&
              "bg-sky-100 text-sky-700 ring-sky-200",
            todo.isDone && "bg-gray-100 text-gray-600 ring-gray-200"
          )}
        >
          優先度: {todo.priority}
        </span>
        <span
          className={twMerge(
            "text-sm",
            isOverdue && "font-bold text-red-500 animate-pulse",
            todo.isDone ? "text-gray-400" : "text-gray-500"
          )}
        >
          {deadlineString} {isOverdue && "(期限切れ!)"}
        </span>
      </div>

      <div>
        <button
          onClick={() => remove(todo.id)}
          className="rounded-full p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          aria-label="削除"
        >
          {/* ◀◀ 修正: TrashIconはw-5 h-5 (20px) が
                 デザイン的に丁度よいため、
                 SVGのviewBoxが大きくなっても
                 Tailwindのクラスでサイズを制御します */}
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- TodoList コンポーネント ---
type TodoListProps = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};
const TodoList = ({ todos, updateIsDone, remove }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8 bg-white/60 rounded-xl shadow-inner border border-gray-100">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    return a.priority - b.priority;
  });

  return (
    <div className="space-y-3">
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

// --- メインの App コンポーネント ---
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const todoLocalStorageKey = "TodoAppV2";
  const flowerLocalStorageKey = "TodoAppFlowersV2";

  // --- LocalStorage関連のuseEffect ---
  useEffect(() => {
    try {
      const todoJsonStr = localStorage.getItem(todoLocalStorageKey);
      if (todoJsonStr && todoJsonStr !== "[]") {
        const storedTodos: Todo[] = JSON.parse(todoJsonStr);
        const convertedTodos = storedTodos.map((todo) => ({
          ...todo,
          deadline: todo.deadline ? new Date(todo.deadline) : null,
        }));
        setTodos(convertedTodos);
      } else {
        setTodos(initTodos);
      }
    } catch (e) {
      console.error("Todoの復元に失敗しました:", e);
      setTodos(initTodos);
    }
    try {
      const flowerJsonStr = localStorage.getItem(flowerLocalStorageKey);
      if (flowerJsonStr && flowerJsonStr !== "[]") {
        const storedFlowers: Flower[] = JSON.parse(flowerJsonStr);
        setFlowers(storedFlowers);
      }
    } catch (e) {
      console.error("花の復元に失敗しました:", e);
      setFlowers([]);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(todoLocalStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(flowerLocalStorageKey, JSON.stringify(flowers));
    }
  }, [flowers, initialized]);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  // 花の色のパレット
  const FLOWER_COLORS = [
    "#FDBA74", // amber-300
    "#F87171", // red-400
    "#FB923C", // orange-400
    "#EC4899", // pink-500
    "#F472B6", // pink-400
    "#A78BFA", // violet-400
    "#818CF8", // indigo-400
    "#60A5FA", // blue-400
    "#38BDF8", // sky-400
    "#2DD4BF", // teal-400
  ];

  const addNewFlower = (priority: number) => {
    let type: Flower["type"];
    if (priority === 1) type = "gorgeous";
    else if (priority === 2) type = "nice";
    else type = "normal";

    // ランダムな色を選択
    const randomColor =
      FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];

    const newFlower: Flower = {
      id: uuid(),
      type: type,
      x: Math.random() * 95,
      y: Math.random() * 95,
      color: randomColor,
    };
    setFlowers((prevFlowers) => [...prevFlowers, newFlower]);
  };

  const updateIsDone = (id: string, value: boolean) => {
    let flowerTodoPriority: number | null = null;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        if (!todo.isDone && value === true) {
          flowerTodoPriority = todo.priority;
        }
        return { ...todo, isDone: value };
      }
      return todo;
    });

    setTodos(updatedTodos);

    if (flowerTodoPriority !== null) {
      addNewFlower(flowerTodoPriority);
    }
  };

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    }
    return "";
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
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
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoNameError("");
  };

  return (
    <div className="mx-auto my-10 max-w-3xl bg-zinc-50 p-6 md:p-8 rounded-2xl shadow-xl font-sans">
      <h1 className="mb-4 text-4xl font-extrabold text-center text-gray-900">
        お花畑 Todo
      </h1>
      <div className="mb-4">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
      </div>

      <FlowerGarden flowers={flowers} />

      {/* タスク追加フォーム */}
      <div className="mt-8 space-y-4 rounded-xl bg-white p-5 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">新しいタスクの追加</h2>
        <div>
          <label
            className="font-bold text-gray-700 hidden"
            htmlFor="newTodoName"
          >
            名前
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={updateNewTodoName}
            className={twMerge(
              "w-full rounded-lg border-gray-300 p-3 text-base",
              "focus:ring-2 focus:ring-green-500 focus:border-green-500 transition",
              newTodoNameError &&
                "border-red-500 outline-red-500 focus:ring-red-500 focus:border-red-500"
            )}
            placeholder="タスク名 (2〜32文字)"
          />
          {newTodoNameError && (
            <div className="ml-2 mt-1.5 flex items-center space-x-1.5 text-sm font-bold text-red-600">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>

        {/* 優先度ラジオボタン */}
        <div>
          <label className="font-bold text-gray-700 mb-2 block">優先度</label>
          <div className="flex items-center gap-x-3">
            {[
              { value: 1, label: "高", color: "red" },
              { value: 2, label: "中", color: "amber" },
              { value: 3, label: "低", color: "sky" },
            ].map(({ value, label, color }) => (
              <label
                key={value}
                className={twMerge(
                  "flex-1 cursor-pointer rounded-lg border p-3 text-center font-medium transition-all",
                  newTodoPriority === value
                    ? `border-${color}-500 bg-${color}-50 ring-2 ring-${color}-500`
                    : "border-gray-300 bg-white hover:bg-gray-100"
                )}
              >
                <input
                  id={`priority-${value}`}
                  name="priorityGroup"
                  type="radio"
                  value={value}
                  checked={newTodoPriority === value}
                  onChange={updateNewTodoPriority}
                  className="sr-only"
                />
                <span
                  className={twMerge(
                    "font-bold",
                    newTodoPriority === value
                      ? `text-${color}-700`
                      : "text-gray-700"
                  )}
                >
                  {label} ({value})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 期限 */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold text-gray-700">
            期限:
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          disabled={!!newTodoNameError || newTodoName.length === 0}
          className={twMerge(
            "flex w-full items-center justify-center gap-x-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-3 font-bold text-white shadow-lg transition-all duration-300 ease-in-out",
            "hover:from-green-600 hover:to-green-700 hover:shadow-xl",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
            (!!newTodoNameError || newTodoName.length === 0) &&
              "cursor-not-allowed opacity-40"
          )}
        >
          <PlusIcon className="w-6 h-6" />
          <span>タスクを追加する</span>
        </button>
      </div>

      {/* タスクリスト */}
      <div className="mt-8 space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          タスクリスト ({todos.length}件)
        </h2>
        <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} />
      </div>

      {/* 完了済みタスクの削除 */}
      {todos.some((todo) => todo.isDone) && (
        <button
          type="button"
          onClick={removeCompletedTodos}
          className={
            "mt-6 flex w-full items-center justify-center gap-x-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-2.5 font-bold text-white shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          }
        >
          {/* ◀◀ 修正: TrashIconのクラスも w-5 h-5 のまま
                 (512x512のSVGでも、ここで20x20に縮小されます) */}
          <TrashIcon className="w-5 h-5" />
          <span>完了済みのタスクをすべて削除</span>
        </button>
      )}
    </div>
  );
}