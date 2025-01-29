'use strict';
import { DPL } from '../dynamic-parts-loader.js';

export const navbarNewRightButtons = DPL.defineComponent({
  selector: [
    '#dpl-navbar-new-right-buttons',
    '#dpl-navbar-right-buttons-new',
    '#dpl-navbar-right-buttons',
    '#dpl-navbar-v5-legacy-right-buttons',
  ],
  template: (userData) => {
    const userNotifications = userData.notifications || [];
    const navbarNotifications = userNotifications
      .map(
        (n) => `<li>
  <a
    class="block bg-transparent px-4 max-w-[300px] sm:max-w-md py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    href="${n.link}"
    ${n.link.indexOf('getdataden.com') === -1 ? 'target="_blank" rel="nofollow"' : ''}
    data-notification-date="${n.date}"
    data-te-dropdown-item-ref
  >${n.value}</a>
</li>`
      )
      .join('\n');

    const loginButton = `<a class="auth-modal-toggle inline-block rounded bg-primary-100 px-4 pb-[5px] pt-[7px] text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 motion-reduce:transition-none dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400" data-auth-modal-tab="sign-in">Login</a>`;

    // New early access button with conditions
    const getEarlyAccessButton =
      (!userData.isPro && !userData.isLoggedIn) || (userData.isLoggedIn && !userData.isPro)
        ? `<a href="https://mdbootstrap.com/docs/standard/getting-started/installation/" type="button" class="ms-2 inline-block rounded bg-success px-4 pb-[6px] pt-[7px] text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">MDB Free Download</a>`
        : '';

    const navbarDropdown = `<a class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none" href="#" id="dropdownMenuButton2" role="button" data-te-dropdown-toggle-ref aria-expanded="false">
  <img src="${userData.avatar}&s=24" class="rounded-full" style="height: 25px; width: 25px" alt="" loading="lazy" />
</a>
<ul
  class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
  aria-labelledby="dropdownMenuButton2"
  data-te-dropdown-menu-ref>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/profile/settings"
      target="_blank"
      data-te-dropdown-item-ref
    >Account Settings</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="/billing"
      target="_blank"
      data-te-dropdown-item-ref
    >My Orders</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/support/?user=${userData.id}"
      target="_blank"
      data-te-dropdown-item-ref
    >My Questions</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://dashboard.mdbgo.com/#/projects"
      target="_blank"
      data-te-dropdown-item-ref
    >Projects</a>
  </li>
  <hr class="m-0">
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=1&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Public snippets</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=4&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Private snippets</a>
  </li>
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?user=${userData.id}&status=2&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >Draft snippets</a>
  </li>
        ${
          (userData.groups || []).includes('Administrator')
            ? `<li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="https://mdbootstrap.com/snippets?status=4&top=all"
      target="_blank"
      data-te-dropdown-item-ref
    >All private snippets</a>
  </li>`
            : ''
        }
  <hr class="m-0">
  <li>
    <a
      class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
      href="#"
      data-logout-button-ref
      data-te-dropdown-item-ref
    >Log Out</a>
  </li>
</ul>`;

    return `<div class="relative flex items-center">
<div class="flex flex-row items-center" data-te-dropdown-ref data-te-dropdown-alignment="end">
${
  userNotifications.length > 0
    ? `<a class="hidden-arrow mr-4 flex items-center text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
  href="#"
  id="dropdownMenuButton1"
  role="button"
  data-te-dropdown-toggle-ref
  aria-expanded="false">
  <!-- Dropdown trigger icon -->
  <span class="[&>svg]:w-5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-5 w-5">
      <path
        fill-rule="evenodd"
        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
        clip-rule="evenodd" />
    </svg>
  </span>
  <!-- Notification counter -->
  <span
    class="absolute -mt-4 ml-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white"
    >${userNotifications.length}</span
  >
</a>
<ul
              class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
              aria-labelledby="dropdownMenuButton1"
              data-te-dropdown-menu-ref>
              ${navbarNotifications}
              </ul>
`
    : ``
}
</div>
<div class="flex flex-row items-center" data-te-dropdown-ref data-te-dropdown-alignment="end">
${userData.isLoggedIn ? navbarDropdown : loginButton}
${getEarlyAccessButton}
</div>
</div>`;
  },
  mounted() {
    const tmpRightButtons = document.getElementById('dpl-navbar-right-buttons-tmp');
    const tmpRightButtonsNew = document.getElementById('dpl-navbar-right-buttons-tmp-new');
    if (tmpRightButtons) tmpRightButtons.remove();
    if (tmpRightButtonsNew) tmpRightButtonsNew.remove();

    document.addEventListener('dpl_loaded', function () {
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      dropdownElementList.forEach((dropdownToggleEl) => {
        // TODO: init dropdowns
      });

      const docsAlertPlaceholder = document.querySelectorAll('.dpl-docs-alert-placeholder');
      if (docsAlertPlaceholder) docsAlertPlaceholder.forEach((e) => e.remove());

      const loginButton = document.querySelector('.auth-modal-toggle');
      const authModal = document.getElementById('navbarLogin');
      const authModalInstance = te.Modal.getOrCreateInstance(authModal);

      if (loginButton) {
        loginButton.addEventListener('click', (e) => {
          if (!authModalInstance) return;
          const alreadyOpen = document.querySelector("[data-te-open='true']");
          if (alreadyOpen && alreadyOpen !== e.target) {
            te.Modal.getInstance(alreadyOpen).hide();
          }

          authModalInstance.toggle();
        });
      }
    });
  },
});
