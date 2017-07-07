declare namespace ssf {
  class App {
    /**
     * A promise that resolves when the API has finished bootstrapping.
     */
    static ready(): Promise<any>;
  }
}
