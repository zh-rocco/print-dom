interface CommonObject {
  [propName: string]: any;
}

export function shadowMerge(target: CommonObject, source: CommonObject): CommonObject {
  return Object.entries(source).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, target);
}
