import React from "react";
import type { Todo } from "./types";
import dayjs from "dayjs"; // ◀◀ 追加

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoItem = (props: Props) => {
  const todo = props.todo;

  // ▼▼ 追加: 期限をフォーマットする
  const deadlineString = todo.deadline
    ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")
    : "期限なし";
  // ▲▲ 追加

  return (
    // ▼▼ 編集: レイアウト調整
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center">
        {" "}
        {/* flex-wrap を追加 */}
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
          className="mr-1.5 cursor-pointer"
        />
        {/* タスク名 */}
        <span className="mr-2">{todo.name}</span>
        {/* 優先度 */}
        <span className="mr-2 rounded-md bg-gray-300 px-2 py-0.5 text-sm">
          優先度: {todo.priority}
        </span>
        {/* 期限 */}
        <span className="text-sm text-gray-600">{deadlineString}</span>
      </div>
      {/* ▲▲ 編集 */}

      <div>
        <button
          onClick={() => props.remove(todo.id)}
          className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TodoItem;