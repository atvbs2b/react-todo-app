import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
// FontAwesomeのimportを削除しました

// --- 型定義 (元 types.ts ＋ Flower) ---
// 元の Todo 型
type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
};

// Flower 型を新しく定義
type Flower = {
  id: string;
  type: "normal" | "nice" | "gorgeous";
  x: number;
  y: number;
};

// --- 初期データ (元 initTodos.ts) ---
const initTodos: Todo[] = [ // ◀◀ 型定義を追加
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

// --- WelcomeMessage コンポーネント (元 WelcomeMessage.tsx) ---
// ◀◀ Propsに型定義を追加
type WelcomeMessageProps = {
  name: string;
  uncompletedCount: number;
};
const WelcomeMessage = ({ name, uncompletedCount }: WelcomeMessageProps) => {
  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12 ? "おはようございます" : "こんにちは";

  return (
    <div className="text-center text-lg text-green-700">
      {greeting}、{name}さん。
      <br />
      現在の未完了タスクは
      <span className="font-bold text-2xl mx-1 text-red-500">
        {uncompletedCount}
      </span>
      個です。
    </div>
  );
};

// --- FlowerItem コンポーネント (新規) ---
// 個々の花を表示するコンポーネント
// ◀◀ Propsに型定義を追加
type FlowerItemProps = {
  flower: Flower;
};
const FlowerItem = ({ flower }: FlowerItemProps) => {
  // 優先度に応じてスタイル（色とサイズ）を変更
  const flowerStyles: Record<
    Flower["type"],
    { color: string; fontSize: string }
  > = {
    // 優先度3 (低)
    normal: { color: "#fef08a", fontSize: "1.5rem" }, // 黄色
    // 優先度2 (中)
    nice: { color: "#f9a8d4", fontSize: "2.0rem" }, // ピンク
    // 優先度1 (高)
    gorgeous: { color: "#f87171", fontSize: "2.5rem" }, // 赤・大きい
  };

  const style: React.CSSProperties = { // ◀◀ 型定義を追加
    position: "absolute",
    left: `${flower.x}%`,
    top: `${flower.y}%`,
    fontSize: flowerStyles[flower.type].fontSize,
    opacity: 0.9,
    transition: "all 0.5s ease-out", // ふわっと表示
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    transform: `rotate(${Math.random() * 30 - 15}deg)`, // 少しランダムに傾ける
  };

  // 優先度に応じて絵文字を変更
  const flowerEmoji = () => {
    switch (flower.type) {
      case "gorgeous":
        return "🌹"; // 優先度1
      case "nice":
        return "🌸"; // 優先度2
      case "normal":
        return "🌼"; // 優先度3
      default:
        return "🌼";
    }
  };

  return (
    <div style={style} title={`タイプ: ${flower.type}`}>
      {/* 花のアイコンを絵文字に変更 */}
      <span>{flowerEmoji()}</span>
    </div>
  );
};

// --- FlowerGarden コンポーネント (新規) ---
// お花畑エリア全体を管理するコンポーネント
// ◀◀ Propsに型定義を追加
type FlowerGardenProps = {
  flowers: Flower[];
};
const FlowerGarden = ({ flowers }: FlowerGardenProps) => {
  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold text-center text-green-700">
        🌸 お花畑 🌸
      </h2>
      {/* ここが花の咲くエリア */}
      <div className="relative h-64 w-full overflow-hidden rounded-md border-2 border-dashed border-green-500 bg-green-50 p-2 shadow-inner">
        {flowers.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-500">
            タスクを完了させて花を咲かせよう！
          </div>
        )}
        {flowers.map((flower) => (
          <FlowerItem key={flower.id} flower={flower} />
        ))}
      </div>
    </div>
  );
};

