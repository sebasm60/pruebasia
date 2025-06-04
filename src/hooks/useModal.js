import { useCallback, useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [actions, setActions] = useState(null);
  const [size, setSize] = useState("md")

  const openModal = useCallback(({ content, title = null, actions = null, size = "md" }) => {
    setContent(content);
    setTitle(title);
    setActions(actions);
    setIsOpen(true);
    setSize(size);
  },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setTitle(null);
    setActions(null);
    setSize("md");
  }, []);

  return {
    isOpen,
    content,
    title,
    actions,
    openModal,
    closeModal,
    size,
  };
};
