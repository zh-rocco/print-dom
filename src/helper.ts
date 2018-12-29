interface CommonObject {
  [propName: string]: any;
}

function entries(source: CommonObject) {
  return Object.keys(source).map((k) => [k, source[k]]);
}

export function shadowMerge(target: CommonObject, source: CommonObject): CommonObject {
  return entries(source).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, target);
}
