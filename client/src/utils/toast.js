let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const showToast = (message, type = "info", duration = 3000) => {
  const container = createToastContainer();

  const toast = document.createElement("div");
  toast.style.cssText = `
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  // Set colors based on type
  const styles = {
    success: {
      background: "#10b981",
      color: "#ffffff",
      icon: "✓",
    },
    error: {
      background: "#ef4444",
      color: "#ffffff",
      icon: "✕",
    },
    warning: {
      background: "#f59e0b",
      color: "#ffffff",
      icon: "⚠",
    },
    info: {
      background: "#3b82f6",
      color: "#ffffff",
      icon: "ℹ",
    },
  };

  const style = styles[type] || styles.info;
  toast.style.background = style.background;
  toast.style.color = style.color;

  toast.innerHTML = `
    <span style="font-size: 18px;">${style.icon}</span>
    <span>${message}</span>
  `;

  // Add CSS animation
  if (!document.getElementById("toast-animations")) {
    const style = document.createElement("style");
    style.id = "toast-animations";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  }, duration);
};

export const toast = {
  success: (message, duration) => showToast(message, "success", duration),
  error: (message, duration) => showToast(message, "error", duration),
  warning: (message, duration) => showToast(message, "warning", duration),
  info: (message, duration) => showToast(message, "info", duration),
};
