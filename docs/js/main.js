(function() {
  if (window.location.pathname.split('/').filter(x => x).pop().toLowerCase() === 'docs.html') {
    const classMenu = document.getElementById('class-menu');
    const interfaceMenu = document.getElementById('interface-menu');
    const classSections = document.getElementsByClassName('docs-title');
    for (let i = 0; i < classSections.length; i++) {
      const id = classSections[i].id;
      const name = classSections[i].firstChild.innerText;
      let menu = classMenu;
      if (id.includes('-interface')) {
        menu = interfaceMenu;
      }

      const li = document.createElement('li');
      li.setAttribute('class', 'list-item');

      const link = document.createElement('a');
      link.setAttribute('class', 'nav-link');
      link.setAttribute('href', '#' + id);
      link.text = name;

      li.appendChild(link);
      menu.appendChild(li);
    }

    document.querySelectorAll('.test-results')
      .forEach(testElement => {
        testElement.addEventListener('click', () => {
          const detailClass = 'test-detail';
          if (testElement.classList.contains(detailClass)) {
            testElement.classList.remove(detailClass);
          } else {
            testElement.classList.add(detailClass);
          }
        });
      });

  }
})();
