import { getObjectAtPath, setObjectAtPath, isObjectLiteral } from './util';
import Color from 'color';

export const tracers = {}
export const tracersById = {};
export const tracersByPath = {};
export const colorsByTracerId = {};
export const events = [];
export const ids = {}
export const regions = {};

let eventY = 0;
let scrollTop = 0;
const HEADER_ROW_HEIGHT = 40;
const BODY_ROW_HEIGHT = 30;
const virtualElements = new Map();
const CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
let colorIndex = 0;

// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
export function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);        

  var widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}

export function nextId (id) {
  if (!ids.hasOwnProperty(id)) {
    return ids[id] = 0;
  }
  const value = ids[id] + 1;
  ids[id] = value;
  return value;
}

const state = {
  currentId: null
};

export function ensureTracer (id) {
  const tracerId = tracersById[id];

  if (tracerId) {
    // return current id if already tracked
    return tracerId;
  }

  // NEW: get array of path parts
  let paths = id.split('.');
  if (paths.length > 0 && !paths[0]) {
    // relative path, prepend the current id
    id = `${state.currentId}${id}`;
    paths = id.split('.');
  } else {
    // absolute path
    state.currentId = id;
  }

  // build an array which traverses the path tree
  const tree = [];

  paths.forEach((path, i) => {
    const subPath = paths.slice(0, i + 1).join('.');
    tree.push(subPath);
  });

  tree.forEach(path => {
    let hasValue = true;
    let value = undefined;
    try {
      value = getObjectAtPath(tracers, path, true);
    } catch (e) {
      hasValue = false;
    }
    if (!hasValue) {
      const id = nextId('tracersById');
      tracersByPath[path] = id;
      tracersById[id] = path;
      setObjectAtPath(tracers, path, {});
    }
  });

  return tree[tree.length -1];
}

export function getParams (args) {
  let params = {};
  const firstArg = args[0];
  if (firstArg && args.length === 1 && firstArg.hasOwnProperty('length')) {
    const l = firstArg.length;
    for (let i = 0; i < l; i++) {
      params[i] = firstArg[i];
    }
  } else if (args.length === 1 && isObjectLiteral(firstArg)) {
    for (let key in firstArg) {
      params[key] = firstArg[key];
    }
  } else {
    const l = args.length;
    for (let i = 0; i < l; i++) {
      params[i] = args[i];
    }
  }
  return params;
}

export function trace (id, ...args) {
  const tracerPath = ensureTracer(id);
  const tracerId = tracersByPath[tracerPath];
  const params = getParams(args);
  events.push({
    path: tracerPath,
    id: id,
    tracerId: tracerId,
    params: params,
    y: eventY
  });
  eventY += BODY_ROW_HEIGHT;
}

function getVirtualElement (element, totalWidth, hasOverflow) {
  const renderContext = element.renderContext;

  if (!virtualElements.has(element)) {
    // first time render, initialise dom
    element.classList.add('trace');
    const virtual = document.createElement('div');
    virtual.classList.add('virtual');
    virtual.style.width = `${totalWidth}px`;

    const container = document.createElement('div');
    container.classList.add('virtual-container');
    container.appendChild(virtual);
    if (!hasOverflow) {
      container.style.overflowX = 'hidden';
    }

    let canvas;

    container.addEventListener('scroll', e => {
      if (!canvas) {
        canvas = element.querySelector('canvas');
      }
      const st = Math.min(renderContext.maxScrollTop, container.scrollTop);
      const sl = Math.min(renderContext.totalWidth, container.scrollLeft);
      canvas.style.left = `${-sl}px`;
      scrollTop = st;

      renderContent(renderContext);
    });

    element.appendChild(container);
    virtualElements.set(element, virtual);
  }
  return virtualElements.get(element);
}

export function render (selectorOrElement, totalWidth) {
  const element = typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
  totalWidth = typeof totalWidth === 'number' ? totalWidth : element.clientWidth;
  const hasOverflow = element.clientWidth !== totalWidth;
  const totalHeight = element.clientHeight;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = totalWidth;
  canvas.height = totalHeight;

  const renderContext = {
    element: element,
    canvas: canvas,
    ctx: ctx,
    headerNodes: [],
    totalWidth: totalWidth,
    totalHeight: totalHeight,
    headerHeight: 0,
    bodyHeight: 0,
    tracerCoords: {},
    rendered: [],
    maxScrollTop: 0
  };

  element.renderContext = renderContext;

  calcHeader(renderContext);
  renderContent(renderContext);

  element.appendChild(canvas);

  const virtualElement = getVirtualElement(element, totalWidth, hasOverflow);
  virtualElement.style.top = `${renderContext.headerHeight}px`;
  virtualElement.style.width = `${totalWidth}px`;
  virtualElement.style.height = `${renderContext.bodyHeight}px`;

  renderContext.maxScrollTop = renderContext.bodyHeight - renderContext.headerHeight - (BODY_ROW_HEIGHT * 2);

  element.addEventListener('click', e => {
    const elementOffsetX = element.getBoundingClientRect().left;
    const elementOffsetY = element.getBoundingClientRect().top;
    const x = e.pageX - elementOffsetX + element.scrollLeft;
    const y = e.pageY - elementOffsetY + element.scrollTop;
    console.log(x,y);
  });
}

