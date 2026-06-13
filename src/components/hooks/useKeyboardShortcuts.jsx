import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if user is typing in an input
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const withCtrl = event.ctrlKey || event.metaKey;
      const withShift = event.shiftKey;
      const withAlt = event.altKey;

      shortcuts.forEach(({ key: shortcutKey, ctrl, shift, alt, action }) => {
        if (
          key === shortcutKey.toLowerCase() &&
          !!ctrl === withCtrl &&
          !!shift === withShift &&
          !!alt === withAlt
        ) {
          event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shortcuts]);
}