(function() {
  if (window.location.pathname.split('/').filter(x => x).pop().toLowerCase() === 'docs') {
    const menu = document.getElementById('docs-menu');
    const sections = document.getElementsByClassName('docs-title');
    for (let i = 0; i < sections.length; i++) {
      const name = sections[i].id;
      const li = document.createElement('li');
      li.setAttribute('class', 'list-item');

      const link = document.createElement('a');
      link.setAttribute('class', 'nav-link');
      link.setAttribute('href', '#' + name);
      link.text = name;

      li.appendChild(link);
      menu.appendChild(li);
    }
  }
})();
