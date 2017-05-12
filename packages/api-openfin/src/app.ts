const ready = () => new Promise((resolve) => {
  fin.desktop.main(resolve);
});

export default {
  ready
};