// --- TodoItem コンポーネント (元 TodoItem.tsx) ---
// ◀◀ Propsに型定義を追加
type TodoItemProps = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};
const TodoItem = ({ todo, updateIsDone, remove }: TodoItemProps) => {
  const deadlineString = todo.deadline
    ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")
    : "期限なし";

  // 期限が過ぎているかどうかの判定
  const isOverdue =
    todo.deadline && !todo.isDone && dayjs().isAfter(dayjs(todo.deadline));

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center overflow-hidden">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => updateIsDone(todo.id, e.target.checked)}
          className="mr-3 h-5 w-5 cursor-pointer text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        {/* タスク名 */}
        <span
          className={twMerge(
            "mr-2 text-lg",
            todo.isDone && "line-through text-gray-400"
          )}
        >
          {todo.name}
        </span>
        {/* 優先度 (色分け) */}
        <span
          className={twMerge(
            "mr-2 rounded-md px-2 py-0.5 text-xs font-medium",
            !todo.isDone && todo.priority === 1 && "bg-red-100 text-red-800",
            !todo.isDone && todo.priority === 2 && "bg-yellow-100 text-yellow-800",
            !todo.isDone && todo.priority === 3 && "bg-blue-100 text-blue-800",
            todo.isDone && "bg-gray-100 text-gray-500"
          )}
        >
          優先度: {todo.priority}
        </span>
        {/* 期限 */}
        <span
          className={twMerge(
            "text-sm",
            isOverdue && "font-bold text-red-600",
            todo.isDone ? "text-gray-400" : "text-gray-600"
          )}
        >
          {deadlineString} {isOverdue && "(期限切れ!)"}
        </span>
      </div>

      <div>
        <button
          onClick={() => remove(todo.id)}
          className="rounded-md p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
          aria-label="削除"
        >
          {/* 削除アイコンを絵文字に変更 */}
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );
};

