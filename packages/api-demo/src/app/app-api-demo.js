ssf.app.ready().then(() => {
  document.getElementById('set-badge-count').onclick = () => {
    ssf.app.setBadgeCount(Number(document.getElementById('badge-count').value));
  };
});
