import { useCallback, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import FormLabel from "./FormLabel";

export interface TitleItem {
  id: string;
  content: string;
  subtitles?: TitleItem[];
}

const maxLevel = 2;

export function useTree(initial: TitleItem[] | (() => TitleItem[]) = []) {
  const [tree, setTree] = useState(initial);

  /**
   * null => push in titles
   * {1} => push to real subtitles
   * {1-2} => means first tile, second subtitle => addTitle("-2", "1-2-1", subtitles[1].subtitle)
   */
  const addItem = useCallback(
    (
      parentId: string | null,
      subtitles: TitleItem[] = tree,
      prefixId = parentId
    ) => {
      if (!parentId) {
        const newItem: TitleItem = {
          id: prefixId
            ? `${prefixId}-${subtitles.length}`
            : subtitles.length.toString(),
          content: "",
          subtitles: [],
        };

        subtitles.push(newItem);
        setTree([...tree]);
        return;
      }

      const index = parentId.indexOf("-");

      // const children = subtitles[Number(parentId.split("-")[0])];
      // if (!children.subtitles) children.subtitles = [];

      addItem(
        index === -1 ? null : parentId.substring(index + 1),
        subtitles[Number(parentId.split("-")[0])].subtitles,
        prefixId
      );
    },
    [tree]
  );

  /**
   * {1} => remove item
   * {1-2} => means first tile, second subtitle => removeItem("2", subtitles["1"].subtitles)
   */
  const removeItem = useCallback(
    (
      itemId: string,
      subtitles: TitleItem[] = tree,
      initialId: string = itemId
    ) => {
      const ids = itemId.split("-");
      if (ids.length === 1) {
        const idxToRemove = subtitles.findIndex((sub) => sub.id === initialId);
        if (idxToRemove === -1) return;

        subtitles.splice(idxToRemove, 1);
        setTree([...tree]);
        return;
      }

      const index = itemId.indexOf("-");
      removeItem(
        itemId.substring(index + 1),
        subtitles[Number(ids[0])].subtitles,
        initialId
      );
    },
    [tree]
  );

  return { tree, addItem, removeItem };
}

export function SectionView({
  inputName,
  titleItem,
  addTitle,
  removeTitle,
  currentLevel = 1,
}: {
  inputName: string;
  titleItem: TitleItem;
  addTitle: (parentId: string) => void;
  removeTitle: (titleId: string) => void;
  currentLevel?: number;
}) {
  const content = (
    <>
      <input
        type="text"
        className="input input-ghost"
        defaultValue={titleItem.content}
        placeholder="Section title"
        name={inputName}
        required
      />
      <button
        type="button"
        className="btn btn-ghost btn-xs btn-square ml-auto"
        onClick={() => removeTitle(titleItem.id)}
      >
        <FaTrash size={12} />
      </button>
    </>
  );

  return currentLevel === maxLevel ? (
    <div className="flex">{content}</div>
  ) : (
    // TODO: hard to read, modify some list view
    <details
      open={titleItem.subtitles && titleItem.subtitles.length > 0}
      className="bg-base-200 rounded-box mb-4"
    >
      <summary className="flex">{content}</summary>
      <ul>
        {titleItem.subtitles?.map((subtitle) => (
          <li key={subtitle.id}>
            <SectionView
              inputName={`${inputName}-${titleItem.id}`}
              titleItem={subtitle}
              addTitle={addTitle}
              removeTitle={removeTitle}
              currentLevel={currentLevel + 1}
            />
          </li>
        ))}
        <li>
          <button
            type="button"
            className="btn btn-ghost justify-start"
            onClick={() => addTitle(titleItem.id)}
          >
            <FaPlus size={12} className="mr-2" />
            Add subsection
          </button>
        </li>
      </ul>
    </details>
  );
}
