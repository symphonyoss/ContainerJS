class app implements ssf.App {
  static ready(){
    return new Promise((resolve) => {
      fin.desktop.main(resolve);
    });
  }
};

export default app;
