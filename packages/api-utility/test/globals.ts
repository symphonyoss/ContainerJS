export const stubGlobal = (name: string, object: any) => {
  const g: any = global;
  g[name] = object;
};

export const globals = (api: any) => {
  for (const name in api) {
    if (api.hasOwnProperty(name)) {
      stubGlobal(name, api[name]);
    }
  }
};