function renderContent (renderContext) {
  renderContext.rendered = [];

  renderBody(renderContext);
  renderHeader(renderContext);
}

function renderShadow (ctx, x, y, w, h, opacity = 0.7) {
  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, `rgba(0,0,0,${opacity})`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
}

function calcHeader (renderContext) {
  const { header, ctx, totalWidth, tracerCoords } = renderContext;
  calcHeaderNode(renderContext, tracers, renderContext.totalWidth);
}

function calcHeaderNode (renderContext, node, availableWidth, title = null, x = 0, y = 0) {
  const headerNode = {
    title,
    availableWidth,
    x,
    y,
    color: null
  };

  renderContext.headerNodes.push(headerNode);

  if (title) {
    const parts = title.split('.');
    const parentPath = parts.slice();
    parentPath.splice(parentPath.length - 1, 1);
    const nodeTitle = parts[parts.length - 1];

    headerNode.parentPath = parentPath;
    headerNode.nodeTitle = nodeTitle;
  }

  // collect children
  const children = [];
  for (let key in node) {
    children.push({key: key, value: node[key]});
  }

  if (children.length === 0) {
    headerNode.terminates = true;
  }

  // find x, y for each child
  const subWidth = availableWidth / children.length;
  headerNode.subWidth = subWidth;
  let sx = x;
  let sy = y + HEADER_ROW_HEIGHT;
  renderContext.headerHeight = Math.max(sy, renderContext.headerHeight);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.x = sx;

    // assign color
    const midTone = 50;
    const midRemainder = 255 - midTone;
    let color = Color.rgb(midTone + Math.random() * midRemainder, midTone + Math.random() * midRemainder, midTone + Math.random() * midRemainder);
    color = color.lighten(0.1);
    colorIndex = colorIndex % CSS_COLOR_NAMES.length;
    colorsByTracerId[title ? title + '.' + child.key : child.key] = color;

    // track x for tracer id
    renderContext.tracerCoords[title ? title + '.' + child.key : child.key] = {
      x: sx,
      width: subWidth
    };

    sx += subWidth;
  }

  // calc children
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    calcHeaderNode(
      renderContext,
      child.value,
      subWidth,
      title ? title + '.' + child.key : child.key,
      child.x,
      title ? sy : 0
    );
  }
}

function renderHeader (renderContext) {
  const { ctx, totalWidth, headerHeight, headerNodes } = renderContext;

  for (let i = 0; i < headerNodes.length; i++) {
    const headerNode = headerNodes[i];
    renderHeaderNode(renderContext, headerNode);
  }
}

function renderHeaderNode (renderContext, headerNode) {
  const { ctx } = renderContext;
  const { title, availableWidth, nodeTitle, x, y } = headerNode;

  if (title) {
    // render appearance
    const color = colorsByTracerId[title];
    ctx.fillStyle = color;
    ctx.fillRect(x, y, availableWidth, HEADER_ROW_HEIGHT);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeRect(x, y, availableWidth, HEADER_ROW_HEIGHT);

    // render title
    ctx.font = "16px courier";
    ctx.textAlign = "center";
    ctx.fillStyle = color.mix(Color('black'), 0.5);
    ctx.fillText(nodeTitle, x + availableWidth / 2, y + HEADER_ROW_HEIGHT / 2 + 3, availableWidth);
  }

  if (headerNode.terminates) {
    renderShadow(ctx, x, y + HEADER_ROW_HEIGHT, availableWidth, BODY_ROW_HEIGHT / 3, 0.3);
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y + HEADER_ROW_HEIGHT, availableWidth, 1);
  }
}

function renderBody (renderContext) {
  const { headerHeight, bodyHeight, ctx, totalWidth, totalHeight, tracerCoords } = renderContext;
  const availableHeight = totalHeight - headerHeight;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, totalWidth, headerHeight);

  for (let i = 0; i < events.length; i++) {
    const { id, params, path, tracerId, x, y: ey } = events[i];
    const coords = tracerCoords[path];
    const y = ey + headerHeight - scrollTop;

    // renderContext.bodyHeight = y - headerHeight + BODY_ROW_HEIGHT;

    if (/*y <= headerHeight - BODY_ROW_HEIGHT || */y >= totalHeight) {
      continue;
    }

    // store geom for body item rendered
    renderContext.rendered.push({
      event: events[i],
      bounds: {
        top: y,
        x: coords.x,
        width: coords.width
      }
    });

    // render appearance
    const color = colorsByTracerId[tracersById[tracerId]];
    ctx.fillStyle = color.darken(0.2);
    ctx.fillRect(0, y, totalWidth, BODY_ROW_HEIGHT);
    ctx.fillStyle = color;
    ctx.fillRect(coords.x, y, coords.width, BODY_ROW_HEIGHT);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, y + BODY_ROW_HEIGHT, totalWidth, y + BODY_ROW_HEIGHT);

    // render text
    ctx.font = '12px courier';
    ctx.textAlign = 'left';
    ctx.fillStyle = color.mix(Color('black'), 0.5);
    ctx.fillText(id, coords.x, y + (BODY_ROW_HEIGHT / 2) + 3, coords.width);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  renderContext.bodyHeight = events.length * BODY_ROW_HEIGHT;
  renderContext.rendered
}

export default trace;