// 通用 DOM 辅助
export function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === "class") e.className = attrs[k];
    else if (k === "html") e.innerHTML = attrs[k];
    else if (k === "text") e.textContent = attrs[k];
    else if (k.startsWith("on") && typeof attrs[k] === "function") {
      e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
    } else if (k === "style" && typeof attrs[k] === "object") {
      Object.assign(e.style, attrs[k]);
    } else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  }
  const kids = Array.isArray(children) ? children : [children];
  kids.forEach(c => {
    if (c == null) return;
    if (typeof c === "string" || typeof c === "number") e.appendChild(document.createTextNode(String(c)));
    else e.appendChild(c);
  });
  return e;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