// --- TodoList コンポーネント (元 TodoList.tsx) ---
// ◀◀ Propsに型定義を追加
type TodoListProps = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};
const TodoList = ({ todos, updateIsDone, remove }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  // 優先度でソート (1が一番上、かつ未完了が上)
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1; // 未完了を先に
    }
    return a.priority - b.priority; // 優先度でソート
  });

  return (
    <div className="space-y-2">
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

// --- メインの App コンポーネント (元 App.tsx) ---
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]); // ◀◀ 型定義を追加
  const [flowers, setFlowers] = useState<Flower[]>([]); // ◀◀ 型定義を追加
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null); // ◀◀ 型定義を追加
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const todoLocalStorageKey = "TodoAppV2";
  const flowerLocalStorageKey = "TodoAppFlowersV2";

  // --- LocalStorageからの復元 (初回マウント時) ---
  useEffect(() => {
    // Todoの復元
    try {
      const todoJsonStr = localStorage.getItem(todoLocalStorageKey);
      if (todoJsonStr && todoJsonStr !== "[]") {
        const storedTodos: Todo[] = JSON.parse(todoJsonStr); // ◀◀ 型定義を追加
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

    // 花の復元
    try {
      const flowerJsonStr = localStorage.getItem(flowerLocalStorageKey);
      if (flowerJsonStr && flowerJsonStr !== "[]") {
        const storedFlowers: Flower[] = JSON.parse(flowerJsonStr); // ◀◀ 型定義を追加
        setFlowers(storedFlowers);
      }
    } catch (e) {
      console.error("花の復元に失敗しました:", e);
      setFlowers([]);
    }

    setInitialized(true);
  }, []);

  // --- LocalStorageへの保存 (todos変更時) ---
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(todoLocalStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  // --- LocalStorageへの保存 (flowers変更時) ---
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(flowerLocalStorageKey, JSON.stringify(flowers));
    }
  }, [flowers, initialized]);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  // --- 新しい花を追加する関数 (新規) ---
  const addNewFlower = (priority: number) => { // ◀◀ 型定義を追加
    let type: Flower["type"]; // ◀◀ 型定義を追加
    if (priority === 1) type = "gorgeous"; // 優先度1 (高)
    else if (priority === 2) type = "nice"; // 優先度2 (中)
    else type = "normal"; // 優先度3 (低)

    const newFlower: Flower = { // ◀◀ 型定義を追加
      id: uuid(),
      type: type,
      x: Math.random() * 95, // 0-95% (端に行き過ぎないように)
      y: Math.random() * 95, // 0-95%
    };
    setFlowers((prevFlowers) => [...prevFlowers, newFlower]);
  };

  // --- updateIsDone (花を追加するロジックを修正) ---
  const updateIsDone = (id: string, value: boolean) => { // ◀◀ 型定義を追加
    let flowerTodoPriority: number | null = null; // ◀◀ 型定義を変更

    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        // 「未完了」から「完了」になった瞬間を検知
        if (!todo.isDone && value === true) {
          flowerTodoPriority = todo.priority; // このTodoの優先度で花を咲かせる
        }
        return { ...todo, isDone: value };
      }
      return todo;
    });
    setTodos(updatedTodos);

    // 花を咲かせる処理
    if (flowerTodoPriority !== null) {
      addNewFlower(flowerTodoPriority);
    }
  };

  const isValidTodoName = (name: string): string => { // ◀◀ 型定義を追加
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    }
    return "";
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => { // ◀◀ 型定義を追加
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => { // ◀◀ 型定義を追加
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => { // ◀◀ 型定義を追加
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const remove = (id: string) => { // ◀◀ 型定義を追加
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = { // ◀◀ 型定義を追加
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
    setNewTodoNameError(""); // エラーメッセージもリセット
  };

  return (
    // 背景色を画像に合わせて薄い緑に
    <div className="mx-auto mt-10 max-w-2xl bg-green-50 p-4 md:p-6 rounded-lg shadow-xl font-sans">
      <h1 className="mb-4 text-3xl font-bold text-center text-green-800">
        お花畑 Todo
      </h1>
      <div className="mb-4">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
      </div>

      {/* お花畑エリアをここに追加 */}
      <FlowerGarden flowers={flowers} />

      {/* タスク追加フォーム (デザイン改善) */}
      <div className="mt-5 space-y-3 rounded-md border bg-white p-4 shadow">
        <h2 className="text-lg font-bold text-gray-800">新しいタスクの追加</h2>
        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold hidden" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="タスク名 (2〜32文字)"
            />
          </div>
          {newTodoNameError && (
            <div className="ml-2 mt-1 flex items-center space-x-1 text-sm font-bold text-red-500">
              {/* 警告アイコンを絵文字に変更 */}
              <span className="mr-0.5">⚠️</span>
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="font-bold">優先度:</div>
          {[1, 2, 3].map((value) => (
            <label
              key={value}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <input
                id={`priority-${value}`}
                name="priorityGroup"
                type="radio"
                value={value}
                checked={newTodoPriority === value}
                onChange={updateNewTodoPriority}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span
                className={twMerge(
                  "font-medium",
                  value === 1 && "text-red-600",
                  value === 2 && "text-yellow-600",
                  value === 3 && "text-blue-600"
                )}
              >
                {value} ({value === 1 ? "高" : value === 2 ? "中" : "低"})
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold">
            期限:
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm") // 秒を削除
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-300 px-2 py-1"
          />
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          disabled={!!newTodoNameError || newTodoName.length === 0}
          className={twMerge(
            "w-full rounded-md bg-indigo-500 px-3 py-2 font-bold text-white hover:bg-indigo-600 transition-colors",
            (!!newTodoNameError || newTodoName.length === 0) &&
              "cursor-not-allowed opacity-50"
          )}
        >
          追加
        </button>
      </div>

      {/* タスクリスト */}
      <div className="mt-6 space-y-2">
        <h2 className="text-xl font-bold text-green-700">
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
            "mt-5 w-full rounded-md bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-600 transition-colors"
          }
        >
          {/* 削除アイコンを絵文字に変更 */}
          <span className="mr-2">🗑️</span>
          完了済みのタスクをすべて削除
        </button>
      )}
    </div>
  );
}