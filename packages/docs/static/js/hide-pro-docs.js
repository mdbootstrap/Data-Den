export function hideProDocs(userData) {
  const exceptionPaths = [];

  if (userData.isProSubscription) {
    document.querySelectorAll('.mdb-pro-example').forEach(function (el) {
      const docFrag = document.createDocumentFragment();
      while (el.firstChild) {
        const child = el.removeChild(el.firstChild);
        docFrag.appendChild(child);
      }
      el.parentNode.replaceChild(docFrag, el);
    });
  } else {
    const collapseSelector = 'a[data-toggle="collapse"]';
    const overviewTabSelector = 'docsTabsOverview';
    const modalToggleAttribute = 'data-toggle';
    const modalTargetAttribute = 'data-target';

    document.querySelectorAll('.mdb-pro-example').forEach((el) => {
      document.querySelectorAll(collapseSelector).forEach((codeTab) => {
        if (codeTab.parentElement.parentElement.parentElement.parentElement.contains(el)) {
          codeTab.setAttribute(modalToggleAttribute, 'modal');
          codeTab.removeAttribute('data-mdb-collapse-init');
          codeTab.setAttribute(modalTargetAttribute, '#apiRestrictedModal');
          codeTab.setAttribute('type', 'button');
          codeTab.setAttribute('href', '#');
        }
      });
    });

    if (document.querySelector('.mdb-docs-content-pro') && !exceptionPaths.includes(window.location.pathname)) {
      const apiTab = document.querySelector('#docs-tab-gettingstarted');

      if (apiTab) {
        apiTab.setAttribute(modalToggleAttribute, 'modal');
        apiTab.removeAttribute('data-mdb-tab-init');
        apiTab.setAttribute(modalTargetAttribute, '#apiRestrictedModal');
        apiTab.setAttribute('type', 'button');
        apiTab.setAttribute('href', '#');

        if (apiTab.classList.contains('active')) {
          const overviewTab = document.querySelector(overviewTabSelector);
          $(overviewTab).tab('show');
        }
      }

      const examplesTab = document.querySelector('#docs-tab-examples');
      if (examplesTab) {
        examplesTab.setAttribute(modalToggleAttribute, 'modal');
        examplesTab.setAttribute(modalTargetAttribute, '#apiRestrictedModal');
        examplesTab.setAttribute('type', 'button');
        examplesTab.setAttribute('href', '#');

        if (examplesTab.classList.contains('active')) {
          const overviewTab = document.querySelector('#docsTabsOverview');
          $(overviewTab).tab('show');
        }
      }
    }

    const event = document.createEvent('Event');
    event.initEvent('hide_pro_docs_init', true, true);
    document.dispatchEvent(event);
  }
}
