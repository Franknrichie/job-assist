import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);
}
